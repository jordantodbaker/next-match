import {
  submitWorkforcePlan,
  syncWorkforcePlans,
} from "@/app/actions/workforcePlansActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const result = await submitWorkforcePlan(data);

    return NextResponse.json("", { status: 200 });
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const result = await syncWorkforcePlans();

    return NextResponse.json("", { status: 200 });
  } catch (e) {
    console.log("ERROR: ", e);
  }
}
