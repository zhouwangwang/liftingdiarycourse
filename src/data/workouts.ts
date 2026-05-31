import { db } from "@/db";
import { workouts, exercises, sets } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { addDays } from 'date-fns'


export async function getWorkoutsForUserOnDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = addDays(start, 1);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      exerciseOrder: exercises.order,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
    })
    .from(workouts)
    .leftJoin(exercises, eq(exercises.workoutId, workouts.id))
    .leftJoin(sets, eq(sets.exerciseId, exercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    )
    .orderBy(workouts.startedAt, exercises.order, sets.setNumber);

  return aggregateWorkouts(rows);
}

type Row = {
  workoutId: number;
  workoutName: string;
  startedAt: Date;
  completedAt: Date | null;
  exerciseId: number | null;
  exerciseName: string | null;
  exerciseOrder: number | null;
  setId: number | null;
  setNumber: number | null;
  reps: number | null;
  weight: string | null;
};

function aggregateWorkouts(rows: Row[]) {
  const workoutMap = new Map<number, {
    id: number;
    name: string;
    startedAt: Date;
    completedAt: Date | null;
    exercises: Map<number, {
      id: number;
      name: string;
      order: number;
      sets: { setNumber: number; reps: number | null; weight: string | null }[];
    }>;
  }>();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        exercises: new Map(),
      });
    }

    const workout = workoutMap.get(row.workoutId)!;

    if (row.exerciseId !== null && row.exerciseName !== null && row.exerciseOrder !== null) {
      if (!workout.exercises.has(row.exerciseId)) {
        workout.exercises.set(row.exerciseId, {
          id: row.exerciseId,
          name: row.exerciseName,
          order: row.exerciseOrder,
          sets: [],
        });
      }

      const exercise = workout.exercises.get(row.exerciseId)!;

      if (row.setId !== null && row.setNumber !== null) {
        exercise.sets.push({
          setNumber: row.setNumber,
          reps: row.reps,
          weight: row.weight,
        });
      }
    }
  }

  return Array.from(workoutMap.values()).map((w) => ({
    ...w,
    exercises: Array.from(w.exercises.values()),
  }));
}

export type WorkoutWithExercises = Awaited<ReturnType<typeof getWorkoutsForUserOnDate>>[number];

export async function createWorkout(userId: string, name: string, startedAt: Date) {
  return db.insert(workouts).values({ userId, name, startedAt }).returning();
}

export async function getWorkout(workoutId: number, userId: string) {
  const rows = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateWorkout(workoutId: number, userId: string, name: string, startedAt: Date) {
  return db
    .update(workouts)
    .set({ name, startedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
}
