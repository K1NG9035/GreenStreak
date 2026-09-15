import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/user";
import { TimedStatusScreen } from "@/components/TimedStatusScreen";

export default async function DeleteHabitPage({ params }: { params: { id: string } }) {
  const user = await getDemoUser();
  const habit = await prisma.habit.findFirst({ where: { id: params.id, userId: user.id, archived: false } });
  if (!habit) notFound();
  return <TimedStatusScreen type="deleted" title={habit.title} destination="/" archiveUrl={`/api/habits/${habit.id}`} />;
}