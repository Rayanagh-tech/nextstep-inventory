module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      borderColor: {
        border: 'hsl(var(--border))', // 👈 This enables `border-border`
      },
      backgroundColor: {
        background: 'hsl(var(--background))',
        card: 'hsl(var(--card))',
        popover: 'hsl(var(--popover))',
      },
      textColor: {
        foreground: 'hsl(var(--foreground))',
      },
      ringColor: {
        ring: 'hsl(var(--ring))',
      },
      colors: {
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
    },
  },
  plugins: [],
};
