/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sarena: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['var(--font-heading)', 'Poppins', 'system-ui', 'sans-serif'],
        badge: ['var(--font-badge)', 'Fredoka', 'Comic Sans MS', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glow: '0 0 40px rgba(251, 191, 36, 0.35)',
        'glow-sm': '0 0 20px rgba(251, 191, 36, 0.25)',
        'glow-pink': '0 0 40px rgba(236, 72, 153, 0.3)',
        depth: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        'depth-hover': '0 4px 12px rgba(251,191,36,0.12), 0 8px 24px rgba(0,0,0,0.08)',
      },
      animation: {
        'blob-morph': 'blob-morph 8s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'blob-morph': {
          '0%, 100%': { borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%' },
          '25%': { borderRadius: '58% 42% 30% 70% / 55% 45% 55% 45%' },
          '50%': { borderRadius: '70% 30% 50% 50% / 45% 55% 45% 55%' },
          '75%': { borderRadius: '30% 70% 70% 30% / 55% 45% 55% 45%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.4)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(251, 191, 36, 0.2)' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          // Jaune vif lumineux
          primary: '#F59E0B',
          'primary-content': '#000000',
          secondary: '#EC4899', // Pink accent
          'secondary-content': '#FFFFFF',
          accent: '#FBBF24',
          'accent-content': '#000000',
          neutral: '#1F2937',
          'neutral-content': '#F9FAFB',
          'base-100': '#FFFFFF',
          'base-200': '#FAFAFA',
          'base-300': '#F3F4F6',
          'base-content': '#111827',
          info: '#3B82F6',
          'info-content': '#FFFFFF',
          success: '#10B981',
          'success-content': '#FFFFFF',
          warning: '#F59E0B',
          'warning-content': '#000000',
          error: '#EF4444',
          'error-content': '#FFFFFF',
          '--rounded-box': '1.25rem',
          '--rounded-btn': '0.875rem',
          '--rounded-badge': '0.625rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.98',
        },
        dark: {
          // Jaune sombre
          primary: '#FBBF24',
          'primary-content': '#000000',
          secondary: '#F472B6', // Pink accent (lighter for dark)
          'secondary-content': '#000000',
          accent: '#F59E0B',
          'accent-content': '#000000',
          neutral: '#374151',
          'neutral-content': '#F9FAFB',
          'base-100': '#0A0A0A',
          'base-200': '#141414',
          'base-300': '#1F1F1F',
          'base-content': '#FAFAFA',
          info: '#3B82F6',
          'info-content': '#FFFFFF',
          success: '#10B981',
          'success-content': '#FFFFFF',
          warning: '#F59E0B',
          'warning-content': '#000000',
          error: '#EF4444',
          'error-content': '#FFFFFF',
          '--rounded-box': '1.25rem',
          '--rounded-btn': '0.875rem',
          '--rounded-badge': '0.625rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.98',
        },
      },
    ],
  },
}
