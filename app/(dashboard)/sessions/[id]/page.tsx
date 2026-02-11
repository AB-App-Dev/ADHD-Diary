import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionById } from "@/actions/session-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  PillIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  FileTextIcon,
  BarChart3Icon,
} from "lucide-react";

const workdaySections = [
  {
    title: "Aufmerksamkeit und Schule",
    fields: [
      { key: "attention", label: "Aufmerksamkeit im Unterricht" },
      { key: "participation", label: "Beginn der Hausaufgaben" },
      { key: "homework", label: "Erledigung der Aufgaben" },
      { key: "organisation", label: "Organisation der Schulaufgaben" },
    ],
  },
  {
    title: "Energie und Müdigkeit",
    fields: [
      { key: "tiredness", label: "Müdigkeit am Nachmittag" },
      { key: "sleep", label: "Bedürfnis nach Mittagsschlaf" },
      { key: "concentration", label: "Mentale Konzentration am Nachmittag" },
      { key: "headache", label: "Kopfschmerzen" },
    ],
  },
  {
    title: "Stimmung",
    fields: [
      { key: "mood", label: "Stimmung" },
      { key: "irritability", label: "Reizbarkeit" },
      { key: "motivation", label: "Motivation für Pflichten" },
      { key: "hobby", label: "Interesse an Hobbys/Freunden" },
    ],
  },
  {
    title: "Schlaf und Appetit",
    fields: [
      { key: "sleepQuality", label: "Schlafqualität" },
      { key: "asleep", label: "Einschlafgeschwindigkeit" },
      { key: "morning", label: "Morgendliches Befinden" },
      { key: "appetite", label: "Appetit" },
      { key: "comment", label: "Kommentar" },
    ],
  },
];

const weekendSections = [
  {
    title: "Beobachtungen der Eltern",
    fields: [
      { key: "whatWasBetter", label: "Was diese Woche besser war" },
      { key: "whatWasDifficult", label: "Was diese Woche schwieriger war" },
      { key: "sideEffects", label: "Nebenwirkungen" },
    ],
  },
  {
    title: "Selbsteinschätzung des Teenagers",
    fields: [
      { key: "concentration", label: "Ich konnte mich besser konzentrieren" },
      { key: "startingTasks", label: "Ich konnte leichter mit Aufgaben anfangen" },
      { key: "lessTired", label: "Ich fühlte mich weniger müde" },
      { key: "medicationHelps", label: "Das Medikament hilft mir" },
      { key: "weeklyRating", label: "Wochenbewertung" },
      { key: "comment", label: "Kommentar" },
    ],
  },
];

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "–";
  if (typeof value === "number") return value === 0 ? "–" : `${value}/5`;
  if (value === "yes") return "Ja";
  if (value === "no") return "Nein";
  if (value === "undefined") return "Unklar";
  if (key === "weeklyRating") {
    const ratings: Record<string, string> = {
      a1: "Sehr gut",
      a2: "Gut",
      a3: "Mäßig",
      a4: "Schlecht",
    };
    return ratings[value as string] || String(value);
  }
  return String(value);
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSessionById(id);

  if (!session) {
    notFound();
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/sessions">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Zurück
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/analytics/${session.id}`}>
              <BarChart3Icon className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          {session.isActive && (
            <Badge variant="default" className="bg-emerald-500">
              Aktiv
            </Badge>
          )}
          {session.stoppedAt && <Badge variant="secondary">Gestoppt</Badge>}
          {!session.isActive && !session.stoppedAt && (
            <Badge variant="outline">Beendet</Badge>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="flex justify-between">
          <div className="flex items-center gap-3">
            <PillIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{session.dosage}</p>
              <p>{session.medicationName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Zeitraum</p>
              <p>
                {format(session.monitoringFrom, "dd.MM.yyyy", { locale: de })} –{" "}
                {format(session.monitoringTo, "dd.MM.yyyy", { locale: de })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Einnahmezeit</p>
              <p>{session.intakeTimes.join(", ")}</p>
            </div>
          </div>
          {session.stoppedAt && (
            <div className="flex items-center gap-3">
              <PillIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Gestoppt am</p>
                <p>{format(session.stoppedAt, "dd.MM.yyyy", { locale: de })}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mb-4">Einträge ({session.entries.length})</h2>

      {session.entries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Keine Einträge vorhanden.
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {session.entries.map((entry: (typeof session.entries)[number]) => {
            const answers = entry.answers as Record<string, unknown>;
            const sections = entry.type === "WORKDAY" ? workdaySections : weekendSections;
            return (
              <AccordionItem
                key={entry.id}
                value={entry.id}
                className="border rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="py-3 hover:no-underline cursor-pointer">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{format(entry.date, "EEEE, dd.MM.yyyy", { locale: de })}</span>
                    </div>
                    <Badge variant={entry.type === "WORKDAY" ? "default" : "secondary"}>
                      {entry.type === "WORKDAY" ? "Werktag" : "Wochenende"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.title}>
                        <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          {section.fields.map(({ key, label }) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{label}</span>
                              <span>{formatValue(key, answers[key])}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
