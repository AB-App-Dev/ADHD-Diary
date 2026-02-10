import { z } from "zod";
import { isSaturday, isSunday, isWithinInterval, startOfDay } from "date-fns";

export const createWeekendFormSchema = (sessionStart: Date, sessionEnd: Date) =>
  z.object({
    date: z.string({ message: "Datum ist erforderlich" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datumsformat")
      .transform((str) => {
        const [year, month, day] = str.split('-').map(Number);
        return new Date(year, month - 1, day); // Local midnight
      })
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
    whatWasBetter: z.string().min(1, "Dieses Feld ist erforderlich"),
    whatWasDifficult: z.string().min(1, "Dieses Feld ist erforderlich"),
    sideEffects: z.string().min(1, "Dieses Feld ist erforderlich"),
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

// Input type (what the form sends - date as string)
export type WeekendFormInput = z.input<ReturnType<typeof createWeekendFormSchema>>;
// Output type (after Zod validation - date as Date)
export type WeekendFormData = z.output<ReturnType<typeof createWeekendFormSchema>>;
