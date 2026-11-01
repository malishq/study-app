export function Switch({ checked, disabled = false, label, onChange }: { checked: boolean; disabled?: boolean; label: string; onChange(next: boolean): void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`pressable relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors disabled:opacity-60 ${checked ? "bg-primary" : "bg-control"}`}
    >
      <span className={`absolute top-[3px] left-[3px] size-6 rounded-full bg-ink shadow transition-transform duration-200 ${checked ? "translate-x-5 bg-on-primary" : ""}`} />
    </button>
  );
}
