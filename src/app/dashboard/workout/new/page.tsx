import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background px-8 py-5">
        <h1 className="text-xl font-semibold tracking-tight">Workout Diary</h1>
      </div>
      <div className="flex items-start justify-center p-8">
        <NewWorkoutForm defaultDate={todayStr} />
      </div>
    </div>
  );
}
