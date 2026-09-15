import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/user";

export async function GET() { const user = await getDemoUser(); return NextResponse.json(await prisma.habit.findMany({ where: { userId: user.id, archived: false }, include: { completions: true }, orderBy: { createdAt: "asc" } })); }
export async function POST(request: Request) {
  const body = await request.json(); const user = await getDemoUser();
  if (!body.title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const habit = await prisma.habit.create({ data: { userId: user.id, title: body.title.trim(), description: body.description ?? "", category: body.category ?? "Personal", frequency: body.frequency === "WEEKLY" ? "WEEKLY" : "DAILY", targetCount: Math.max(1, Number(body.targetCount) || 1), targetUnit: body.targetUnit ?? "times", color: body.color ?? "#76B852" } });
  return NextResponse.json(habit, { status: 201 });
}