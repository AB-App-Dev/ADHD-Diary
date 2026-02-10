import Link from "next/link";
import { getAllSessions } from "@/actions/session-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

export default async function SessionsPage() {
  const sessions = await getAllSessions();

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-2xl px-4 py-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sitzungen</h1>
          <Button asChild>
            <Link href="/home">Zur Startseite</Link>
          </Button>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Keine Sitzungen vorhanden.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-3 text-sm">
                      <CalendarIcon className="h-4 w-4 text-white" />
                      <span className="text-white">
                        {format(session.monitoringFrom, "dd.MM.yyyy", { locale: de })} – {format(session.monitoringTo, "dd.MM.yyyy", { locale: de })}
                      </span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-white">{session.medicationName}</span>
                      <span className="text-white">({session.dosage})</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-muted-foreground">{session.entryCount} Einträge</span>
                    </div>
                    <div>
                      {session.isActive && (
                        <Badge variant="default" className="bg-emerald-500">Aktiv</Badge>
                      )}
                      {session.stoppedAt && (
                        <Badge variant="secondary">Gestoppt</Badge>
                      )}
                      {!session.isActive && !session.stoppedAt && (
                        <Badge variant="outline">Beendet</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
