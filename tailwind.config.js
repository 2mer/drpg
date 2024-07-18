/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			width: {
				res: 'var(--pixel-res)',
				'res-4': 'calc(4*var(--pixel-res))',
				'res-5': 'calc(5*var(--pixel-res))',
			},
			height: {
				res: 'var(--pixel-res)',
				'res-4': 'calc(4*var(--pixel-res))',
				'res-5': 'calc(5*var(--pixel-res))',
			},
			borderRadius: {
				res: 'var(--pixel-res)',
			}
		},
	},
	plugins: [],
}

