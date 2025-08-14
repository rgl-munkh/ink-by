/**
 * Design System Tokens
 * 
 * Centralized design tokens for the application following a minimalist,
 * muted color scheme as per user preferences.
 */

// Spacing scale based on 4px grid
export const spacing = {
  xs: "0.25rem",  // 4px
  sm: "0.5rem",   // 8px
  md: "0.75rem",  // 12px
  lg: "1rem",     // 16px
  xl: "1.25rem",  // 20px
  "2xl": "1.5rem",   // 24px
  "3xl": "2rem",     // 32px
  "4xl": "2.5rem",   // 40px
  "5xl": "3rem",     // 48px
  "6xl": "4rem",     // 64px
} as const

// Typography scale
export const typography = {
  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
  },
  fontWeight: {
    normal: "400",
    medium: "500", 
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.75",
  },
  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
} as const

// Border radius scale
export const borderRadius = {
  none: "0",
  sm: "0.125rem",   // 2px
  md: "0.375rem",   // 6px
  lg: "0.5rem",     // 8px (default)
  xl: "0.75rem",    // 12px
  "2xl": "1rem",    // 16px
  full: "9999px",
} as const

// Shadow scale - subtle shadows for minimalist design
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const

// Breakpoints for responsive design
export const breakpoints = {
  sm: "640px",
  md: "768px", 
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

// Animation durations
export const animations = {
  duration: {
    fast: "150ms",
    normal: "200ms", 
    slow: "300ms",
  },
  easing: {
    ease: "ease",
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const

// Z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const

// Component specific tokens
export const components = {
  button: {
    height: {
      sm: "2rem",     // 32px
      md: "2.5rem",   // 40px  
      lg: "3rem",     // 48px
    },
    padding: {
      sm: "0.5rem 1rem",
      md: "0.75rem 1.5rem", 
      lg: "1rem 2rem",
    },
  },
  input: {
    height: {
      sm: "2rem",     // 32px
      md: "2.5rem",   // 40px
      lg: "3rem",     // 48px
    },
  },
  card: {
    padding: {
      sm: "1rem",     // 16px
      md: "1.5rem",   // 24px
      lg: "2rem",     // 32px
    },
  },
} as const

// Export all tokens as a single object for convenience
export const designTokens = {
  spacing,
  typography,
  borderRadius,
  shadows,
  breakpoints,
  animations,
  zIndex,
  components,
} as const

export type DesignTokens = typeof designTokens
