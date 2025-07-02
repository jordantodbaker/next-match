import { saveUser } from "@/app/actions/userActions";
import { RegisterSchema } from "@/lib/schemas/registerSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    //const parsedData = JSON.parse(data as any);
    console.log("PARSED DATA", data);
    const userEntry = data.get("user");
    if (userEntry) {
      const jsonUser = userEntry;
      const result = await saveUser(JSON.parse(jsonUser as string));
      return NextResponse.json({ result: result }, { status: 200 });
    }
  } catch (e) {
    console.log("ERROR: ", e);
  }
}
