import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ReportView from "./ReportView";

describe("ReportView", () => {
  it("shows the empty state when there is no report URL", () => {
    render(<ReportView powerBiUrl={null} companyName="Grand Sierra" />);
    expect(
      screen.getByText(/no report configured for your organization/i)
    ).toBeInTheDocument();
    expect(screen.queryByTitle(/power bi report/i)).not.toBeInTheDocument();
  });

  it("renders an iframe pointing at the report URL", () => {
    const url = "https://app.powerbi.com/view?r=abc";
    render(<ReportView powerBiUrl={url} companyName="Grand Sierra" />);

    const iframe = screen.getByTitle("Grand Sierra Power BI Report");
    expect(iframe).toHaveAttribute("src", url);
  });
});
