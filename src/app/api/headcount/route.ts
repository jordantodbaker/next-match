import { getHeadcountCSV } from "@/app/actions/headcountActions";
import { NextRequest, NextResponse } from "next/server";
import stream from "stream";
import { promisify } from "util";
import fetch from "node-fetch";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const company = data.get("company");
    const project = data.get("project");
    if (company && project) {
      const companyId = JSON.parse(company as string)[0].id;
      const projectId = JSON.parse(project as string).id;
      const fileName = await getHeadcountCSV(
        companyId,
        projectId,
        (data.get("fileName") as string) || ""
      );

      return NextResponse.json({}, { status: 200 });
    }
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.formData();
    const fileName = data.get("fileName");

    fs.unlink(`./public/files/${fileName}`, (err) => {
      if (err) {
        console.log("Error deleting file.");
        console.log(err);
      } else {
        console.log("File deleted successfully.");
      }
      return NextResponse.json({}, { status: 200 });
    });
  } catch (e) {
    console.log("ERROR: ", e);
  }
}
