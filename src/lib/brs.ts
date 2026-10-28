import type { Tone } from "./model";
import type { Brs, BrsItem, BrsScore, Course, Payload } from "./types";

export function formatScore(value: number | null): string {
  if (value === null) return "—";
  const rounded = Math.round(value * 10) / 10;
  return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)).replace(".", ",");
}

export function scoreRatio(s: BrsScore): number {
  if (s.score === null || s.max <= 0) return 0;
  return Math.max(0, Math.min(1, s.score / s.max));
}

export function hasBrs(course: Course): course is Course & { brs: Brs } {
  const b = course.brs;
  return !!b && (b.parts.length > 0 || b.total !== null || b.items.length > 0);
}

export function hasScores(brs: Brs): boolean {
  return (brs.total?.score ?? null) !== null || brs.parts.some((p) => p.score !== null) || brs.items.some((i) => i.score !== null);
}

export function brsCourses(payload: Payload): (Course & { brs: Brs })[] {
  return payload.courses.filter(hasBrs).filter((c) => hasScores(c.brs));
}

export function resultTone(result: string): Tone {
  const r = result.toLowerCase();
  if (!r) return "neutral";
  if (r.startsWith("не зачтено") || r.startsWith("2")) return "neutral";
  if (r.startsWith("зачтено") || /^[345]/.test(r)) return "positive";
  return "neutral";
}

export function isPassing(result: string): boolean {
  return resultTone(result) === "positive";
}

export function shortPart(name: string): string {
  const map: Record<string, string> = {
    "Посещаемость": "Посещения",
    "Текущий контроль": "Текущий",
    "Семестровый контроль": "Семестровый",
    "Достижения": "Достижения",
    "Трудовая деятельность": "Труд",
  };
  return map[name] ?? name;
}

export interface BrsGroup {
  category: string;
  items: BrsItem[];
}

export function groupItems(items: BrsItem[]): BrsGroup[] {
  const groups: BrsGroup[] = [];
  for (const item of items) {
    const last = groups.find((g) => g.category === item.category);
    if (last) last.items.push(item);
    else groups.push({ category: item.category, items: [item] });
  }
  return groups.sort((a, b) => (a.category === "" ? 1 : 0) - (b.category === "" ? 1 : 0));
}

export function brsSummary(payload: Payload): { courses: number; passed: number } {
  const list = brsCourses(payload);
  return { courses: list.length, passed: list.filter((c) => isPassing(c.brs.result)).length };
}
