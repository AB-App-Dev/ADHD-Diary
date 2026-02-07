import { z } from "zod";

export const sessionFormSchema = z
  .object({
    medicationName: z.string().min(1, "Medikament ist erforderlich"),
    dosage: z.string().min(1, "Dosierung ist erforderlich"),
    intakeTime: z.string().min(1, "Einnahmezeit ist erforderlich"),
    monitoringFrom: z.coerce.date({
      error: "Startdatum ist erforderlich",
    }),
    monitoringTo: z.coerce.date({
      error: "Enddatum ist erforderlich",
    }),
  })
  .refine(
    (data) => data.monitoringTo > data.monitoringFrom,
    {
      message: "Enddatum muss nach dem Startdatum liegen",
      path: ["monitoringTo"],
    }
  );

export type SessionFormData = z.infer<typeof sessionFormSchema>;
