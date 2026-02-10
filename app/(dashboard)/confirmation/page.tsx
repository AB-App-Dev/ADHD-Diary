import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import { LogoutButton } from "@/components/shared/logout-button";

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen justify-center p-6 pt-12">
      <Card className="w-full max-w-md text-center h-fit">
        <CardHeader className="flex flex-col items-center gap-4">
          <CheckCircle2Icon className="h-16 w-16 text-emerald-500" />
          <h1 className="text-xl font-semibold">Erfolgreich gespeichert</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Deine Daten wurden erfolgreich gespeichert.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/home">Zurück zur Startseite</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/sessions">Alle Sitzungen</Link>
          </Button>
          <LogoutButton variant="outline" className="w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
