import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#795548", // VPTC Brown
                secondary: "#d7ccc8", // VPTC Sandle
                accent: "#8d6e63", // Medium Brown
            },
        },
    },
    plugins: [],
};
export default config;
