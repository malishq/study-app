import { useState } from "react";
import { ACCENTS, applyAccent, currentAccent, saveAccent, type Accent } from "../lib/accent";
import { formatDay, formatStamp, parseISO } from "../lib/dates";
import { saveSetting } from "../lib/settings";
import { hapticNotify, hapticSelection, openTelegramLink } from "../lib/telegram";
import type { Account } from "../lib/types";
import { Button } from "../components/Button";
import { Card, CardHeader } from "../components/Card";
import { Icon } from "../components/Icon";
import { ScreenTitle } from "../components/ScreenTitle";
import { Switch } from "../components/Switch";

interface Props {
  account: Account;
  bot: string;
  now: Date;
  hideControl: boolean;
  onSettingsChanged(): void;
}

function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]);
  return letters.join("").toUpperCase() || "?";
}

export function ProfileScreen({ account, bot, now, hideControl, onSettingsChanged }: Props) {
  const [accent, setAccent] = useState<Accent>(currentAccent);
  const [hide, setHide] = useState(hideControl);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggleHide = async (next: boolean) => {
    setHide(next);
    setSaving(true);
    setFailed(false);
    hapticSelection();
    const ok = await saveSetting(`hide_control:${next ? 1 : 0}`);
    setSaving(false);
    if (ok) {
      onSettingsChanged();
      return;
    }
    setHide(!next);
    setFailed(true);
    hapticNotify("error");
  };

  const pick = (next: Accent) => {
    if (next === accent) return;
    setAccent(next);
    applyAccent(next);
    saveAccent(next);
    hapticSelection();
  };

  const since = account.since ? parseISO(account.since) : null;
  const rows: [string, string][] = [
    ["Почта СДО", account.email || account.login || "нет данных"],
    ["Telegram", account.telegram || "нет данных"],
    ["Подключён", since && !Number.isNaN(since.getTime()) ? formatDay(since, now) : "нет данных"],
    ["Проверка СДО", formatStamp(account.checked, now)],
  ];

  return (
    <div>
      <ScreenTitle title="Профиль" subline="Аккаунт, через который бот заходит в СДО" />
      <div className="flex flex-col gap-4 px-4 lg:px-0">
        <Card>
          <div className="flex items-center gap-4 px-5 pt-5 pb-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-tile text-[20px] font-bold text-tile-ink" aria-hidden="true">
              {initials(account.name)}
            </span>
            <span className="min-w-0">
              <span className="block text-[20px] leading-tight font-semibold tracking-[-0.01em]">{account.name || "Имя не загрузилось"}</span>
              <span className="mt-1 block truncate text-[14px] text-muted">{account.email || account.login}</span>
            </span>
          </div>
          <dl className="divide-y divide-rule border-t border-rule">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="shrink-0 text-[15px] text-muted">{label}</dt>
                <dd className="num min-w-0 truncate text-right text-[15px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <CardHeader title="Настройки" />
          <div className="flex items-center justify-between gap-4 px-5 pt-2 pb-5">
            <span className="min-w-0">
              <span className="block text-[16px] leading-snug font-medium">Скрывать контрольные работы</span>
              <span className="mt-1 block text-[14px] leading-snug text-muted">Аудиторные контрольные пишут на паре: они пропадут из заданий, сроков и напоминаний бота. Тесты останутся.</span>
            </span>
            <Switch checked={hide} disabled={saving} label="Скрывать контрольные работы" onChange={toggleHide} />
          </div>
          {failed && <p className="px-5 pb-4 text-[14px] text-negative">Не сохранилось, попробуй ещё раз.</p>}
        </Card>

        <Card>
          <CardHeader title="Цвет">Меняет акценты во всём приложении, сохраняется в Telegram</CardHeader>
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 px-4 pt-3 pb-5 sm:grid-cols-7">
            {ACCENTS.map((a) => {
              const selected = a.id === accent;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => pick(a.id)}
                  aria-pressed={selected}
                  className="pressable flex flex-col items-center gap-1.5 rounded-2xl py-1 text-[13px] font-medium"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-full ${selected ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""}`}
                    style={{ background: a.swatch }}
                  >
                    {selected && <Icon name="done" size={20} className="text-black/70" />}
                  </span>
                  <span className={selected ? "text-ink" : "text-muted"}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Данные и выход">
            Логин и пароль хранятся на сервере в зашифрованном виде и нужны только, чтобы бот заходил в СДО. Команда /logout в личке бота удаляет их вместе со всеми данными.
          </CardHeader>
          <div className="px-5 pt-3 pb-5">
            <Button variant="quiet" size="sm" onClick={() => openTelegramLink(`https://t.me/${bot}?text=${encodeURIComponent("/logout")}`)}>
              Отключить СДО
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
