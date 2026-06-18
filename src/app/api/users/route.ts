import { saveUser } from "@/app/actions/userActions";
import { RegisterSchema } from "@/lib/schemas/registerSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const userEntry = data.get("user");
    if (userEntry) {
      const result = await saveUser(JSON.parse(userEntry as string));
      return NextResponse.json({ result: result }, { status: 200 });
    }
    return NextResponse.json({ error: "Missing user" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
