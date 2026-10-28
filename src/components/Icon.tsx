export type IconName = "home" | "subjects" | "deadlines" | "check" | "back" | "forward" | "close" | "link" | "refresh" | "folder" | "file" | "quiz" | "assign" | "lock" | "done" | "chevron" | "forum" | "warn" | "brs";

const paths: Record<IconName, string> = {
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z",
  subjects: "M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 0-2 2V4.5ZM5 17.5a2 2 0 0 1 2-2h11",
  deadlines: "M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM12 8v4.5l2.8 1.8",
  check: "M5 12.5l3.5 3.5L19 7.5M4 19h16",
  back: "M14.5 5.5 8 12l6.5 6.5",
  forward: "M9.5 5.5 16 12l-6.5 6.5",
  chevron: "M6.5 9.5 12 15l5.5-5.5",
  close: "M6 6l12 12M18 6 6 18",
  link: "M10 14 14 10M8.5 15.5l-1 1a3.2 3.2 0 0 1-4.5-4.5l2.5-2.5a3.2 3.2 0 0 1 4.5 0M15.5 8.5l1-1a3.2 3.2 0 0 1 4.5 4.5l-2.5 2.5a3.2 3.2 0 0 1-4.5 0",
  refresh: "M19 12a7 7 0 1 1-2.1-5M19 4.5V9h-4.5",
  folder: "M4 7a1 1 0 0 1 1-1h4.5l2 2H19a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z",
  file: "M7 4h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM14 4v4h4",
  quiz: "M8 7h8M8 12h8M8 17h5M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z",
  assign: "M6 4h9l4 4v12H6V4ZM9 13l2 2 4-4",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6v-9Z",
  done: "M5.5 12.5l4 4 9-9.5",
  forum: "M5 6h14v9H9l-4 3.5V6Z",
  warn: "M12 5 20 19H4L12 5ZM12 10v4M12 16.5v.5",
  brs: "M4 19.5h16M7 16.5v-4M12 16.5V7.5M17 16.5v-7",
};

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={paths[name]} />
    </svg>
  );
}
