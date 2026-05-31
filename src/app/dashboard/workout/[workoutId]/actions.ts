"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(workoutId: number, name: string, startedAt: Date) {
  const parsed = updateWorkoutSchema.safeParse({ name, startedAt });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await updateWorkout(workoutId, userId, parsed.data.name, parsed.data.startedAt);
}
