import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    return res.json(users);
  }

  if (req.method === "POST") {
    const { name, email, password, role } = req.body;
    const newUser = await prisma.user.create({
      data: { name, email, password, role },
    });
    return res.json(newUser);
  }
}
