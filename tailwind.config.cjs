/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'nae-blue': '#2563eb',
				'nae-navy': '#1e293b', 
				'nae-orange': '#f59e0b',
				'nae-yellow': '#fbbf24',
			}
		},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: [
			"light", 
			"dark", 
			"business",
			"corporate",
			{
				"nae-custom": {
					"primary": "#2563eb", // Blue from your logo
					"secondary": "#f59e0b", // Orange/yellow from logo
					"accent": "#fbbf24", // Yellow accent
					"neutral": "#1e293b", // Navy
					"base-100": "#ffffff", // White background
					"base-200": "#f8fafc", // Light gray
					"base-300": "#e2e8f0", // Medium gray
					"base-content": "#1e293b", // Dark text
					"info": "#3b82f6",
					"success": "#10b981",
					"warning": "#f59e0b",
					"error": "#ef4444",
				}
			}
		],
		darkTheme: "dark",
		logs: false,
	}
}
