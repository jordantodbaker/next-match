import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const fs = require('node:fs');
        const readXlsxFile = require('read-excel-file/node')
        console.log(" IN THE FILES ");
        const data = await request.formData();
        const file: File | null = data.get("file") as any;

        fs.writeFile('./testFile.xlsx', await file?.text(), (err: any) => {
            if(err){
                console.log("LITTLE DURKA: ",err)
            } else {
                console.log("WE DID IT")
            }

        })

        readXlsxFile('./testFile.xlsx').then((rows: any) => {
            console.log("ROW -> ", rows);
        })

        // readFile(file).then((rows: any) => {
        //     console.log("Rows: ", rows)
        // })

        return NextResponse.json("", {status: 200});

    } catch(e) {
        console.log("ERROR: ", e);
    }
}