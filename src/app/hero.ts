import { heroui } from "@heroui/react";

// Brand theme derived from the logo navy (#0d4788). Driving it through the
// HeroUI `primary` token means every `color="primary"` button + `*-primary*`
// class (navbar border, sidebar tint, chips) stays consistent from one place.
export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: "#eef3f9",
          100: "#d3e0ee",
          200: "#a7c1dd",
          300: "#7ba1cc",
          400: "#4f82bb",
          500: "#2463a4",
          600: "#0d4788",
          700: "#0a386c",
          800: "#072a51",
          900: "#051c36",
          DEFAULT: "#0d4788",
          foreground: "#ffffff",
        },
      },
    },
  },
});
