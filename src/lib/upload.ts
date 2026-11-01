export const MAX_UPLOAD = 20 * 1024 * 1024;

export type UploadMode = "draft" | "submit";

export interface UploadResult {
  ok: boolean;
  text: string;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} МБ`;
}

export async function uploadFiles(cmid: string, files: File[], mode: UploadMode, replace: boolean): Promise<UploadResult> {
  const body = new FormData();
  body.append("cmid", cmid);
  body.append("mode", mode);
  body.append("replace", replace ? "1" : "0");
  for (const file of files) body.append("file", file, file.name);
  try {
    const response = await fetch("api/upload", { method: "POST", body });
    const data = (await response.json()) as { ok?: boolean; message?: string };
    return { ok: Boolean(data.ok), text: data.message || (data.ok ? "Готово" : "Не получилось загрузить") };
  } catch {
    return { ok: false, text: "Нет связи с сервером, попробуй ещё раз" };
  }
}
