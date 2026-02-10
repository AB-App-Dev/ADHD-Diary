"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { de } from "date-fns/locale";
import { startOfDay, isBefore, isSameDay, format } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronDownIcon } from "lucide-react";
import { createAndStartSession, stopSession } from "@/actions/session-actions";

type MonitoringSession = {
  id: string;
  medicationName: string;
  dosage: string;
  intakeTimes: string[];
  monitoringFrom: Date;
  monitoringTo: Date;
  isLocked: boolean;
  stoppedAt: Date | null;
};

type ValidationErrors = {
  fromDate?: string;
  toDate?: string;
  medikament?: string;
  dosierung?: string;
  einnahmezeit?: string;
};

type SessionFormProps = {
  activeSession: MonitoringSession | null;
};

export function SessionForm({ activeSession }: SessionFormProps) {
  const router = useRouter();
  const today = startOfDay(new Date());
  const isActive = !!activeSession;

  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    activeSession?.monitoringFrom
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(
    activeSession?.monitoringTo
  );
  const [medikament, setMedikament] = React.useState(
    activeSession?.medicationName ?? ""
  );
  const [dosierung, setDosierung] = React.useState(
    activeSession?.dosage ?? ""
  );
  const [einnahmezeit, setEinnahmezeit] = React.useState(
    activeSession?.intakeTimes[0] ?? ""
  );
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!fromDate) {
      newErrors.fromDate = "Startdatum ist erforderlich";
    } else if (isBefore(startOfDay(fromDate), today)) {
      newErrors.fromDate = "Startdatum darf nicht in der Vergangenheit liegen";
    }

    if (!toDate) {
      newErrors.toDate = "Enddatum ist erforderlich";
    } else if (isBefore(startOfDay(toDate), today)) {
      newErrors.toDate = "Enddatum darf nicht in der Vergangenheit liegen";
    } else if (fromDate && isSameDay(fromDate, toDate)) {
      newErrors.toDate = "Enddatum muss sich vom Startdatum unterscheiden";
    }

    if (!medikament.trim()) {
      newErrors.medikament = "Medikament ist erforderlich";
    }

    if (!dosierung.trim()) {
      newErrors.dosierung = "Dosierung ist erforderlich";
    }

    if (!einnahmezeit.trim()) {
      newErrors.einnahmezeit = "Einnahmezeit ist erforderlich";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await createAndStartSession({
        medicationName: medikament,
        dosage: dosierung,
        intakeTime: einnahmezeit,
        monitoringFrom: fromDate!,
        monitoringTo: toDate!,
      });

      if (result.error) {
        toast.error("Fehler beim Speichern der Sitzung");
        return;
      }

      toast.success("Sitzung gestartet");
      router.push("/form");
    } catch {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;

    setIsSubmitting(true);
    try {
      const result = await stopSession(activeSession.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Sitzung wurde gestoppt und gespeichert");
      router.refresh();
    } catch {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-semibold">Medikamenten-Monitoring</h1>
          <p className="text-sm text-muted-foreground">
            Füllen Sie den Plan täglich für 2–3 Wochen aus. Achten Sie auf
            Muster, nicht auf einzelne Tage. Nehmen Sie den Plan zum Arzttermin
            mit und beziehen Sie, wenn möglich, die Rückmeldungen der Schule mit
            ein.
          </p>

          {isActive && (
            <Button
                  type="button"
                  className="w-full cursor-pointer mt-6"
                  onClick={() => router.push("/form")}
                >
                  Zum Formular
                </Button>
            )}
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {isActive ? (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 px-4 py-3 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  <strong>Aktive Sitzung:</strong> Die Einstellungen sind gesperrt.
                  Stoppen Sie die Sitzung, um eine neue zu starten.
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950 px-4 py-3 mb-6">
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  <strong>Achtung:</strong> Nach dem Start können die
                  Einstellungen nicht mehr geändert werden. Die Analyse muss
                  gestoppt und neu gestartet werden.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="from-date-picker">Von</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!fromDate}
                        disabled={isActive}
                        className={`data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal ${errors.fromDate ? "border-red-500" : ""}`}
                      >
                        {fromDate ? format(fromDate, "PPP", { locale: de }) : <span>Wähle ein Datum aus</span>}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        defaultMonth={fromDate}
                        disabled={(date) => isBefore(startOfDay(date), today)}
                        locale={de}
                        ISOWeek
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.fromDate && <p className="text-xs text-red-500">{errors.fromDate}</p>}
                </Field>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="to-date-picker">Bis</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!toDate}
                        disabled={isActive}
                        className={`data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal ${errors.toDate ? "border-red-500" : ""}`}
                      >
                        {toDate ? format(toDate, "PPP", { locale: de }) : <span>Wähle ein Datum aus</span>}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        defaultMonth={toDate}
                        disabled={(date) => isBefore(startOfDay(date), today)}
                        locale={de}
                        ISOWeek
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.toDate && <p className="text-xs text-red-500">{errors.toDate}</p>}
                </Field>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="medikament">Medikament</Label>
              <Input
                id="medikament"
                placeholder="z.B. Ritalin"
                value={medikament}
                onChange={(e) => setMedikament(e.target.value)}
                disabled={isActive}
                className={errors.medikament ? "border-red-500" : ""}
              />
              {errors.medikament && <p className="text-xs text-red-500">{errors.medikament}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dosierung">Dosierung</Label>
              <Input
                id="dosierung"
                placeholder="z.B. 10mg"
                value={dosierung}
                onChange={(e) => setDosierung(e.target.value)}
                disabled={isActive}
                className={errors.dosierung ? "border-red-500" : ""}
              />
              {errors.dosierung && <p className="text-xs text-red-500">{errors.dosierung}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="einnahmezeit">Einnahmezeit</FieldLabel>
                  <Input
                    type="time"
                    id="einnahmezeit"
                    step="60"
                    value={einnahmezeit}
                    onChange={(e) => setEinnahmezeit(e.target.value)}
                    disabled={isActive}
                    className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${errors.einnahmezeit ? "border-red-500" : ""}`}
                  />
                  {errors.einnahmezeit && <p className="text-xs text-red-500">{errors.einnahmezeit}</p>}
                </Field>
              </FieldGroup>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-12 pb-3">
            {isActive ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Wird gestoppt..." : "Sitzung stoppen"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sitzung stoppen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sind Sie sicher, dass Sie die Sitzung beenden möchten? Alle
                        bisherigen Einträge bleiben erhalten, aber Sie können keine
                        neuen Einträge mehr hinzufügen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleStop}
                        variant="destructive"
                      >
                        Ja, Sitzung stoppen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird gespeichert..." : "Speichern und Plan starten"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
