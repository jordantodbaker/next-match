import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

describe("DeleteConfirmationModal", () => {
  it("renders the message and confirm label when open", () => {
    renderWithProviders(
      <DeleteConfirmationModal
        isOpen
        onOpenChange={() => {}}
        message="Are you sure you want to delete Acme?"
        confirmLabel="Delete Acme"
        onConfirm={() => {}}
      />
    );

    expect(
      screen.getByText("Are you sure you want to delete Acme?")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Acme" })
    ).toBeInTheDocument();
  });

  it("invokes onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    renderWithProviders(
      <DeleteConfirmationModal
        isOpen
        onOpenChange={() => {}}
        message="Delete?"
        confirmLabel="Delete it"
        onConfirm={onConfirm}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete it" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
