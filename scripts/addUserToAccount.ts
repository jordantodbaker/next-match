import { prisma } from "@/lib/prisma";

const userId = "cmavkseef0002psrs9lu5zqk2";
const accountId = "";

const user = prisma.user.findFirst({
  where: { id: userId },
});

console.log(user);
