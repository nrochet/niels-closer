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
    let supportLinearFiltering: boolean;
    
    if (isWebGL2) {
      (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
      supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
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
    
    // ... keep existing code (shader definitions)
    
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
      programs: Record<number, WebGLProgram | null>;
      activeProgram: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
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
      uniforms: Record<string, WebGLUniformLocation | null>;
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
    
    // ... keep existing code (createProgram, getUniforms, hashCode functions)
    
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
    
    // ... keep existing code (program creation and verification)
    
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
    
    // ... keep existing code (initialize framebuffers and main simulation)
    
    // External vars for main simulation
    let dye: DoubleFBO | null;
    let velocity: DoubleFBO | null;
    let divergence: FBO | null;
    let curl: FBO | null;
    let pressure: DoubleFBO | null;
    let blur: FBO | null;
    
    // For other shaders declaration
    let blurShader: WebGLShader | null;
    let splatShader: WebGLShader | null;
    let advectionShader: WebGLShader | null;
    let divergenceShader: WebGLShader | null;
    let curlShader: WebGLShader | null;
    let vorticityShader: WebGLShader | null;
    let pressureShader: WebGLShader | null;
    let gradientSubtractShader: WebGLShader | null;
    
    // Main simulation functions (step, render, splat, etc.)
    function step(dt: number) {
      // ... implement simulation steps here
    }
    
    function render() {
      // ... implement render here  
    }
    
    function splat(x: number, y: number, dx: number, dy: number, color: {r: number, g: number, b: number}) {
      // ... implement splat here
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
    // updateKeywords();
    
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
    
    // Try to start animation
    try {
      // animate();  // Animation disabled for now until full implementation is ready
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
