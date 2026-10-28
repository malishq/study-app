import { formatScore, groupItems, resultTone, scoreRatio } from "../lib/brs";
import { openExternal } from "../lib/telegram";
import type { Brs, BrsItem } from "../lib/types";
import { Card, CardHeader } from "./Card";
import { Icon } from "./Icon";
import { Pill } from "./Pill";
import { ThinBar } from "./ThinBar";

const KIND_LABEL: Record<BrsItem["kind"], string> = {
  assign: "задание",
  quiz: "тест",
  manual: "выставляет преподаватель",
  calc: "считается автоматически",
  other: "элемент курса",
};

export function ScoreOf({ score, max, size = "md" }: { score: number | null; max: number; size?: "md" | "lg" }) {
  return (
    <span className="num shrink-0 whitespace-nowrap text-muted">
      <span className={`font-semibold ${score === null ? "" : "text-ink"} ${size === "lg" ? "text-[22px]" : "text-[15px]"}`}>{formatScore(score)}</span>
      <span className={size === "lg" ? "text-[14px]" : "text-[13px]"}> из {formatScore(max)}</span>
    </span>
  );
}

function ItemLine({ item }: { item: BrsItem }) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[15px] leading-snug font-medium">{item.name}</span>
        <span className="block text-[13px] leading-snug text-muted">{KIND_LABEL[item.kind]}</span>
      </span>
      <ScoreOf score={item.score} max={item.max} />
    </>
  );
  return (
    <li>
      {item.url ? (
        <button type="button" onClick={() => openExternal(item.url)} className="pressable flex min-h-[52px] w-full items-center gap-3 px-5 py-2 text-left">
          {body}
        </button>
      ) : (
        <div className="flex min-h-[52px] items-center gap-3 px-5 py-2">{body}</div>
      )}
    </li>
  );
}

export function BrsCard({ brs }: { brs: Brs }) {
  const groups = groupItems(brs.items);
  return (
    <Card>
      <CardHeader title="БРС" aside={brs.total ? <ScoreOf score={brs.total.score} max={brs.total.max} size="lg" /> : undefined}>
        {brs.total ? brs.total.name : "Баллы из журнала оценок СДО"}
      </CardHeader>
      {brs.total && (
        <div className="px-5 pt-2">
          <ThinBar ratio={scoreRatio(brs.total)} label={`${brs.total.name}: ${formatScore(brs.total.score)} из ${formatScore(brs.total.max)}`} />
        </div>
      )}
      {brs.result && (
        <p className="flex flex-wrap items-center gap-2 px-5 pt-3 text-[14px] leading-snug text-muted">
          По текущей сумме в СДО
          <Pill tone={resultTone(brs.result)}>{brs.result}</Pill>
        </p>
      )}
      {brs.parts.length > 0 && (
        <ul className="flex flex-col gap-3 px-5 pt-4 pb-2">
          {brs.parts.map((p) => (
            <li key={p.name}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[15px] leading-snug">{p.name}</span>
                <ScoreOf score={p.score} max={p.max} />
              </div>
              <ThinBar ratio={scoreRatio(p)} label={`${p.name}: ${formatScore(p.score)} из ${formatScore(p.max)}`} />
            </li>
          ))}
        </ul>
      )}
      {groups.map((g) => (
        <div key={g.category || "other"}>
          <p className="flex items-center gap-1.5 px-5 pt-4 pb-1 text-[13px] font-semibold tracking-[0.02em] text-muted uppercase">
            <Icon name="assign" size={14} />
            {g.category || "Другие работы"}
          </p>
          <ul className="divide-y divide-rule">
            {g.items.map((item, i) => (
              <ItemLine key={`${item.name}-${i}`} item={item} />
            ))}
          </ul>
        </div>
      ))}
      <div className="pb-3" />
    </Card>
  );
}
