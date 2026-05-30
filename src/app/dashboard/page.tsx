"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Exercise = {
  name: string;
  sets: { setNumber: number; reps: number | null; weight: string | null }[];
};

type Workout = {
  id: number;
  name: string;
  startedAt: Date;
  completedAt: Date | null;
  exercises: Exercise[];
};

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 1,
    name: "Upper Body",
    startedAt: new Date(),
    completedAt: new Date(),
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { setNumber: 1, reps: 8, weight: "80.00" },
          { setNumber: 2, reps: 8, weight: "80.00" },
          { setNumber: 3, reps: 6, weight: "85.00" },
        ],
      },
      {
        name: "Pull-ups",
        sets: [
          { setNumber: 1, reps: 10, weight: null },
          { setNumber: 2, reps: 9, weight: null },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Core & Cardio",
    startedAt: new Date(),
    completedAt: null,
    exercises: [
      {
        name: "Plank",
        sets: [
          { setNumber: 1, reps: null, weight: null },
          { setNumber: 2, reps: null, weight: null },
        ],
      },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background px-8 py-5">
        <h1 className="text-xl font-semibold tracking-tight">Workout Diary</h1>
      </div>

      <div className="flex gap-6 p-8 max-w-6xl mx-auto">
        {/* Left: Calendar */}
        <div className="shrink-0">
          <Card className="p-4 shadow-sm [--cell-size:--spacing(10)]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              className="[--cell-size:--spacing(10)]"
            />
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
              {MOCK_WORKOUTS.length} logged
            </Badge>
          </div>

          {MOCK_WORKOUTS.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-background flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm">No workouts logged for this day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_WORKOUTS.map((workout) => (
                <Card key={workout.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">{workout.name}</CardTitle>
                      <Badge variant={workout.completedAt ? "default" : "outline"} className="text-xs">
                        {workout.completedAt ? "Completed" : "In progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {workout.exercises.map((exercise, i) => (
                      <div key={exercise.name}>
                        {i > 0 && <div className="border-t mb-5" />}
                        <div className="flex items-start justify-between mb-3">
                          <p className="text-sm font-semibold">{exercise.name}</p>
                          <span className="text-xs text-muted-foreground">{exercise.sets.length} sets</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exercise.sets.map((set) => (
                            <div
                              key={set.setNumber}
                              className="flex flex-col items-center rounded-lg bg-muted px-4 py-2 min-w-[64px]"
                            >
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                Set {set.setNumber}
                              </span>
                              <span className="text-sm font-semibold">
                                {set.reps ?? "—"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {set.weight ? `${set.weight} kg` : "bodyweight"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
