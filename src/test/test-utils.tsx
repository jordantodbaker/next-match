import { HeroUIProvider } from "@heroui/react";
import { render, type RenderOptions } from "@testing-library/react";
import React, { type ReactElement, type ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

/** Render a component inside the HeroUIProvider its descendants expect. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from "@testing-library/react";
