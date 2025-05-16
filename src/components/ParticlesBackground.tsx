import React, { useId, useState, useEffect } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

type ParticlesBackgroundProps = {
  id?: string;
  className?: string;
  background?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  transparent?: boolean;
};

const ParticlesBackground = ({
  id,
  className,
  background = "transparent",
  particleColor = "#9b87f5",
  particleDensity = 80,
  minSize = 0.8,
  maxSize = 2.5,
  speed = 2,
  transparent = true,
}: ParticlesBackgroundProps) => {
  const [init, setInit] = useState(false);
  const generatedId = useId();

  useEffect(() => {
    const initializeParticles = async () => {
      try {
        // loadSlim returns the engine
        const engine = await loadSlim();
        if (engine) {
          setInit(true);
        }
      } catch (error) {
        console.error("Error initializing particles:", error);
      }
    };

    initializeParticles();
  }, []);

  const particlesLoaded = async (container?: any) => {
    if (container) {
      console.log("Particles container loaded");
    }
  };

  return (
    <div className={cn("fixed top-0 left-0 w-full h-full z-0 pointer-events-none", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background,
              },
            },
            fullScreen: {
              enable: false,
              zIndex: 0,
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: {
                  enable: true,
                  factor: 1,
                  value: 1,
                },
              },
              modes: {
                push: {
                  quantity: 6,
                },
                repulse: {
                  distance: 150,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: particleColor,
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: speed,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  height: 800,
                  width: 800,
                  value: particleDensity,
                },
                value: particleDensity,
              },
              opacity: {
                value: {
                  min: 0.1,
                  max: 0.8,
                },
                animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
                  startValue: "random",
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: {
                  min: minSize,
                  max: maxSize,
                },
                animation: {
                  enable: true,
                  speed: 3,
                  sync: false,
                  startValue: "random",
                },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </div>
  );
};

export default ParticlesBackground;
