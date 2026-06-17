"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Headcount } from "@prisma/client";

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
    // Run the create + per-row updates atomically in a single transaction
    // (one round-trip) instead of N independent, non-atomic update calls.
    const ops = [];
    if (newHeadcounts.length > 0) {
      ops.push(prisma.headcount.createMany({ data: newHeadcounts }));
    }
    for (const hc of oldHeadcounts) {
      ops.push(prisma.headcount.update({ where: { id: hc.id }, data: { ...hc } }));
    }
    if (ops.length > 0) {
      await prisma.$transaction(ops);
    }

    return { status: "success", data: "Company Saved" };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

/**
 * Builds the headcount export as an in-memory xlsx Buffer. Returning bytes
 * (rather than writing to `./public/files`) avoids the local filesystem,
 * which is read-only/ephemeral on serverless hosts like Vercel — the old
 * write-then-serve-then-delete dance broke in production and raced on a
 * fixed filename.
 */
export async function getHeadcountCSV(
  companyId: number,
  projectId: number
): Promise<Buffer> {
  const writeXlsxFile = require("write-excel-file/node");

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

  return writeXlsxFile(data, { buffer: true });
}
