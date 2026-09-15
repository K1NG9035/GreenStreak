import { notFound } from "next/navigation";
import type { Route } from "next";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/user";
import { TimedStatusScreen } from "@/components/TimedStatusScreen";

export default async function CreatedHabitPage({ params }: { params: { id: string } }) {
  const user = await getDemoUser();
  const habit = await prisma.habit.findFirst({ where: { id: params.id, userId: user.id } });
  if (!habit) notFound();
  return <TimedStatusScreen type="created" title={habit.title} destination={`/habits/${habit.id}` as Route} />;
}