import React from "react";
import { Particles } from "react-particles-js";

const CustomParticles = () => {
  return (
    <Particles
      style={{ position: "absolute" }}
      height="100%"
      width="100%"
      params={{
        particles: {
          number: {
            value: 380,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#f7f7f7",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: "img/github.svg",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.13415509907748635,
            random: false,
            anim: {
              enable: false,
              speed: 0.3996003996003996,
              opacity_min: 0.11988011988011989,
              sync: true,
            },
          },
          size: {
            value: 2,
            random: true,
            anim: {
              enable: false,
              speed: 95.90409590409591,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: false,
            distance: 240.5118091298284,
            color: "#ffffff",
            opacity: 0.8898936937803652,
            width: 1.2827296486924182,
          },
          move: {
            enable: true,
            speed: 2.0,
            direction: "top-right",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: false,
              mode: "repulse",
            },
            onclick: {
              enable: false,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      }}
    />
  );
};

export default CustomParticles;
