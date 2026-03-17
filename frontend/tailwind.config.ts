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
        bg: "#020611",
        panel: "#0b1325",
        accent: "#15c4ff",
        accent2: "#7d5dff",
        space: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        indigo: {
          500: "#6366f1",
        },
      },
      boxShadow: {
        glass: "0 10px 40px rgba(15, 28, 63, 0.45)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.3)",
        "glow-indigo": "0 0 20px rgba(99, 102, 241, 0.3)",
      },
      backgroundImage: {
        nebula:
          "radial-gradient(circle at 20% 20%, rgba(21, 196, 255, 0.25), transparent 30%), radial-gradient(circle at 80% 10%, rgba(125, 93, 255, 0.22), transparent 25%), radial-gradient(circle at 50% 80%, rgba(31, 101, 205, 0.30), transparent 40%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
