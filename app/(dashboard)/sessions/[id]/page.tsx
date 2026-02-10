import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionById } from "@/actions/session-actions";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  PillIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  FileTextIcon,
} from "lucide-react";

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
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/sessions">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Zurück
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{session.medicationName}</h1>
            <p className="text-muted-foreground">{session.dosage}</p>
          </div>
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
        <CardContent className="space-y-3 pt-6">
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

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Einträge ({session.entries.length})</h2>
      </div>

      {session.entries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Keine Einträge vorhanden.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {session.entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{format(entry.date, "EEEE, dd.MM.yyyy", { locale: de })}</span>
                </div>
                <Badge variant={entry.type === "WORKDAY" ? "default" : "secondary"}>
                  {entry.type === "WORKDAY" ? "Werktag" : "Wochenende"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
