import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkout } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);
  if (isNaN(id)) {
    notFound();
  }

  const workout = await getWorkout(id, userId);
  if (!workout) {
    notFound();
  }

  const defaultDate = workout.startedAt.toISOString().slice(0, 10);
  const defaultTime = workout.startedAt.toTimeString().slice(0, 5);

  return (
    <div className="flex min-h-screen items-start justify-center p-8">
      <EditWorkoutForm
        workoutId={workout.id}
        defaultName={workout.name}
        defaultDate={defaultDate}
        defaultTime={defaultTime}
      />
    </div>
  );
}
