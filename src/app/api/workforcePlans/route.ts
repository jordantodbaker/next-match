import { submitWorkforcePlan } from "@/app/actions/workforcePlansActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const data = await request.formData();
        console.log("DATA: ", data);
        const result = await submitWorkforcePlan(data);

        

        return NextResponse.json("", {status: 200});

    } catch(e) {
        console.log("ERROR: ", e);
    }
}