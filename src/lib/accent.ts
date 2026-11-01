import { cloud } from "./telegram";

export type Accent = "pink" | "lavender" | "blue" | "mint" | "peach" | "cherry" | "mono";

export const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: "pink", label: "Розовый", swatch: "#ffc2d4" },
  { id: "lavender", label: "Лаванда", swatch: "#d6c4ff" },
  { id: "blue", label: "Голубой", swatch: "#b8d9ff" },
  { id: "mint", label: "Мятный", swatch: "#a9ecd0" },
  { id: "peach", label: "Персик", swatch: "#ffc9a8" },
  { id: "cherry", label: "Вишня", swatch: "#ff9fae" },
  { id: "mono", label: "Серый", swatch: "#e6e6e6" },
];

const STORAGE = "study-app:accent";
const CLOUD = "accent";

function isAccent(value: string | null | undefined): value is Accent {
  return ACCENTS.some((a) => a.id === value);
}

export function currentAccent(): Accent {
  const value = document.documentElement.dataset.accent;
  return isAccent(value) ? value : "pink";
}

export function applyAccent(accent: Accent): void {
  document.documentElement.dataset.accent = accent;
}

export function savedAccent(): Accent {
  try {
    const value = localStorage.getItem(STORAGE);
    if (isAccent(value)) return value;
  } catch {
    return "pink";
  }
  return "pink";
}

export function saveAccent(accent: Accent): void {
  try {
    localStorage.setItem(STORAGE, accent);
  } catch {
    return;
  }
  cloud.set(CLOUD, accent).catch(() => undefined);
}

export async function cloudAccent(): Promise<Accent | null> {
  try {
    const value = await cloud.get(CLOUD);
    if (!isAccent(value)) return null;
    localStorage.setItem(STORAGE, value);
    return value;
  } catch {
    return null;
  }
}
