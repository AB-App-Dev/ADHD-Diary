"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { de } from "date-fns/locale";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import { format } from "date-fns";
import { ChevronDownIcon, CircleUserIcon, UserCheckIcon, CircleCheckBigIcon } from "lucide-react";

export default function WeekendFormPage() {
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
          <h1 className="text-xl font-semibold">Wochenende</h1>
          <p className="text-sm text-muted-foreground mb-3">
            Wähle ein Datum aus. Es kann nur Samstag oder Sonntag sein.
          </p>
          <Field>
            <FieldLabel htmlFor="date-picker-simple">Datum</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                >
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Wähle ein Datum aus</span>
                  )}
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
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <CircleUserIcon className="mr-2"/><b>Beobachtungen der Eltern</b>
                </p>
                <Field className="mb-3">
                  <FieldLabel htmlFor="textarea-message">
                    Was diese Woche besser war
                  </FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="Type your message here."
                  />
                </Field>
                <Field className="mb-3">
                  <FieldLabel htmlFor="textarea-message">
                    Was diese Woche schwieriger war
                  </FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="Type your message here."
                  />
                </Field>
                <Field className="mb-3">
                  <FieldLabel htmlFor="textarea-message">
                    Nebenwirkungen:
                  </FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="Type your message here."
                  />
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <UserCheckIcon className="mr-2"/> <b>Selbsteinschätzung des Teenagers</b>
                </p>
                <p className="text-sm">Diese Woche - </p>
                <Field className="mb-3">
                  <FieldLabel>
                    Ich konnte mich besser konzentrieren
                  </FieldLabel>
                  <RadioGroup className="w-fit flex space-x-6" defaultValue={undefined}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">Nein</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field className="mb-3">
                  <FieldLabel>
                    Ich konnte leichter mit Aufgaben anfangen
                  </FieldLabel>
                  <RadioGroup className="w-fit flex space-x-6" defaultValue={undefined}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">Nein</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field className="mb-3">
                  <FieldLabel htmlFor="textarea-message">
                    Ich fühlte mich weniger müde
                  </FieldLabel>
                  <RadioGroup className="w-fit flex space-x-6" defaultValue={undefined}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">Nein</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field className="mb-3">
                  <FieldLabel htmlFor="textarea-message">
                    Das Medikament hilft mir
                  </FieldLabel>
                  <RadioGroup className="w-fit flex space-x-6" defaultValue={undefined}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="r1" />
                      <Label htmlFor="r1">Ja</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="r2" />
                      <Label htmlFor="r2">Nein</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="undefined" id="r3" />
                      <Label htmlFor="r3">Weiss nicht</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="textarea-message">
                    Kommentar
                  </FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="Type your message here."
                  />
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

            <div className="flex gap-4 mb-20">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <CircleCheckBigIcon className="mr-2"/> <b>Gesamtbewertung der Woche</b>
                </p>
                <Field>
                  <RadioGroup className="w-fit flex flex-col space-y-2" defaultValue={undefined}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a1" id="r1" />
                      <Label htmlFor="r1">Keine Verbesserung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a2" id="r2" />
                      <Label htmlFor="r2">Geringe Verbesserung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a3" id="r3" />
                      <Label htmlFor="r3">Deutliche Verbesserung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="a4" id="r4" />
                      <Label htmlFor="r4">Sehr gute Wirkung der Therapie</Label>
                    </div>
                  </RadioGroup>
                </Field>
              </div>
            </div>

          </CardContent>
          <CardFooter className="pt-3 pb-3">
            <Button type="submit" className="w-full cursor-pointer">
              Speichern
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
