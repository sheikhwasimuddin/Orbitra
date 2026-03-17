import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030711",
        panel: "#0b1325",
        accent: "#15c4ff",
        accent2: "#7d5dff",
      },
      boxShadow: {
        glass: "0 10px 40px rgba(15, 28, 63, 0.45)",
      },
      backgroundImage: {
        nebula:
          "radial-gradient(circle at 20% 20%, rgba(21, 196, 255, 0.25), transparent 30%), radial-gradient(circle at 80% 10%, rgba(125, 93, 255, 0.22), transparent 25%), radial-gradient(circle at 50% 80%, rgba(31, 101, 205, 0.30), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
