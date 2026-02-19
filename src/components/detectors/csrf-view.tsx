'use client';

export function CsrfView() {
  return (
    <p className="text-muted-foreground text-xs">
      CSRF token — do not remove when replaying or debugging requests.
    </p>
  );
}
