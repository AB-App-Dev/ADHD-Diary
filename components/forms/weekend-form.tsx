"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { de } from "date-fns/locale";
import { isSaturday, isSunday, format } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import { ChevronDownIcon, CircleUserIcon, UserCheckIcon, CircleCheckBigIcon } from "lucide-react";
import { createWeekendFormSchema, type WeekendFormData } from "@/lib/validations/weekend";
import { saveWeekendEntry } from "@/actions/session-actions";

interface WeekendFormProps {
  sessionStart: Date;
  sessionEnd: Date;
  existingData?: WeekendFormData;
}

export function WeekendForm({ sessionStart, sessionEnd, existingData }: WeekendFormProps) {
  const router = useRouter();
  const isReadOnly = !!existingData;

  const [errors, setErrors] = React.useState<Partial<Record<keyof WeekendFormData, string>>>({});
  const [formData, setFormData] = React.useState<Partial<WeekendFormData>>(
    existingData ?? {
      whatWasBetter: "",
      whatWasDifficult: "",
      sideEffects: "",
      comment: "",
    }
  );

  const updateField = <K extends keyof WeekendFormData>(
    field: K,
    value: WeekendFormData[K]
  ) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly || isSubmitting) return;

    const schema = createWeekendFormSchema(sessionStart, sessionEnd);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof WeekendFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof WeekendFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const response = await saveWeekendEntry(result.data);
    setIsSubmitting(false);

    if (response.error) {
      if (typeof response.error === "string") {
        setErrors({ date: response.error });
      }
      return;
    }

    router.push("/home");
  };

  const isWeekend = (date: Date) => isSaturday(date) || isSunday(date);

  return (
    <div className="flex min-h-screen items-start justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-semibold">Wochenende</h1>
          {isReadOnly ? (
            <p className="text-sm text-muted-foreground mb-3">
              Du hast dieses Wochenende bereits ausgefüllt.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              Wähle ein Datum aus (nur Samstag oder Sonntag).
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
                    !isWeekend(date) ||
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
                  <CircleUserIcon className="mr-2" /><b>Beobachtungen der Eltern</b>
                </p>
                <Field className="mb-3">
                  <FieldLabel>Was diese Woche besser war</FieldLabel>
                  <Textarea
                    placeholder="Beschreibe hier..."
                    value={formData.whatWasBetter ?? ""}
                    onChange={(e) => updateField("whatWasBetter", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {errors.whatWasBetter && (
                    <p className="text-sm text-destructive mt-1">{errors.whatWasBetter}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <FieldLabel>Was diese Woche schwieriger war</FieldLabel>
                  <Textarea
                    placeholder="Beschreibe hier..."
                    value={formData.whatWasDifficult ?? ""}
                    onChange={(e) => updateField("whatWasDifficult", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {errors.whatWasDifficult && (
                    <p className="text-sm text-destructive mt-1">{errors.whatWasDifficult}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <FieldLabel>Nebenwirkungen:</FieldLabel>
                  <Textarea
                    placeholder="Beschreibe hier..."
                    value={formData.sideEffects ?? ""}
                    onChange={(e) => updateField("sideEffects", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {errors.sideEffects && (
                    <p className="text-sm text-destructive mt-1">{errors.sideEffects}</p>
                  )}
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3" />

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <UserCheckIcon className="mr-2" /> <b>Selbsteinschätzung des Teenagers</b>
                </p>
                <p className="text-sm">Diese Woche - </p>
                <Field className="mb-3">
                  <FieldLabel>Ich konnte mich besser konzentrieren</FieldLabel>
                  <RadioGroup
                    className="w-fit flex space-x-6"
                    value={formData.concentration}
                    onValueChange={(v) => updateField("concentration", v as "yes" | "no")}
                    disabled={isReadOnly}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="concentration-yes" disabled={isReadOnly} />
                      <Label htmlFor="concentration-yes">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="concentration-no" disabled={isReadOnly} />
                      <Label htmlFor="concentration-no">Nein</Label>
                    </div>
                  </RadioGroup>
                  {errors.concentration && (
                    <p className="text-sm text-destructive mt-1">{errors.concentration}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <FieldLabel>Ich konnte leichter mit Aufgaben anfangen</FieldLabel>
                  <RadioGroup
                    className="w-fit flex space-x-6"
                    value={formData.startingTasks}
                    onValueChange={(v) => updateField("startingTasks", v as "yes" | "no")}
                    disabled={isReadOnly}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="startingTasks-yes" disabled={isReadOnly} />
                      <Label htmlFor="startingTasks-yes">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="startingTasks-no" disabled={isReadOnly} />
                      <Label htmlFor="startingTasks-no">Nein</Label>
                    </div>
                  </RadioGroup>
                  {errors.startingTasks && (
                    <p className="text-sm text-destructive mt-1">{errors.startingTasks}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <FieldLabel>Ich fühlte mich weniger müde</FieldLabel>
                  <RadioGroup
                    className="w-fit flex space-x-6"
                    value={formData.lessTired}
                    onValueChange={(v) => updateField("lessTired", v as "yes" | "no")}
                    disabled={isReadOnly}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="lessTired-yes" disabled={isReadOnly} />
                      <Label htmlFor="lessTired-yes">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="lessTired-no" disabled={isReadOnly} />
                      <Label htmlFor="lessTired-no">Nein</Label>
                    </div>
                  </RadioGroup>
                  {errors.lessTired && (
                    <p className="text-sm text-destructive mt-1">{errors.lessTired}</p>
                  )}
                </Field>
                <Field className="mb-3">
                  <FieldLabel>Das Medikament hilft mir</FieldLabel>
                  <RadioGroup
                    className="w-fit flex space-x-6"
                    value={formData.medicationHelps}
                    onValueChange={(v) => updateField("medicationHelps", v as "yes" | "no" | "undefined")}
                    disabled={isReadOnly}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="medicationHelps-yes" disabled={isReadOnly} />
                      <Label htmlFor="medicationHelps-yes">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="medicationHelps-no" disabled={isReadOnly} />
                      <Label htmlFor="medicationHelps-no">Nein</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="undefined" id="medicationHelps-undefined" disabled={isReadOnly} />
                      <Label htmlFor="medicationHelps-undefined">Weiss nicht</Label>
                    </div>
                  </RadioGroup>
                  {errors.medicationHelps && (
                    <p className="text-sm text-destructive mt-1">{errors.medicationHelps}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Kommentar</FieldLabel>
                  <Textarea
                    placeholder="Dein Kommentar..."
                    value={formData.comment ?? ""}
                    onChange={(e) => updateField("comment", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {errors.comment && (
                    <p className="text-sm text-destructive mt-1">{errors.comment}</p>
                  )}
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3" />

            <div className="flex gap-4 mb-20">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <CircleCheckBigIcon className="mr-2" /> <b>Gesamtbewertung der Woche</b>
                </p>
                <Field>
                  <RadioGroup
                    className="w-fit flex flex-col space-y-2"
                    value={formData.weeklyRating}
                    onValueChange={(v) => updateField("weeklyRating", v as "a1" | "a2" | "a3" | "a4")}
                    disabled={isReadOnly}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a1" id="rating-a1" disabled={isReadOnly} />
                      <Label htmlFor="rating-a1">Keine Verbesserung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a2" id="rating-a2" disabled={isReadOnly} />
                      <Label htmlFor="rating-a2">Geringe Verbesserung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a3" id="rating-a3" disabled={isReadOnly} />
                      <Label htmlFor="rating-a3">Deutliche Verbesserung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a4" id="rating-a4" disabled={isReadOnly} />
                      <Label htmlFor="rating-a4">Sehr gute Wirkung der Therapie</Label>
                    </div>
                  </RadioGroup>
                  {errors.weeklyRating && (
                    <p className="text-sm text-destructive mt-1">{errors.weeklyRating}</p>
                  )}
                </Field>
              </div>
            </div>
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
    </div>
  );
}
