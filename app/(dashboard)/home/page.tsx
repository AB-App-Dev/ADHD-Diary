import { getActiveSession } from "@/actions/session-actions";
import { SessionForm } from "@/components/forms/session-form";

export default async function HomePage() {
  const activeSession = await getActiveSession();

  return <SessionForm activeSession={activeSession} />;
}
