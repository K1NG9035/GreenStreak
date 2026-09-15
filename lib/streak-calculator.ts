import { addDays, differenceInCalendarDays, format, isAfter, startOfDay, subDays } from "date-fns";

export type Frequency = "DAILY" | "WEEKLY";
export type CompletionLike = { date: Date | string; completionCount: number };

export type StreakStats = {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
};

function dateKey(date: Date | string) {
  return format(new Date(date), "yyyy-MM-dd");
}

export function calculateStreakStats(
  completions: CompletionLike[],
  targetCount: number,
  frequency: Frequency,
  fromDate = new Date(),
): StreakStats {
  const byDate = new Map(completions.map((item) => [dateKey(item.date), item.completionCount]));
  const totalCompletions = completions.reduce((sum, item) => sum + item.completionCount, 0);
  const end = startOfDay(fromDate);
  const daysTracked = Math.max(1, differenceInCalendarDays(end, startOfDay(new Date(Math.min(...completions.map((item) => new Date(item.date).getTime()), end.getTime()))))) + 1;

  // Weekly habits stay active through a seven-day quiet period, while daily habits require every day.
  const qualifies = (day: Date) => {
    if (frequency === "DAILY") return (byDate.get(format(day, "yyyy-MM-dd")) ?? 0) >= targetCount;
    return Array.from({ length: 7 }, (_, index) => byDate.get(format(subDays(day, index), "yyyy-MM-dd")) ?? 0)
      .reduce((sum, count) => sum + count, 0) >= targetCount;
  };

  let currentStreak = 0;
  for (let cursor = end; qualifies(cursor); cursor = subDays(cursor, 1)) {
    currentStreak += 1;
    if (currentStreak > 366) break;
  }

  let longestStreak = 0;
  let run = 0;
  for (let index = daysTracked - 1; index >= 0; index -= 1) {
    const day = subDays(end, index);
    if (qualifies(day)) {
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  }

  const requiredUnits = frequency === "DAILY" ? daysTracked * targetCount : Math.ceil(daysTracked / 7) * targetCount;
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate: Math.min(100, Math.round((totalCompletions / Math.max(1, requiredUnits)) * 100)),
  };
}