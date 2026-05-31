"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateWorkoutAction } from "./actions";

type Props = {
  workoutId: number;
  defaultName: string;
  defaultDate: string;
  defaultTime: string;
};

export function EditWorkoutForm({ workoutId, defaultName, defaultDate, defaultTime }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const time = (form.elements.namedItem("time") as HTMLInputElement).value;

    const startedAt = new Date(`${date}T${time}`);

    try {
      await updateWorkoutAction(workoutId, name, startedAt);
      router.push("/dashboard");
    } catch {
      setError("Failed to update workout. Please try again.");
      setPending(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Edit Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Workout name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Push Day"
              defaultValue={defaultName}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={defaultDate}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="time">Start time</Label>
            <Input
              id="time"
              name="time"
              type="time"
              defaultValue={defaultTime}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
