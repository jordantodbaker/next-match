"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompanyAccount, Headcount, Role } from "@prisma/client";
import { hasCustomGetInitialProps } from "next/dist/build/utils";

// export async function getCompanies() {
//   return await prisma.companyAccount.findMany({
//     where: { companyCode: { not: "ACE" } },
//     include: { roles: true },
//   });
// }

export async function getHeadcount() {
  const session = await auth();
  const user = session?.user;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const company = await prisma.headcount.findMany({
    where: { companyId: user?.companyId, date: { gte: today } },
    include: { role: {include: {category: true}} },
    orderBy: {role: {category: {id: 'asc'}}},
  });

  return [company].filter((c) => !!c);
}

export async function saveHeadcount(headcount: Headcount[]) {
  const session = await auth();
  const user = session?.user;

  const newHeadcounts = headcount
    .filter((hc) => hc.id === 0)
    .map((hc) => ({
      dayCount: hc.dayCount,
      nightCount: hc.nightCount,
      roleId: hc.roleId,
      companyId: hc.companyId,
      userId: hc.userId,
      date: hc.date,
      projectId: hc.projectId,
    }));
  const oldHeadcounts = headcount.filter((hc) => hc.id > 0);

  try {
    if (newHeadcounts.length > 0) {
      await prisma.headcount.createMany({
        data: newHeadcounts,
      });
    }
    if (oldHeadcounts.length > 0) {
      await Promise.all(
        oldHeadcounts.map(
          async (hc) =>
            await prisma.headcount.update({
              where: { id: hc.id },
              data: { ...hc },
            })
        )
      );
    }

    return { status: "success", data: "Company Saved" };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function getHeadcountCSV(
  companyId: number,
  projectId: number,
  fileName: string
) {
  const writeXlsxFile = require("write-excel-file/node");
  const fs = require("fs");
  const { Downloader } = require("nodejs-file-downloader");

  const headcounts = await prisma.headcount.findMany({
    where: { projectId: projectId, companyId: companyId },
    include: { role: true, project: true },
  });
  const headers = [
    { value: "Date" },
    { value: "Role" },
    { value: "Day Count" },
    { value: "Night Count" },
    { value: "Project" },
  ];
  const values = headcounts.map((hc) => [
    { type: Date, value: hc.date, format: "mm/dd/yyyy" },
    { type: String, value: hc.role.name },
    { type: Number, value: hc.dayCount },
    { type: Number, value: hc.nightCount },
    { type: String, value: hc.project.name },
  ]);

  const data = [headers, ...values];
  const filePath = `./public/files/${fileName}`;

  const folderName = "./public/files";

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
      console.log(`Directory '${folderName}' created successfully.`);
    } else {
      console.log(`Directory '${folderName}' already exists.`);
    }
  } catch (err: any) {
    console.error(`Error creating directory: ${err.message}`);
  }

  const stream = await writeXlsxFile(data, { filePath: filePath });
  return fileName;
}
