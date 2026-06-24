import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";

const { mockSaveUser, mockDeleteUser, mockInviteUser, mockRefresh } = vi.hoisted(
  () => ({
    mockSaveUser: vi.fn(),
    mockDeleteUser: vi.fn(),
    mockInviteUser: vi.fn(),
    mockRefresh: vi.fn(),
  })
);

vi.mock("@/app/actions/userActions", () => ({
  saveUser: mockSaveUser,
  deleteUser: mockDeleteUser,
  inviteUser: mockInviteUser,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mockRefresh }) }));
vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
// The sidebar pulls in motion/icons we don't need for this behavior test.
vi.mock("@/components/sidebar/AdminSidebar", () => ({ AdminSidebar: () => null }));

import UsersPage from "./Users";

const companies = [
  {
    id: 1,
    name: "Acme",
    companyCode: "ACME",
    powerBiUrl: null,
    users: [
      {
        id: 6,
        name: "Existing User",
        email: "existing@example.com",
        securityRole: "USER",
        companyId: 1,
        clerkId: "clerk_6",
        hasTakenWFPTour: false,
      },
    ],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockInviteUser.mockResolvedValue({ status: "success", data: "Invitation sent" });
  mockSaveUser.mockResolvedValue({ status: "success", data: {} });
  mockDeleteUser.mockResolvedValue({ status: "success", data: "User deleted" });
});

describe("UsersPage", () => {
  it("sends an invitation (not saveUser) for a brand-new user", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UsersPage companies={companies as never} unlinkedUsers={[]} />
    );

    await user.click(screen.getByRole("button", { name: "Invite User" }));
    await user.type(await screen.findByPlaceholderText("Name"), "New Person");
    await user.type(screen.getByPlaceholderText("Email"), "new@example.com");
    await user.click(screen.getByRole("button", { name: "Send Invitation" }));

    await waitFor(() => expect(mockInviteUser).toHaveBeenCalledTimes(1));
    expect(mockInviteUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@example.com", name: "New Person" })
    );
    expect(mockSaveUser).not.toHaveBeenCalled();
  });

  it("calls saveUser (not inviteUser) when editing an existing user", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UsersPage companies={companies as never} unlinkedUsers={[]} />
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(await screen.findByRole("button", { name: "Save" }));

    await waitFor(() => expect(mockSaveUser).toHaveBeenCalledTimes(1));
    expect(mockInviteUser).not.toHaveBeenCalled();
  });

  it("deletes a user through the confirmation dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <UsersPage companies={companies as never} unlinkedUsers={[]} />
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(
      await screen.findByRole("button", { name: /Delete Existing User/i })
    );

    await waitFor(() => expect(mockDeleteUser).toHaveBeenCalledWith(6));
  });
});
