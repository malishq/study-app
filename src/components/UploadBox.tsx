import { useRef, useState } from "react";
import { hapticNotify } from "../lib/telegram";
import { formatSize, MAX_UPLOAD, uploadFiles, type UploadMode, type UploadResult } from "../lib/upload";
import { Button } from "./Button";
import { Icon } from "./Icon";

export function UploadBox({ cmid, submitted }: { cmid: string; submitted: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [replace, setReplace] = useState(true);
  const [busy, setBusy] = useState<UploadMode | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const total = files.reduce((sum, f) => sum + f.size, 0);
  const tooBig = total > MAX_UPLOAD;

  const send = async (mode: UploadMode) => {
    setBusy(mode);
    setResult(null);
    const res = await uploadFiles(cmid, files, mode, replace);
    setBusy(null);
    setResult(res);
    hapticNotify(res.ok ? "success" : "error");
    if (res.ok) setFiles([]);
  };

  return (
    <section className="mt-4 rounded-2xl bg-raised px-4 py-4">
      <h3 className="text-[17px] leading-tight font-semibold">{submitted ? "Заменить ответ" : "Загрузить работу"}</h3>
      <p className="mt-1 text-[14px] leading-snug text-muted">Файлы уйдут в СДО от твоего имени, до 20 МБ за раз.</p>
      <input
        ref={input}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          setFiles(Array.from(e.target.files ?? []));
          setResult(null);
          e.target.value = "";
        }}
      />
      <Button variant="ghost" size="sm" className="mt-2 -ml-1 px-1" disabled={busy !== null} onClick={() => input.current?.click()}>
        <Icon name="file" size={16} />
        {files.length ? "Выбрать другие файлы" : "Выбрать файлы"}
      </Button>
      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {files.map((f) => (
            <li key={f.name + f.size} className="flex items-baseline justify-between gap-3 text-[15px]">
              <span className="min-w-0 truncate">{f.name}</span>
              <span className="num shrink-0 text-[13px] text-muted">{formatSize(f.size)}</span>
            </li>
          ))}
        </ul>
      )}
      {tooBig && <p className="mt-2 text-[14px] text-negative">Вместе больше 20 МБ: выбери файлы поменьше.</p>}
      {files.length > 0 && !tooBig && (
        <>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[15px]">
            <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} className="size-[18px] accent-[var(--primary)]" />
            Заменить файлы, прикреплённые раньше
          </label>
          <div className="mt-3 flex flex-col gap-2">
            <Button className="w-full" disabled={busy !== null} onClick={() => send("submit")}>
              {busy === "submit" ? "Загружаю…" : "Отправить на проверку"}
            </Button>
            <Button variant="secondary" className="w-full" disabled={busy !== null} onClick={() => send("draft")}>
              {busy === "draft" ? "Загружаю…" : "Сохранить черновиком"}
            </Button>
          </div>
        </>
      )}
      {result && <p className={`mt-3 text-[14px] leading-snug whitespace-pre-line ${result.ok ? "text-positive" : "text-negative"}`}>{result.text}</p>}
    </section>
  );
}
