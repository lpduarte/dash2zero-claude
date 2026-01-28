import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // Tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  // Safelist Tremor colors for charts - only the colors we actually use
  // teal: primary/brand, scope1/scope2/scope3: âmbitos, emerald: success, red: danger, gray: neutral
  safelist: [
    // Standard Tailwind colors with shades (for Tremor base colors)
    {
      pattern:
        /^(bg-(?:gray|red|emerald|teal)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:gray|red|emerald|teal)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:gray|red|emerald|teal)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:gray|red|emerald|teal)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:gray|red|emerald|teal)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:gray|red|emerald|teal)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    // Custom scope colors without shades (for Tremor custom colors)
    {
      pattern: /^(bg-(?:scope1|scope2|scope3))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern: /^(text-(?:scope1|scope2|scope3))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern: /^(border-(?:scope1|scope2|scope3))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern: /^(ring-(?:scope1|scope2|scope3))$/,
    },
    {
      pattern: /^(stroke-(?:scope1|scope2|scope3))$/,
    },
    {
      pattern: /^(fill-(?:scope1|scope2|scope3))$/,
    },
  ],
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
        /* ====== SIMPLIFIED COLOR TOKENS ======
           Redundant tokens now alias to base tokens.
           CSS variables reduced, Tailwind classes preserved for compatibility.
        */

        // Base semantic colors
        border: "hsl(var(--border))",
        input: "hsl(var(--border))", // alias to border
        ring: "hsl(var(--primary))", // alias to primary
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--card))", // white = card
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--primary-dark))", // consolidated with primary-dark
          foreground: "hsl(var(--card))", // white = card
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))", // alias to danger
          foreground: "hsl(var(--card))", // white = card
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--primary-dark))", // alias to primary-dark
          foreground: "hsl(var(--card))", // white = card
        },
        popover: {
          DEFAULT: "hsl(var(--card))", // alias to card
          foreground: "hsl(var(--foreground))", // alias to foreground
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--foreground))", // alias to foreground
        },
        success: {
          DEFAULT: "hsl(var(--primary))", // consolidated with primary
          foreground: "hsl(var(--card))", // white = card
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--card))", // white = card
        },
        // Scope/Âmbito colors for emissions
        scope: {
          1: "hsl(var(--scope-1))",
          2: "hsl(var(--scope-2))",
          3: "hsl(var(--scope-3))",
        },
        // Tremor-compatible scope colors (for charts)
        scope1: "hsl(var(--scope-1))",
        scope2: "hsl(var(--scope-2))",
        scope3: "hsl(var(--scope-3))",
        // Onboarding status colors
        status: {
          pending: "hsl(var(--status-pending))",
          contacted: "hsl(var(--status-contacted))",
          interested: "hsl(var(--status-interested))",
          registered: "hsl(var(--status-registered))",
          progress: "hsl(var(--status-progress))",
          complete: "hsl(var(--status-complete))",
        },
        // Decorative colors
        autumn: "hsl(var(--autumn))",
        // Chart utility colors (alias to existing)
        chart: {
          grid: "hsl(var(--border))", // alias to border
          text: "hsl(var(--muted-foreground))", // alias to muted-foreground
        },
        // Tremor theme colors - required for tooltips and components
        tremor: {
          brand: {
            faint: colors.teal[50],
            muted: colors.teal[200],
            subtle: colors.teal[400],
            DEFAULT: colors.teal[500],
            emphasis: colors.teal[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
        "dark-tremor": {
          brand: {
            faint: "#0B1229",
            muted: colors.teal[950],
            subtle: colors.teal[800],
            DEFAULT: colors.teal[500],
            emphasis: colors.teal[400],
            inverted: colors.teal[950],
          },
          background: {
            muted: "#131A2B",
            subtle: colors.gray[800],
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
          },
          border: {
            DEFAULT: colors.gray[800],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
          content: {
            subtle: colors.gray[600],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            strong: colors.gray[50],
            inverted: colors.gray[950],
          },
        },
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        // Tremor shadows
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Tremor border radius
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        // xs = 12px (Tailwind default)
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        // Tremor font sizes
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
            opacity: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          to: {
            height: "0",
            opacity: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "collapsible-down": {
          from: {
            height: "0",
            opacity: "0",
          },
          to: {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
          },
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
          },
          to: {
            height: "0",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.4s ease-in-out",
        "accordion-up": "accordion-up 0.4s ease-in-out",
        "fade-in": "fade-in 0.3s ease-out",
        "collapsible-down": "collapsible-down 0.4s ease-in-out",
        "collapsible-up": "collapsible-up 0.4s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
