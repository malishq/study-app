import { useMemo, useState } from "react";
import { hasBrs } from "../lib/brs";
import { plural } from "../lib/dates";
import { courseProgress, isPending, materialsByKind, sortByDue } from "../lib/model";
import { hapticSelection, openExternal } from "../lib/telegram";
import type { Course, Entry, Material, Payload } from "../lib/types";
import { BrsCard } from "../components/BrsCard";
import { Button } from "../components/Button";
import { Card, CardHeader } from "../components/Card";
import { Icon } from "../components/Icon";
import { ItemRow, RowList } from "../components/ItemRow";
import { ScreenTitle } from "../components/ScreenTitle";
import { ThinBar } from "../components/ThinBar";
import { Tile } from "../components/Tile";

interface ListProps {
  payload: Payload;
  onOpenCourse(course: Course): void;
}

export function SubjectsScreen({ payload, onOpenCourse }: ListProps) {
  const totals = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const c of payload.courses) {
      const p = courseProgress(c);
      done += p.done;
      total += p.total;
    }
    return { done, total };
  }, [payload]);

  return (
    <div>
      <ScreenTitle
        title="Предметы"
        subline={
          <>
            {payload.courses.length} {plural(payload.courses.length, ["предмет", "предмета", "предметов"])} · сдано{" "}
            <span className="num font-semibold text-ink">
              {totals.done} из {totals.total}
            </span>
          </>
        }
      />
      <Card className="mx-4 lg:mx-0">
        <ul className="divide-y divide-rule">
          {payload.courses.map((c) => {
            const p = courseProgress(c);
            return (
              <li key={c.id}>
                <button type="button" onClick={() => onOpenCourse(c)} className="pressable block w-full px-5 py-3.5 text-left">
                  <span className="flex items-center gap-3">
                    <Tile code={c.short} />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-[16px] leading-snug font-medium">{c.name}</span>
                      <span className="block text-[14px] leading-snug text-muted">
                        {p.total === 0 ? "заданий нет" : p.pending === 0 ? "всё сдано" : `${p.pending} ${plural(p.pending, ["не сдано", "не сдано", "не сдано"])}`}
                      </span>
                    </span>
                    <span className="num shrink-0 text-[14px] text-muted">
                      {p.total === 0 ? "—" : (
                        <>
                          <span className="font-semibold text-ink">{p.done}</span> из {p.total}
                        </>
                      )}
                    </span>
                  </span>
                  <span className="mt-2.5 block pl-[56px]">
                    <ThinBar ratio={p.ratio} label={`${c.name}: сдано ${p.done} из ${p.total}`} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function FolderRow({ material }: { material: Material }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <div className="flex items-center gap-3 px-5 py-2.5">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            hapticSelection();
            setOpen((v) => !v);
          }}
          className="pressable flex min-h-[44px] min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-tile text-tile-ink">
            <Icon name="folder" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 block text-[16px] leading-snug font-medium">{material.name}</span>
            <span className="block text-[14px] leading-snug text-muted">{material.files.length === 0 ? "папка пуста" : `${material.files.length} ${plural(material.files.length, ["файл", "файла", "файлов"])}`}</span>
          </span>
          <Icon name="chevron" size={18} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <button type="button" onClick={() => openExternal(material.url)} aria-label={`Открыть папку «${material.name}» в СДО`} className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent">
          <Icon name="link" size={20} />
        </button>
      </div>
      {open && material.files.length > 0 && (
        <ul className="pb-2 pl-[76px]">
          {material.files.map((f) => (
            <li key={f} className="flex items-start gap-2 py-1.5 pr-5 text-[14px] leading-snug">
              <Icon name="file" size={16} className="mt-0.5 shrink-0 text-muted" />
              <span className="min-w-0 break-words">{f}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

interface DetailProps {
  course: Course;
  now: Date;
  onOpen(entry: Entry): void;
}

export function SubjectDetailScreen({ course, now, onOpen }: DetailProps) {
  const p = courseProgress(course);
  const ref = { id: course.id, short: course.short, name: course.name, url: course.url };
  const entries = course.items.filter((i) => !i.hidden).map((i) => ({ ...i, course: ref }));
  const pending = sortByDue(entries.filter(isPending));
  const done = sortByDue(entries.filter((i) => i.submitted));
  const { folders, links } = materialsByKind(course);

  return (
    <div>
      <header className="px-5 pt-3 pb-4 lg:px-0 lg:pt-8">
        <div className="flex items-start gap-3">
          <Tile code={course.short} size={48} />
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] leading-[1.2] font-bold tracking-[-0.01em]">{course.name}</h1>
            <p className="mt-1 text-[16px] leading-snug text-muted">
              {p.total === 0 ? "заданий и тестов нет" : (
                <>
                  сдано{" "}
                  <span className="num font-semibold text-ink">
                    {p.done} из {p.total}
                  </span>
                  {p.pending > 0 && `, не сдано ${p.pending}`}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="mt-3 pl-[60px]">
          <ThinBar ratio={p.ratio} label={`Сдано ${p.done} из ${p.total}`} />
        </div>
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={() => openExternal(course.url)}>
            <Icon name="link" size={16} />
            Курс в СДО
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        {hasBrs(course) && <BrsCard brs={course.brs} />}

        <Card>
          <CardHeader title="Не сдано" aside={<span className="num text-[20px] font-semibold text-accent">{pending.length}</span>} />
          {pending.length > 0 ? (
            <RowList className="pb-1">
              {pending.map((e) => (
                <ItemRow key={e.id} entry={e} now={now} onOpen={onOpen} showCourse={false} />
              ))}
            </RowList>
          ) : (
            <p className="px-5 pt-1 pb-4 text-[16px] leading-snug text-muted">По этому предмету всё сдано.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Сдано" aside={<span className="num text-[20px] font-semibold text-accent">{done.length}</span>} />
          {done.length > 0 ? (
            <RowList className="pb-1">
              {done.map((e) => (
                <ItemRow key={e.id} entry={e} now={now} onOpen={onOpen} showCourse={false} />
              ))}
            </RowList>
          ) : (
            <p className="px-5 pt-1 pb-4 text-[16px] leading-snug text-muted">Сданных работ пока нет.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Материалы" aside={<span className="num text-[20px] font-semibold text-accent">{folders.length + links.length}</span>} />
          {folders.length + links.length > 0 ? (
            <ul className="divide-y divide-rule pb-1">
              {folders.map((m) => (
                <FolderRow key={m.id} material={m} />
              ))}
              {links.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => openExternal(m.url)} className="pressable flex min-h-[60px] w-full items-center gap-3 px-5 py-2.5 text-left">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-tile text-tile-ink">
                      <Icon name={m.type === "forum" ? "forum" : m.type === "url" ? "link" : "file"} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-[16px] leading-snug font-medium">{m.name}</span>
                      <span className="block text-[14px] leading-snug text-muted">{m.typeLabel}</span>
                    </span>
                    <Icon name="forward" size={18} className="shrink-0 text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 pt-1 pb-4 text-[16px] leading-snug text-muted">Материалов в курсе нет.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
