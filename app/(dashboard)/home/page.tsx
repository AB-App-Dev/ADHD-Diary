"use client";

import { Form, Input, Label, Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/form');
  };

  return (
    <div>
      <p>
        Füllen Sie den Plan täglich für 2–3 Wochen aus. - Achten Sie auf Muster,
        nicht auf einzelne Tage. - Nehmen Sie den Plan zum Arzttermin mit. -
        Beziehen Sie, wenn möglich, die Rückmeldungen der Schule mit ein.
      </p>
      <br />
      <p>
        <b>Achtung</b>: Nach start kann man die Einstellungen nicht mehr ändern.
        Die Analyse muss gestopped und neu gestartet werden.
      </p>

      <Form className="flex w-96 flex-col gap-4">
        <div className="flex w-80 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label>Medikament</Label>
            <Input type="text" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Dosierung</Label>
            <Input type="text" />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Einnahmezeit</Label>
            <Input type="text" />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="basic-terms">
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox>
            <Label htmlFor="basic-terms">
              Zeige diese Seite nicht mehr. Leite mich direct zum formular
              weiter.
            </Label>
          </div>
          <div className="flex flex-col gap-1">
              <p>Diese Einstellung kann man über user menu unter Einstellungen immer wieder zurücksetzen.</p>
          </div>
        </div>
      </Form>
      <Button onClick={handleClick}>Speichern und Plan starten</Button>
    </div>
  );
}
