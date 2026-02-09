"use client";

import React from "react";
import { de } from "date-fns/locale";
import { isWeekend, format, startOfToday } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import { ChevronDownIcon, BrainIcon, ThumbsUpIcon, SmileIcon, CloudMoonIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { createWorkdayFormSchema, type WorkdayFormData } from "@/lib/validations/workday";
import { saveWorkdayEntry } from "@/actions/session-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WorkdayFormProps {
  sessionStart: Date;
  sessionEnd: Date;
  existingData?: WorkdayFormData;
}

export function WorkdayForm({ sessionStart, sessionEnd, existingData }: WorkdayFormProps) {
  const isReadOnly = !!existingData;

  const [errors, setErrors] = React.useState<Partial<Record<keyof WorkdayFormData, string>>>({});
  const [formData, setFormData] = React.useState<Partial<WorkdayFormData>>(
    existingData ?? {
      attention: 0,
      participation: 0,
      homework: 0,
      organisation: 0,
      tiredness: 0,
      sleep: 0,
      concentration: 0,
      headache: 0,
      mood: 0,
      irritability: 0,
      motivation: 0,
      hobby: 0,
      sleepQuality: 0,
      asleep: 0,
      morning: 0,
      appetite: 0,
    }
  );

  const updateField = <K extends keyof WorkdayFormData>(
    field: K,
    value: WorkdayFormData[K]
  ) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showFutureConfirm, setShowFutureConfirm] = React.useState(false);
  const [validatedData, setValidatedData] = React.useState<WorkdayFormData | null>(null);

  const submitEntry = async (data: WorkdayFormData) => {
    setIsSubmitting(true);
    const response = await saveWorkdayEntry(data);
    setIsSubmitting(false);

    // If we get here, there was an error (success redirects on server)
    if (response?.error) {
      if (typeof response.error === "string") {
        toast.error(response.error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly || isSubmitting) return;

    const schema = createWorkdayFormSchema(sessionStart, sessionEnd);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof WorkdayFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof WorkdayFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Check if date is in the future
    if (result.data.date > startOfToday()) {
      setValidatedData(result.data);
      setShowFutureConfirm(true);
      return;
    }

    await submitEntry(result.data);
  };

  const handleConfirmFutureSubmit = async () => {
    setShowFutureConfirm(false);
    if (validatedData) {
      await submitEntry(validatedData);
      setValidatedData(null);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center px-2 py-6 sm:px-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-semibold">Schultag</h1>
          {isReadOnly ? (
            <p className="text-sm text-muted-foreground mb-3">
              Du hast diesen Tag bereits ausgefüllt.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              Wähle ein Datum aus. Es kann nur unter der Woche sein.
              <br />
              <span className="font-medium">
                Überwachungszeitraum: {format(sessionStart, "dd.MM.yyyy", { locale: de })} – {format(sessionEnd, "dd.MM.yyyy", { locale: de })}
              </span>
            </p>
          )}
          <Field>
            <FieldLabel htmlFor="date-picker-simple">Datum</FieldLabel>
            <Popover>
              <PopoverTrigger asChild disabled={isReadOnly}>
                <Button
                  variant="outline"
                  data-empty={!formData.date}
                  disabled={isReadOnly}
                  className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                >
                  {formData.date ? (
                    format(formData.date, "PPP", { locale: de })
                  ) : (
                    <span>Wähle ein Datum aus</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && updateField("date", date)}
                  defaultMonth={formData.date}
                  locale={de}
                  ISOWeek
                  disabled={(date) =>
                    isWeekend(date) ||
                    date < sessionStart ||
                    date > sessionEnd
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive mt-1">{errors.date}</p>
            )}
          </Field>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <BrainIcon className="mr-2 text-blue-500"/> <b>Aufmerksamkeit und Schule</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Aufmerksamkeit im Unterricht
                  </FieldLabel>
                  <Badge variant="secondary">{formData.attention}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.attention ?? 0]}
                    onValueChange={([v]) => updateField("attention", v)}
                    disabled={isReadOnly}
                  />
                  {errors.attention && (
                    <p className="text-sm text-destructive mt-1">{errors.attention}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Beginn der Hausaufgaben
                  </FieldLabel>
                  <Badge variant="secondary">{formData.participation}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.participation ?? 0]}
                    onValueChange={([v]) => updateField("participation", v)}
                    disabled={isReadOnly}
                  />
                  {errors.participation && (
                    <p className="text-sm text-destructive mt-1">{errors.participation}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Erledigung der Aufgaben
                  </FieldLabel>
                  <Badge variant="secondary">{formData.homework}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.homework ?? 0]}
                    onValueChange={([v]) => updateField("homework", v)}
                    disabled={isReadOnly}
                  />
                  {errors.homework && (
                    <p className="text-sm text-destructive mt-1">{errors.homework}</p>
                  )}
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Organisation der Schulaufgaben
                  </FieldLabel>
                  <Badge variant="secondary">{formData.organisation}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.organisation ?? 0]}
                    onValueChange={([v]) => updateField("organisation", v)}
                    disabled={isReadOnly}
                  />
                  {errors.organisation && (
                    <p className="text-sm text-destructive mt-1">{errors.organisation}</p>
                  )}
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <ThumbsUpIcon className="mr-2 text-amber-500"/><b>Energie und Müdigkeit</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Müdigkeit am Nachmittag
                  </FieldLabel>
                  <Badge variant="secondary">{formData.tiredness}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.tiredness ?? 0]}
                    onValueChange={([v]) => updateField("tiredness", v)}
                    disabled={isReadOnly}
                  />
                  {errors.tiredness && (
                    <p className="text-sm text-destructive mt-1">{errors.tiredness}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Bedürfnis nach Mittagsschlaf
                  </FieldLabel>
                  <Badge variant="secondary">{formData.sleep}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.sleep ?? 0]}
                    onValueChange={([v]) => updateField("sleep", v)}
                    disabled={isReadOnly}
                  />
                  {errors.sleep && (
                    <p className="text-sm text-destructive mt-1">{errors.sleep}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Mentale Konzentration am Nachmittag
                  </FieldLabel>
                  <Badge variant="secondary">{formData.concentration}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.concentration ?? 0]}
                    onValueChange={([v]) => updateField("concentration", v)}
                    disabled={isReadOnly}
                  />
                  {errors.concentration && (
                    <p className="text-sm text-destructive mt-1">{errors.concentration}</p>
                  )}
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Kopfschmerzen
                  </FieldLabel>
                  <Badge variant="secondary">{formData.headache}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.headache ?? 0]}
                    onValueChange={([v]) => updateField("headache", v)}
                    disabled={isReadOnly}
                  />
                  {errors.headache && (
                    <p className="text-sm text-destructive mt-1">{errors.headache}</p>
                  )}
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <SmileIcon className="mr-2 text-emerald-500"/><b>Stimmung</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Stimmung
                  </FieldLabel>
                  <Badge variant="secondary">{formData.mood}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.mood ?? 0]}
                    onValueChange={([v]) => updateField("mood", v)}
                    disabled={isReadOnly}
                  />
                  {errors.mood && (
                    <p className="text-sm text-destructive mt-1">{errors.mood}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Reizbarkeit
                  </FieldLabel>
                  <Badge variant="secondary">{formData.irritability}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.irritability ?? 0]}
                    onValueChange={([v]) => updateField("irritability", v)}
                    disabled={isReadOnly}
                  />
                  {errors.irritability && (
                    <p className="text-sm text-destructive mt-1">{errors.irritability}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Motivation für Pflichten
                  </FieldLabel>
                  <Badge variant="secondary">{formData.motivation}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.motivation ?? 0]}
                    onValueChange={([v]) => updateField("motivation", v)}
                    disabled={isReadOnly}
                  />
                  {errors.motivation && (
                    <p className="text-sm text-destructive mt-1">{errors.motivation}</p>
                  )}
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Interesse an Hobbys/Freunden
                  </FieldLabel>
                  <Badge variant="secondary">{formData.hobby}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.hobby ?? 0]}
                    onValueChange={([v]) => updateField("hobby", v)}
                    disabled={isReadOnly}
                  />
                  {errors.hobby && (
                    <p className="text-sm text-destructive mt-1">{errors.hobby}</p>
                  )}
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <CloudMoonIcon className="mr-2 text-indigo-400"/><b>Schlaf und Appetit</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Schlafqualität
                  </FieldLabel>
                  <Badge variant="secondary">{formData.sleepQuality}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.sleepQuality ?? 0]}
                    onValueChange={([v]) => updateField("sleepQuality", v)}
                    disabled={isReadOnly}
                  />
                  {errors.sleepQuality && (
                    <p className="text-sm text-destructive mt-1">{errors.sleepQuality}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Einschlafgeschwindigkeit
                  </FieldLabel>
                  <Badge variant="secondary">{formData.asleep}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.asleep ?? 0]}
                    onValueChange={([v]) => updateField("asleep", v)}
                    disabled={isReadOnly}
                  />
                  {errors.asleep && (
                    <p className="text-sm text-destructive mt-1">{errors.asleep}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Morgendliches Befinden
                  </FieldLabel>
                  <Badge variant="secondary">{formData.morning}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.morning ?? 0]}
                    onValueChange={([v]) => updateField("morning", v)}
                    disabled={isReadOnly}
                  />
                  {errors.morning && (
                    <p className="text-sm text-destructive mt-1">{errors.morning}</p>
                  )}
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel>
                    Appetit
                  </FieldLabel>
                  <Badge variant="secondary">{formData.appetite}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={[formData.appetite ?? 0]}
                    onValueChange={([v]) => updateField("appetite", v)}
                    disabled={isReadOnly}
                  />
                  {errors.appetite && (
                    <p className="text-sm text-destructive mt-1">{errors.appetite}</p>
                  )}
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

          </CardContent>
          {!isReadOnly && (
            <CardFooter className="pt-3 pb-3">
              <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Speichern..." : "Speichern"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>

      <AlertDialog open={showFutureConfirm} onOpenChange={setShowFutureConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Datum in der Zukunft</AlertDialogTitle>
            <AlertDialogDescription>
              Das ausgewählte Datum liegt in der Zukunft. Bist du sicher, dass du die Daten für dieses Datum speichern möchtest?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFutureSubmit}>
              Bestätigen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
