import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563EB", // Blue
                secondary: "#1E293B", // Dark Slate
                accent: "#F59E0B", // Amber
            },
        },
    },
    plugins: [],
};
export default config;
