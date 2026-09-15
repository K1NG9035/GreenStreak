import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/user";
import { HabitForm } from "@/components/HabitForm";
export default async function EditHabit({ params }: { params: { id: string } }) { const user = await getDemoUser(); const habit = await prisma.habit.findFirst({ where: { id: params.id, userId: user.id } }); if (!habit) notFound(); return <main className="page-shell"><div className="py-12"><p className="label">Tune your rhythm</p><h1 className="mt-2 mb-8 font-display text-4xl font-bold">Edit habit</h1><HabitForm initial={habit} /></div></main>; }