import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dim:        "hsl(var(--primary-dim))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised:  "hsl(var(--surface-raised))",
        },
        teal: {
          DEFAULT: "hsl(var(--teal))",
          dim:     "hsl(var(--teal-dim))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          dim:     "hsl(var(--gold-dim))",
        },
        status: {
          green: "hsl(var(--status-green))",
          amber: "hsl(var(--status-amber))",
          red:   "hsl(var(--status-red))",
        },
        sidebar: {
          DEFAULT:             "hsl(var(--sidebar-background))",
          foreground:          "hsl(var(--sidebar-foreground))",
          primary:             "hsl(var(--sidebar-primary))",
          "primary-foreground":"hsl(var(--sidebar-primary-foreground))",
          accent:              "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border:              "hsl(var(--sidebar-border))",
          ring:                "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   "1rem",
        "2xl":"1.25rem",
        "3xl":"1.5rem",
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        "metric-xl": ["4rem",   { lineHeight: "1",   fontWeight: "800", letterSpacing: "-0.04em" }],
        "metric-lg": ["2.75rem",{ lineHeight: "1",   fontWeight: "800", letterSpacing: "-0.04em" }],
        "metric-md": ["2.25rem",{ lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        "metric-sm": ["1.5rem", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        "glow-blue": "var(--shadow-glow-blue)",
        "glow-gold": "var(--shadow-glow-gold)",
        "glow-teal": "var(--shadow-glow-teal)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        pulseBeat: {
          "0%, 100%": { transform: "scale(1)",    opacity: "1"   },
          "50%":      { transform: "scale(1.18)", opacity: "0.8" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)"   },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "pulse-beat":     "pulseBeat 1s ease-in-out infinite",
        "fade-in":        "fadeIn 0.4s ease-out",
        shimmer:          "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
