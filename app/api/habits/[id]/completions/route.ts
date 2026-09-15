import { NextResponse } from "next/server";
import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/user";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getDemoUser(); const body = await request.json(); const habit = await prisma.habit.findFirst({ where: { id: params.id, userId: user.id } });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const date = new Date(body.date ?? new Date()); const normalizedDate = startOfDay(date); const count = Math.max(0, Number(body.completionCount) || 0);
  const completion = count === 0 ? await prisma.habitCompletion.deleteMany({ where: { habitId: habit.id, date: { gte: normalizedDate, lte: endOfDay(date) } } }).then(() => null) : await prisma.habitCompletion.upsert({ where: { habitId_date: { habitId: habit.id, date: normalizedDate } }, update: { completionCount: count }, create: { habitId: habit.id, date: normalizedDate, completionCount: count } });
  return NextResponse.json(completion ?? { deleted: true });
}