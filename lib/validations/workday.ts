import { z } from "zod";
import { isWeekend, isWithinInterval, startOfDay } from "date-fns";

const sliderValue = z.number().min(1, "Bitte wähle einen Wert aus").max(5);
const optionalSliderValue = z.number().min(0).max(5);

export const createWorkdayFormSchema = (sessionStart: Date, sessionEnd: Date) =>
  z.object({
    date: z.string({ message: "Datum ist erforderlich" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datumsformat")
      .transform((str) => new Date(str + "T00:00:00.000Z"))
      .refine(
        (date) => !isWeekend(date),
        { message: "Datum muss ein Wochentag sein" }
      )
      .refine(
        (date) =>
          isWithinInterval(startOfDay(date), {
            start: startOfDay(sessionStart),
            end: startOfDay(sessionEnd),
          }),
        { message: "Datum muss innerhalb des Überwachungszeitraums liegen" }
      ),
    // Aufmerksamkeit und Schule (optional - 0 allowed)
    attention: optionalSliderValue,
    participation: optionalSliderValue,
    homework: optionalSliderValue,
    organisation: optionalSliderValue,
    // Energie und Müdigkeit
    tiredness: sliderValue,
    sleep: sliderValue,
    concentration: sliderValue,
    headache: sliderValue,
    // Stimmung
    mood: sliderValue,
    irritability: sliderValue,
    motivation: sliderValue,
    hobby: sliderValue,
    // Schlaf und Appetit
    sleepQuality: sliderValue,
    asleep: sliderValue,
    morning: sliderValue,
    appetite: sliderValue,
    // Optional comment
    comment: z.string().optional(),
  });

// Input type (what the form sends - date as string)
export type WorkdayFormInput = z.input<ReturnType<typeof createWorkdayFormSchema>>;
// Output type (after Zod validation - date as Date)
export type WorkdayFormData = z.output<ReturnType<typeof createWorkdayFormSchema>>;
