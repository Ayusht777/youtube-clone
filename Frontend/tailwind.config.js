/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#121212', // Dark black for background
          light: '#1E1E1E',   // Slightly lighter black for card sections
        },
        text: {
          primary: '#FFFFFF',   // White text for headings or buttons
          secondary: '#BBBBBB', // Muted gray text for secondary items
          placeholder: '#777777', // Placeholder text (email, password fields)
        },
        button: {
          DEFAULT: '#FFFFFF',  // White buttons (e.g., "Log in")
          text: '#000000',     // Black text for buttons
          border: '#333333',   // Subtle border around button
          hover: '#1E1E1E',    // Lighter white on hover
        },
        input: {
          background: '#1E1E1E', // Input field background
          border: '#333333',     // Input borders
          text: '#E5E5E5',       // Light gray input text
          placeholder: '#888888' // Input placeholder color
        },
        divider: '#3C3C3C',   // Divider lines
        social: {
          google: '#EA4335',  // Google Red Accent
          facebook: '#4267B2' // Facebook Blue Accent
        },
        link: '#FFFFFF',      // Sign-up link color
        linkHover: '#BBBBBB'  // Lighter on hover
      },
    },
  },
  plugins: [],
};
