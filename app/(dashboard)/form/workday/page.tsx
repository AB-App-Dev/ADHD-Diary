"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { de } from "date-fns/locale";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import { format } from "date-fns";
import { ChevronDownIcon, BrainIcon, ThumbsDownIcon, SmileIcon, CloudMoonIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge"

export default function WorkdayFormPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/form");
  };

  const [date, setDate] = React.useState<Date>()
  
  const [attentionValue, setAttentionValue] = React.useState([0]);
  const [participationValue, setParticipationValue] = React.useState([0]);
  const [homeworkValue, setHomeworkValue] = React.useState([0]);
  const [organisationValue, setOrganisationValue] = React.useState([0]);

  const [tirednessValue, setTirednessValue] = React.useState([0]);
  const [sleepValue, setSleepValue] = React.useState([0]);
  const [concentrationValue, setConcentrationValue] = React.useState([0]);

  const [moodValue, setMoodValue] = React.useState([0]);
  const [irritabilityValue, setIrritabilityValue] = React.useState([0]);
  const [motivationValue, setMotivationValue] = React.useState([0]);
  const [hobbyValue, setHobbyValue] = React.useState([0]);

  const [sleepqualityValue, setSleepqualityValue] = React.useState([0]);
  const [asleepValue, setAsleepValue] = React.useState([0]);
  const [morningValue, setMorningValue] = React.useState([0]);
  const [appetiteValue, setAppetiteValue] = React.useState([0]);
  
  return (
    <div className="flex min-h-screen items-start justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-semibold">Schultag</h1>
          <p className="text-sm text-muted-foreground mb-3">
            Wähle ein Datum aus. Es kann nur unter der Woche sein.
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
                  <BrainIcon className="mr-2"/> <b>Aufmerksamkeit und Schule</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Aufmerksamkeit im Unterricht
                  </FieldLabel>
                  <Badge variant="secondary">{attentionValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={attentionValue}
                    onValueChange={setAttentionValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Beginn der Hausaufgaben
                  </FieldLabel>
                  <Badge variant="secondary">{participationValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={participationValue}
                    onValueChange={setParticipationValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Erledigung der Aufgaben
                  </FieldLabel>
                  <Badge variant="secondary">{homeworkValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={homeworkValue}
                    onValueChange={setHomeworkValue}
                  />
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Organisation der Schulaufgaben
                  </FieldLabel>
                  <Badge variant="secondary">{organisationValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={organisationValue}
                    onValueChange={setOrganisationValue}
                  />
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <ThumbsDownIcon className="mr-2"/><b>Energie und Müdigkeit</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Müdigkeit nach der Schule
                  </FieldLabel>
                  <Badge variant="secondary">{tirednessValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={tirednessValue}
                    onValueChange={setTirednessValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Bedürfnis nach Mittagsschlaf
                  </FieldLabel>
                  <Badge variant="secondary">{sleepValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={sleepValue}
                    onValueChange={setSleepValue}
                  />
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Mentale Konzentration am Nachmittag
                  </FieldLabel>
                  <Badge variant="secondary">{concentrationValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={concentrationValue}
                    onValueChange={setConcentrationValue}
                  />
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <SmileIcon className="mr-2"/><b>Stimmung</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Stimmung
                  </FieldLabel>
                  <Badge variant="secondary">{moodValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={moodValue}
                    onValueChange={setMoodValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Reizbarkeit
                  </FieldLabel>
                  <Badge variant="secondary">{irritabilityValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={irritabilityValue}
                    onValueChange={setIrritabilityValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Motivation für Pflichten
                  </FieldLabel>
                  <Badge variant="secondary">{motivationValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={motivationValue}
                    onValueChange={setMotivationValue}
                  />
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Interesse an Hobbys/Freunden
                  </FieldLabel>
                  <Badge variant="secondary">{hobbyValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={hobbyValue}
                    onValueChange={setHobbyValue}
                  />
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="flex items-center mb-3">
                  <CloudMoonIcon className="mr-2"/><b>Schlaf und Appetit</b>
                </p>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Schlafqualität
                  </FieldLabel>
                  <Badge variant="secondary">{sleepqualityValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={sleepqualityValue}
                    onValueChange={setSleepqualityValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Einschlafgeschwindigkeit
                  </FieldLabel>
                  <Badge variant="secondary">{asleepValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={asleepValue}
                    onValueChange={setAsleepValue}
                  />
                </Field>
                <Field className="mb-3">
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Morgendliches Befinden
                  </FieldLabel>
                  <Badge variant="secondary">{morningValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={morningValue}
                    onValueChange={setMorningValue}
                  />
                </Field>
                <Field>
                  <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="textarea-message">
                    Appetit
                  </FieldLabel>
                  <Badge variant="secondary">{appetiteValue}</Badge>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={5}
                    step={1}
                    value={appetiteValue}
                    onValueChange={setAppetiteValue}
                  />
                </Field>
              </div>
            </div>

            <Separator className="mt-3 mb-3"/>

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
