import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            fontSize: '18px',
            lineHeight: '1.875',
            letterSpacing: 'normal',
            p: {
              fontSize: '18px',
              letterSpacing: '-0.02rem',
              lineHeight: '1.875',
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
            },
            li: {
              fontSize: '18px',
              letterSpacing: 'normal',
              lineHeight: '1.5',
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1.5rem',
            },
            ol: {
              marginTop: '1.5rem', 
              marginBottom: '1.5rem',
            },
            hr: {
              borderColor: 'hsl(var(--border))',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'h1, h2, h3': {
              letterSpacing: '-0.01em',
              fontWeight: '700',
            },
            h1: {
              fontSize: '2.5rem',
              lineHeight: '1.2',
              marginTop: '0',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: '2rem',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              lineHeight: '1.3',
            },
            h3: {
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '1rem',
              lineHeight: '1.4',
            },
            h4: {
              fontSize: '1.25rem',
              marginTop: '1rem',
              marginBottom: '0.75rem',
              lineHeight: '1.5',
            },
            'h2 small, h3 small, h4 small': {
              fontFamily: fontFamily.mono.join(', '),
              fontWeight: 500,
            },
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            'code': {
              fontVariantLigatures: 'none',
              fontSize: '0.875em',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            strong: {
              fontWeight: '700',
            },
            b: {
              fontWeight: '700',
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: 'hsl(var(--primary))',
              paddingLeft: '1.5rem',
              fontStyle: 'normal',
              color: 'hsl(var(--muted-foreground))',
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            pre: {
              borderRadius: '0px',
              border: 'none',
              backgroundColor: 'transparent',
              marginTop: '1rem',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            },
            table: {
              width: '100%',
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            'thead th': {
              fontWeight: '700',
              borderBottomWidth: '2px',
              paddingBottom: '0.75rem',
            },
            'tbody td': {
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
            },
            img: {
              marginTop: '1rem',
              marginBottom: '1rem',
              borderRadius: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config