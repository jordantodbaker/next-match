import { getHeadcountCSV } from "@/app/actions/headcountActions";
import { NextRequest, NextResponse } from "next/server";
import stream from "stream";
import { promisify } from "util";
import fetch from "node-fetch";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const company = data.get("company");
    const project = data.get("project");
    if (company && project) {
      const companyId = JSON.parse(company as string)[0].id;
      const projectId = JSON.parse(project as string).id;
      const result = await getHeadcountCSV(companyId, projectId);

      return NextResponse.json({ result: result }, { status: 200 });
    }
  } catch (e) {
    console.log("ERROR: ", e);
  }
}
