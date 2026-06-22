import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";

const { mockUseAuth, mockSignOut } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
  useAuth: mockUseAuth,
  useClerk: () => ({ signOut: mockSignOut }),
}));

import TopNav from "./TopNav";

beforeEach(() => vi.clearAllMocks());

describe("TopNav", () => {
  it("shows the logout control when signed in", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true });
    renderWithProviders(<TopNav />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("hides the logout control when signed out", () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false });
    renderWithProviders(<TopNav />);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
