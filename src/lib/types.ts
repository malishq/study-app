export type ItemKind = "assign" | "quiz";

export interface Item {
  id: string;
  name: string;
  kind: ItemKind;
  due: string | null;
  dueText: string;
  opens: string | null;
  submitted: boolean;
  grade: string;
  status: string;
  hidden: boolean;
  url: string;
}

export interface Material {
  id: string;
  type: string;
  typeLabel: string;
  name: string;
  url: string;
  files: string[];
}

export interface BrsScore {
  name: string;
  score: number | null;
  max: number;
}

export type BrsItemKind = "assign" | "quiz" | "manual" | "calc" | "other";

export interface BrsItem extends BrsScore {
  category: string;
  kind: BrsItemKind;
  url: string;
}

export interface Brs {
  parts: BrsScore[];
  total: BrsScore | null;
  result: string;
  items: BrsItem[];
}

export interface Course {
  id: string;
  short: string;
  name: string;
  url: string;
  items: Item[];
  materials: Material[];
  brs?: Brs | null;
}

export interface QueueEntry {
  course: string;
  name: string;
  cmid: string;
  due: string;
  files: string[];
  note: string;
}

export interface Report {
  text: string;
  at: string | null;
}

export interface Payload {
  v: number;
  generated: string;
  updated: string | null;
  semester: string;
  host: string;
  digestHour: number;
  courses: Course[];
  queue: QueueEntry[];
  queueAt: string | null;
  reports: Partial<Record<"check" | "submit" | "draft", Report>>;
  bot?: string;
  features?: { check?: boolean };
}

export interface CourseRef {
  id: string;
  short: string;
  name: string;
  url: string;
}

export interface Entry extends Item {
  course: CourseRef;
}

export interface EncryptedBlob {
  v: number;
  iv: string;
  ct: string;
  tag: string;
}
