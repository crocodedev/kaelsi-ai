import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "primary-blue": "#959FD8",
        "primary-purple": "#D5A2F2",
        "gradient-shadow":" linear-gradient(180deg, rgba(20, 20, 29, 0.9) 0%, rgba(20, 20, 29, 0) 127.86%)",
        "gradient-start": "linear-gradient(180deg, #35354C 0%, #222231 5%, #272639 25%)",
        "gradient-mid": "linear-gradient(180deg, #222231 5%, #272639 25%)",
        "gradient-end": "linear-gradient(180deg, #272639 25%, #35354C 100%)",
        "gradient-text": "linear-gradient(90deg, #959FD8 0%, #D5A2F2 100%)",
        "gradient-card": "linear-gradient(90deg, rgba(159, 149, 216, 0.25) 0%, rgba(221, 162, 242, 0.25) 100%)",
        "gradient-section": "linear-gradient(135deg, rgba(53, 53, 76, 1) 0%, rgba(42, 42, 61, 1) 50%, rgba(49, 48, 71, 1) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        "md": "10px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(40px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
      },
      backgroundImage: {
        "mystical-gradient": "linear-gradient(180deg, #35354C 0%, #222231 5%, #272639 25%)",
        "section-gradient": "linear-gradient(135deg, rgba(53, 53, 76, 1) 0%, rgba(42, 42, 61, 1) 50%, rgba(49, 48, 71, 1) 100%)",
        "gradient-card": "linear-gradient(90deg, rgba(159, 149, 216, 0.25) 0%, rgba(221, 162, 242, 0.25) 100%)",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        faunce: ["Faunce", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        "section": "0 2px 3px 0 rgba(0, 0, 0, 0.3), 0 6px 18.4px 4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
