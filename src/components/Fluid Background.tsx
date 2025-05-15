import React, { useEffect, useRef } from "react";

const FluidBackground = ({
  simResolution = 128,
  dyeResolution = 1024,
  densityDissipation = 0.97,
  velocityDissipation = 0.98,
  pressure = 0.8,
  pressureIterations = 20,
  curl = 30,
  splatRadius = 0.3,
  splatForce = 6000,
  shading = true,
  colorUpdateSpeed = 12,
  colorPalette = [
    { r: 0.3, g: 0.1, b: 0.9 },  // Purple
    { r: 0.0, g: 0.5, b: 0.9 },  // Ocean Blue
    { r: 0.1, g: 0.3, b: 0.7 },  // Deep Blue
    { r: 0.4, g: 0.2, b: 0.8 },  // Lavender
  ],
  transparent = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Configure WebGL context
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };
    
    // Explicitly get WebGL context to avoid TypeScript errors
    const gl = canvas.getContext("webgl2", params) || 
               canvas.getContext("webgl", params) as WebGLRenderingContext | null;
               
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Initialize WebGL extensions and capabilities
    const isWebGL2 = canvas.getContext("webgl2") !== null;
    let halfFloat: any;
    let supportLinearFiltering: any;
    
    if (isWebGL2) {
      (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }
    
    gl.clearColor(0.0, 0.0, 0.0, transparent ? 0.0 : 1.0);
    
    // Define data types and formats
    const halfFloatTexType = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;
    let formatRGBA: { internalFormat: number, format: number } | null;
    let formatRG: { internalFormat: number, format: number } | null;
    let formatR: { internalFormat: number, format: number } | null;
    
    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      formatRGBA = getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }
    
    // Helper function to check format support
    function getSupportedFormat(gl: WebGLRenderingContext, internalFormat: number, format: number, type: number) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case (gl as WebGL2RenderingContext).R16F: 
            return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
          case (gl as WebGL2RenderingContext).RG16F: 
            return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, type);
          default: return null;
        }
      }
      return { internalFormat, format };
    }
    
    function supportRenderTextureFormat(gl: WebGLRenderingContext, internalFormat: number, format: number, type: number) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }
    
    // Shader code
    const baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);
    
    if (!baseVertexShader) {
      console.error("Failed to compile base vertex shader");
      return;
    }
    
    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
      
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;
    
    const blurShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      
      void main() {
          vec3 result = vec3(0.0);
          for (int i = -2; i <= 2; i++) {
              for (int j = -2; j <= 2; j++) {
                  vec2 offset = vec2(float(i), float(j)) * texelSize;
                  result += texture2D(uTexture, vUv + offset).rgb;
              }
          }
          gl_FragColor = vec4(result / 25.0, 1.0);
      }
    `);
    
    const splatShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `);
    
    const advectionShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `, supportLinearFiltering ? undefined : ["MANUAL_FILTERING"]);
    
    // Other shader definitions
    const divergenceShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);
    
    const curlShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);
    
    const vorticityShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 vel = texture2D(uVelocity, vUv).xy;
          vel += force * dt;
          vel = min(max(vel, -1000.0), 1000.0);
          gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `);
    
    const pressureShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);
    
    const gradientSubtractShader = compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);
    
    // Updated compileShader function with proper error handling and typing
    function compileShader(gl: WebGLRenderingContext, type: number, source: string, keywords?: string[] | undefined): WebGLShader | null {
      source = addKeywords(source, keywords);
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }
    
    function addKeywords(source: string, keywords?: string[]): string {
      if (!keywords) return source;
      let keywordsString = "";
      keywords.forEach(keyword => {
        keywordsString += "#define " + keyword + "\n";
      });
      return keywordsString + source;
    }

    // Material and program classes with improved error handling
    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: any[];
      activeProgram: WebGLProgram | null;
      uniforms: any[];

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = [];
      }
      
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) {
          hash += hashCode(keywords[i]);
        }
        
        let program = this.programs[hash];
        if (program == null) {
          let fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          if (!fragmentShader) {
            console.error("Failed to compile fragment shader with keywords:", keywords);
            return;
          }
          program = createProgram(this.vertexShader, fragmentShader);
          if (!program) {
            console.error("Failed to create program with keywords:", keywords);
            return;
          }
          this.programs[hash] = program;
        }
        
        if (program === this.activeProgram) return;
        
        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      
      bind() {
        if (!this.activeProgram) {
          console.error("Cannot bind material: no active program");
          return;
        }
        gl.useProgram(this.activeProgram);
      }
    }

    class Program {
      uniforms: any;
      program: WebGLProgram | null;

      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        
        if (this.program) {
          this.uniforms = getUniforms(this.program);
        } else {
          console.error("Failed to create WebGL program");
        }
      }
      
      bind() {
        if (!this.program) {
          console.error("Cannot bind program: program is null");
          return;
        }
        gl.useProgram(this.program);
      }
    }
    
    // Improved createProgram with better error handling
    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      if (!vertexShader || !fragmentShader) {
        console.error("Cannot create program: shaders are null");
        return null;
      }
      
      const program = gl.createProgram();
      if (!program) {
        console.error("Failed to create WebGL program");
        return null;
      }
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      
      return program;
    }
    
    // Improved getUniforms with better error handling
    function getUniforms(program: WebGLProgram) {
      if (!program) {
        console.error("Cannot get uniforms: program is null");
        return {};
      }
      
      const uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      
      for (let i = 0; i < uniformCount; i++) {
        const uniformInfo = gl.getActiveUniform(program, i);
        if (uniformInfo) {
          const uniformName = uniformInfo.name;
          (uniforms as any)[uniformName] = gl.getUniformLocation(program, uniformName);
        }
      }
      
      return uniforms;
    }
    
    function hashCode(s: string): number {
      if (s.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }
    
    // Check if we can proceed with creating programs
    if (!baseVertexShader || !blurShader || !splatShader || !advectionShader ||
        !divergenceShader || !curlShader || !vorticityShader || !pressureShader || 
        !gradientSubtractShader) {
      console.error("Failed to compile one or more shaders. Cannot proceed.");
      return;
    }
    
    // Creating the programs
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);
    if (!displayMaterial.activeProgram) {
      displayMaterial.setKeywords(shading ? ["SHADING"] : []);
    }
    
    const blurProgram = new Program(baseVertexShader, blurShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    
    // Check if all programs were created successfully
    if (!blurProgram.program || !splatProgram.program || !advectionProgram.program ||
        !divergenceProgram.program || !curlProgram.program || !vorticityProgram.program ||
        !pressureProgram.program || !gradientSubtractProgram.program) {
      console.error("Failed to create one or more WebGL programs. Cannot proceed.");
      return;
    }
    
    // Framebuffer setup
    function getResolution(resolution: number) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      
      let min = Math.round(resolution);
      let max = Math.round(resolution * aspectRatio);
      
      if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
      else
        return { width: min, height: max };
    }
    
    interface FBO {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    }
    
    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO | null {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      if (!texture) return null;
      
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      
      const fbo = gl.createFramebuffer();
      if (!fbo) return null;
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      const texelSizeX = 1.0 / w;
      const texelSizeY = 1.0 / h;
      
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }
    
    interface DoubleFBO {
      read: FBO;
      write: FBO;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      swap: () => void;
    }
    
    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO | null {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      
      if (!fbo1 || !fbo2) return null;
      
      return {
        read: fbo1,
        write: fbo2,
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        swap() {
          let temp = this.read;
          this.read = this.write;
          this.write = temp;
        }
      };
    }
    
    // Vertex setup
    const buffer = gl.createBuffer();
    if (!buffer) {
      console.error("Failed to create buffer");
      return;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.error("Failed to create index buffer");
      return;
    }
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    
    // Blit function
    function blit(target?: FBO | null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
    
    // Initialize framebuffers
    const simRes = getResolution(simResolution);
    const dyeRes = getResolution(dyeResolution);
    
    const texType = halfFloatTexType;
    if (!formatRGBA || !formatRG || !formatR) {
      console.error("Could not find compatible texture formats");
      return;
    }
    
    const rgba = formatRGBA;
    const rg = formatRG;
    const r = formatR;
    
    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    
    const dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    const velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    const divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    const curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    const pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    const blur = createFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    
    if (!dye || !velocity || !divergence || !curl || !pressure || !blur) {
      console.error("Failed to create framebuffers");
      return;
    }
    
    // Update display material keywords
    function updateKeywords() {
      const displayKeywords = [];
      if (shading) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }
    
    // Main simulation step
    function step(dt: number) {
      gl.disable(gl.BLEND);
      
      // Curl calculation
      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);
      
      // Apply vorticity force
      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, curl);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();
      
      // Divergence calculation
      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);
      
      // Pressure calculation
      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      
      for (let i = 0; i < pressureIterations; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }
      
      // Gradient subtraction
      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();
      
      // Advection
      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      
      if (!supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      
      let velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, velocityDissipation);
      blit(velocity.write);
      velocity.swap();
      
      // Advect dye
      gl.viewport(0, 0, dyeRes.width, dyeRes.height);
      
      if (!supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, densityDissipation);
      blit(dye.write);
      dye.swap();
      
      // Optional: Apply blur for a softer look
      if (blurProgram.program) {
        blurProgram.bind();
        gl.uniform2f(blurProgram.uniforms.texelSize, dye.texelSizeX, dye.texelSizeY);
        gl.uniform1i(blurProgram.uniforms.uTexture, dye.read.attach(0));
        blit(blur);
      }
    }
    
    // Render function
    function render() {
      if (!displayMaterial.activeProgram) {
        console.error("Cannot render: display material has no active program");
        gl.clearColor(0, 0, 0, transparent ? 0 : 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      
      if (transparent) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
      } else {
        gl.disable(gl.BLEND);
      }
      
      displayMaterial.bind();
      gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / gl.drawingBufferWidth, 1.0 / gl.drawingBufferHeight);
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      
      blit(null);
    }
    
    // Create splat effect
    function splat(x: number, y: number, dx: number, dy: number, color: {r: number, g: number, b: number}) {
      if (!splatProgram.program) {
        console.error("Cannot create splat: splat program is null");
        return;
      }
      
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(splatRadius / 100.0));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }
    
    function correctRadius(radius: number): number {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }
    
    // Color generation for splats
    function getNextColor() {
      return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }
    
    // Automatic splats for background motion
    let lastTime = Date.now();
    
    function autoSplat() {
      const t = Date.now() / 1000;
      const x = canvas.width * (0.5 + 0.2 * Math.sin(t));
      const y = canvas.height * (0.5 + 0.2 * Math.cos(t * 1.1));
      
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      const color = getNextColor();
      splat(x, y, dx, dy, color);
      
      // Schedule next auto splat
      setTimeout(autoSplat, 600 + Math.floor(Math.random() * 1200));
    }
    
    // Initialize the simulation
    updateKeywords();
    
    // Start with some initial splats only if all programs are valid
    if (displayMaterial.activeProgram && splatProgram.program) {
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        splat(x, y, dx, dy, color);
      }
    
      // Auto splats at random intervals
      setTimeout(autoSplat, 1000);
    }
    
    // Animation loop
    let animationFrameId: number;
    
    function animate() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      
      try {
        step(dt);
        render();
        animationFrameId = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Animation error:", error);
        cancelAnimationFrame(animationFrameId);
      }
    }
    
    try {
      animate();
    } catch (error) {
      console.error("Failed to start animation:", error);
    }
    
    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [canvasRef, simResolution, dyeResolution, densityDissipation, velocityDissipation, pressure, pressureIterations, curl, splatRadius, splatForce, shading, colorUpdateSpeed, colorPalette, transparent]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default FluidBackground;
