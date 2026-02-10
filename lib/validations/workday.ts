import { z } from "zod";
import { isWeekend, isWithinInterval, startOfDay } from "date-fns";

const sliderValue = z.number().min(1, "Bitte wähle einen Wert aus").max(5);

export const createWorkdayFormSchema = (sessionStart: Date, sessionEnd: Date) =>
  z.object({
    date: z.coerce
      .date({ message: "Datum ist erforderlich" })
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
    // Aufmerksamkeit und Schule
    attention: sliderValue,
    participation: sliderValue,
    homework: sliderValue,
    organisation: sliderValue,
    // Energie und Müdigkeit
    tiredness: sliderValue,
    sleep: sliderValue,
    concentration: sliderValue,
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

export type WorkdayFormData = z.infer<ReturnType<typeof createWorkdayFormSchema>>;
