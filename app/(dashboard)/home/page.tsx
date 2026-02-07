"use client";

import React from 'react'
import { useRouter } from "next/navigation"
import { de } from "date-fns/locale"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export default function HomePage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/form");
  };

  const [date, setDate] = React.useState<Date>()

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
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <Field>
                <FieldLabel htmlFor="date-picker-simple">Von</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                    >
                      {date ? format(date, "PPP") : <span>Wähle ein Datum aus</span>}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date}
                      locale={de}
                      ISOWeek
                    />
                  </PopoverContent>
                </Popover>
                </Field>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <Field>
                <FieldLabel htmlFor="date-picker-simple">Bis</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                    >
                      {date ? format(date, "PPP") : <span>Wähle ein Datum aus</span>}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date}
                      locale={de}
                      ISOWeek
                    />
                  </PopoverContent>
                </Popover>
                </Field>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Medikament</Label>
              <Input placeholder="z.B. Ritalin" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Dosierung</Label>
              <Input placeholder="z.B. 10mg" />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="time-picker-optional">Einnahmezeit</FieldLabel>
                  <Input
                    type="time"
                    id="time-picker-optional"
                    step="60"
                    defaultValue="08:00"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </Field>
              </FieldGroup>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox id="skip-intro" />
              <Label htmlFor="skip-intro" className="cursor-pointer font-normal">
                Diese Seite nicht mehr anzeigen, direkt zum Formular weiterleiten
              </Label>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Diese Einstellung kann über das Benutzermenü unter Einstellungen
              zurückgesetzt werden.
            </p>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 px-4 py-3">
              <p className="text-sm text-amber-700 dark:text-amber-200">
                <strong>Achtung:</strong> Nach dem Start können die
                Einstellungen nicht mehr geändert werden. Die Analyse muss
                gestoppt und neu gestartet werden.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-3 pb-3">
            <Button type="submit" className="w-full cursor-pointer">
              Speichern und Plan starten
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
