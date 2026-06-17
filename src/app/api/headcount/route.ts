import { getHeadcountCSV } from "@/app/actions/headcountActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const company = data.get("company");
    const project = data.get("project");
    if (company && project) {
      const companyId = JSON.parse(company as string)[0].id;
      const projectId = JSON.parse(project as string).id;
      const buffer = await getHeadcountCSV(companyId, projectId);

      // Stream the generated workbook straight back to the client instead of
      // persisting it to disk and serving it statically.
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="headcount.xlsx"',
        },
      });
    }
    return NextResponse.json(
      { error: "Missing company or project" },
      { status: 400 }
    );
  } catch (e) {
    console.log("ERROR: ", e);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
