export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted">
        {new Date().getFullYear()} ADHD Diary
      </div>
    </footer>
  );
}
