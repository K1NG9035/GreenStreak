import { eachDayOfInterval, endOfDay, format, startOfDay, subDays } from "date-fns";

export type HeatmapCompletion = { date: Date | string; completionCount: number; habitId?: string; habitTitle?: string };
export type HeatmapBreakdown = { name: string; count: number };
export type HeatmapCell = {
  date: Date;
  key: string;
  count: number;
  percentage: number;
  intensity: 0 | 1 | 2 | 3;
  tooltip: string;
  breakdown: HeatmapBreakdown[];
};

export function getIntensityBucket(percentage: number): HeatmapCell["intensity"] {
  if (percentage <= 0) return 0;
  if (percentage < 34) return 1;
  if (percentage < 67) return 2;
  return 3;
}

export function buildHeatmap(
  completions: HeatmapCompletion[],
  targetCount = 1,
  year = new Date().getFullYear(),
  month?: number | null,
): HeatmapCell[] {
  const today = new Date();
  const selectedMonth = month === null || month === undefined ? null : Math.max(0, Math.min(11, month));
  const monthStart = selectedMonth === null ? new Date(year, 0, 1) : new Date(year, selectedMonth, 1);
  const monthEnd = selectedMonth === null ? new Date(year, 11, 31) : new Date(year, selectedMonth + 1, 0);
  const requestedEnd = year === today.getFullYear() && (selectedMonth === null || selectedMonth === today.getMonth()) ? today : monthEnd;
  const end = endOfDay(requestedEnd);
  const start = selectedMonth === null ? startOfDay(new Date(Math.max(monthStart.getTime(), subDays(end, 364).getTime()))) : startOfDay(monthStart);
  const totals = new Map<string, number>();
  const breakdowns = new Map<string, Map<string, number>>();
  completions.forEach((completion) => {
    const key = format(new Date(completion.date), "yyyy-MM-dd");
    totals.set(key, (totals.get(key) ?? 0) + completion.completionCount);
    const habitsForDay = breakdowns.get(key) ?? new Map<string, number>();
    const habitName = completion.habitTitle ?? "Habit";
    habitsForDay.set(habitName, (habitsForDay.get(habitName) ?? 0) + completion.completionCount);
    breakdowns.set(key, habitsForDay);
  });
  return eachDayOfInterval({ start, end }).map((date) => {
    const key = format(date, "yyyy-MM-dd");
    const count = totals.get(key) ?? 0;
    const percentage = Math.round((count / Math.max(1, targetCount)) * 100);
    const breakdown = Array.from(breakdowns.get(key) ?? [], ([name, habitCount]) => ({ name, count: habitCount }));
    return { date, key, count, percentage, intensity: getIntensityBucket(percentage), tooltip: `${format(date, "MMM d, yyyy")} · ${count} contribution${count === 1 ? "" : "s"} · ${percentage}%`, breakdown };
  });
}

export function getHeatmapTooltip(cell: HeatmapCell, habits: string[] = []) {
  return `${cell.tooltip}${habits.length ? `\n${habits.join(", ")}` : ""}`;
}