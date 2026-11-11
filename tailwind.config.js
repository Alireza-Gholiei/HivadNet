/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./utilities/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                sm: "200px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
            },
        },
    },
    plugins: [],
};
