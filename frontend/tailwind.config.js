/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'note-yellow': '#fef3c7',
                'note-pink': '#fce7f3',
                'note-blue': '#dbeafe',
                'note-green': '#d1fae5',
                'note-purple': '#e9d5ff',
            },
        },
    },
    plugins: [],
}