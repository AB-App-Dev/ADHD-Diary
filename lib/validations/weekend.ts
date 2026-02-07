import { z } from "zod";
import { isSaturday, isSunday, isWithinInterval, startOfDay } from "date-fns";

export const createWeekendFormSchema = (sessionStart: Date, sessionEnd: Date) =>
  z.object({
    date: z.coerce
      .date({ message: "Datum ist erforderlich" })
      .refine(
        (date) => isSaturday(date) || isSunday(date),
        { message: "Datum muss ein Samstag oder Sonntag sein" }
      )
      .refine(
        (date) =>
          isWithinInterval(startOfDay(date), {
            start: startOfDay(sessionStart),
            end: startOfDay(sessionEnd),
          }),
        { message: "Datum muss innerhalb des Überwachungszeitraums liegen" }
      ),
    whatWasBetter: z
      .string({ required_error: "Dieses Feld ist erforderlich" })
      .min(1, "Dieses Feld ist erforderlich"),
    whatWasDifficult: z
      .string({ required_error: "Dieses Feld ist erforderlich" })
      .min(1, "Dieses Feld ist erforderlich"),
    sideEffects: z
      .string({ required_error: "Dieses Feld ist erforderlich" })
      .min(1, "Dieses Feld ist erforderlich"),
    concentration: z.enum(["yes", "no"], {
      message: "Bitte wähle eine Option",
    }),
    startingTasks: z.enum(["yes", "no"], {
      message: "Bitte wähle eine Option",
    }),
    lessTired: z.enum(["yes", "no"], {
      message: "Bitte wähle eine Option",
    }),
    medicationHelps: z.enum(["yes", "no", "undefined"], {
      message: "Bitte wähle eine Option",
    }),
    comment: z.string().optional(),
    weeklyRating: z.enum(["a1", "a2", "a3", "a4"], {
      message: "Bitte wähle eine Bewertung",
    }),
  });

export type WeekendFormData = z.infer<ReturnType<typeof createWeekendFormSchema>>;
