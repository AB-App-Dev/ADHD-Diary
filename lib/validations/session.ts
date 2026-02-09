import { z } from "zod";

export const sessionFormSchema = z
  .object({
    medicationName: z.string().min(1, "Medikament ist erforderlich"),
    dosage: z.string().min(1, "Dosierung ist erforderlich"),
    intakeTime: z.string().min(1, "Einnahmezeit ist erforderlich"),
    monitoringFrom: z.string({ message: "Startdatum ist erforderlich" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datumsformat")
      .transform((str) => new Date(str + "T00:00:00.000Z")),
    monitoringTo: z.string({ message: "Enddatum ist erforderlich" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datumsformat")
      .transform((str) => new Date(str + "T00:00:00.000Z")),
  })
  .refine(
    (data) => data.monitoringTo > data.monitoringFrom,
    {
      message: "Enddatum muss nach dem Startdatum liegen",
      path: ["monitoringTo"],
    }
  );

// Input type (what the form sends - dates as strings)
export type SessionFormInput = z.input<typeof sessionFormSchema>;
// Output type (after Zod validation - dates as Date)
export type SessionFormData = z.output<typeof sessionFormSchema>;
