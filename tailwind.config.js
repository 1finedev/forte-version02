module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "red-uOrbit": "uOrbit 6s linear infinite",
        "green-uOrbit": "uOrbit 3s linear infinite",
        "blue-sOrbit": "sOrbit 2s linear infinite",
      },
      keyframes: {
        sOrbit: {
          "0%": {
            transform: "rotate(360deg) translateX(-6px) rotate(-360deg)",
          },
          "100%": {
            transform: "rotate(0deg) translateX(-6px) rotate(-0deg)",
          },
        },
        uOrbit: {
          "0%": {
            transform: "rotate(0deg) translateX(9px) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg) translateX(9px) rotate(-0deg)",
          },
        },
      },
      fontFamily: {
        brand: ["Quattrocento", "sans-serif"],
        heading: ["barlow", "sans-serif"],
      },
      transitionTimingfunction: {
        bloop: "cubic-bezier(1,-0.65,0,2.31)",
      },
      colors: {
        brandPurple: "#953553",
        brandBg: "#FAFCFF",
        brandText: "#758497",
        mainColor: "var(--mainColor)",
      },
      boxShadow: {
        side: "35px 35px 0px 10px white",
        sideBottom: "35px -35px 0px 10px white",
      },
    },
  },
  plugins: [],
};
