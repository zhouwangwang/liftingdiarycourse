import { auth } from "@clerk/nextjs/server";
import { format, parse} from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarPicker } from "./calendar-picker";
import { getWorkoutsForUserOnDate } from "@/data/workouts";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam ? parse(dateParam, "yyyy-MM-dd", new Date()): new Date()
  const workouts = await getWorkoutsForUserOnDate(userId!, date);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background px-8 py-5">
        <h1 className="text-xl font-semibold tracking-tight">Workout Diary</h1>
      </div>

      <div className="flex gap-6 p-8 max-w-6xl mx-auto">
        {/* Left: Calendar */}
        <div className="shrink-0">
          <Card className="p-4 shadow-sm [--cell-size:--spacing(10)]">
            <CalendarPicker selected={date} />
          </Card>
        </div>

        {/* Right: Workout list */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-0.5">
                Workouts
              </p>
              <h2 className="text-lg font-semibold">{format(date, "do MMM yyyy")}</h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              {workouts.length} logged
            </Badge>
          </div>

          {workouts.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-background flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm">No workouts logged for this day.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <Card key={workout.id} className="shadow-sm">
                  <CardContent className="flex items-center justify-between py-4 px-5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold tabular-nums bg-muted text-muted-foreground rounded-md px-2.5 py-1.5 shrink-0">
                        {format(workout.startedAt, "HH:mm")}
                      </span>
                      <p className="font-semibold text-sm">{workout.name}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      workout.completedAt
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {workout.completedAt ? "Completed" : "In progress"}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
