import { addDays, dayKey, pad2 } from "./dates";
import type { Brs, BrsItem, Course, Item, Payload } from "./types";

function at(now: Date, days: number, hh = 23, mm = 59): string {
  const d = addDays(now, days);
  return `${dayKey(d)}T${pad2(hh)}:${pad2(mm)}`;
}

function item(id: string, name: string, patch: Partial<Item> = {}): Item {
  return {
    id,
    name,
    kind: "assign",
    due: null,
    dueText: "",
    opens: null,
    submitted: false,
    grade: "",
    status: "Ответ не представлен",
    hidden: false,
    url: `https://sdo.example.edu/mod/${patch.kind === "quiz" ? "quiz" : "assign"}/view.php?id=${id}`,
    ...patch,
  };
}

function brs(scores: [number | null, number | null, number | null, number | null], max: number, result: string, items: [string, string, BrsItem["kind"], number | null, number][]): Brs {
  const names = ["Посещаемость", "Текущий контроль", "Семестровый контроль", "Достижения"];
  const maxes = [20, 40, 40, 10];
  const sum = scores.reduce<number>((n, v) => n + (v ?? 0), 0);
  return {
    parts: names.map((n, i) => ({ name: n, score: scores[i], max: maxes[i] })),
    total: { name: "Сумма баллов", score: sum, max },
    result,
    items: items.map(([n, category, kind, score, mx]) => ({ name: n, category, kind, score, max: mx, url: "" })),
  };
}

function course(id: string, short: string, name: string, items: Item[], folders: [string, string[]][], grades: Brs | null = null): Course {
  return {
    id,
    short,
    name,
    url: `https://sdo.example.edu/course/view.php?id=${id}`,
    brs: grades,
    items,
    materials: [
      ...folders.map(([title, files], i) => ({ id: `${id}0${i}`, type: "folder", typeLabel: "папка", name: title, url: `https://sdo.example.edu/mod/folder/view.php?id=${id}0${i}`, files })),
      { id: `${id}9`, type: "forum", typeLabel: "форум", name: "Консультационный форум", url: `https://sdo.example.edu/mod/forum/view.php?id=${id}9`, files: [] },
    ],
  };
}

export function demoPayload(now = new Date(), lite = false): Payload {
  const done = { submitted: true, status: "Отправлено для оценивания" };
  if (lite) {
    const full = demoPayload(now, false);
    return { ...full, queue: [], queueAt: null, reports: {}, features: { check: false }, bot: "" };
  }
  return {
    v: 1,
    generated: at(now, 0, now.getHours(), now.getMinutes()),
    updated: at(now, 0, 8, 51),
    semester: "[I.26-27]",
    host: "sdo.example.edu",
    digestHour: 10,
    courses: [
      course("101", "Матан", "Математический анализ", [
        item("1011", "Практическое задание № 1", { due: at(now, 2) }),
        item("1012", "Практическое задание № 2", { due: at(now, 2) }),
        item("1013", "Практическое задание № 3", { due: at(now, 33), opens: at(now, 4, 0, 0) }),
        item("1014", "Коллоквиум", { due: at(now, 58) }),
        item("1015", "Тест № 1", { kind: "quiz", due: at(now, 5), status: "" }),
        item("1016", "Контрольная работа № 1", { ...done, grade: "9,0" }),
      ], [["Лекции", ["Лекция 1. Пределы.pdf", "Лекция 2. Производная.pdf", "Лекция 3. Интеграл.pdf"]], ["Практические занятия", ["ПЗ 1. Пределы.pdf", "ПЗ 2. Ряды.pdf"]]],
        brs([9, 14, null, null], 120, "2 (неудовлетворительно)", [["Контрольная работа № 1", "Текущий контроль", "assign", 9, 10], ["Тест № 1", "Текущий контроль", "quiz", 5, 5], ["Контрольная работа № 2", "Текущий контроль", "assign", null, 10], ["Коллоквиум", "", "assign", null, 15]])),
      course("102", "БД", "Теория баз данных", [
        item("1021", "Практическое задание 1", { due: at(now, -24) }),
        item("1022", "Практическое задание 2", { due: at(now, -10) }),
        item("1023", "Практическое задание 3", { ...done, due: at(now, -3) }),
        item("1024", "Практическое задание 4", { ...done, grade: "10,0" }),
        item("1025", "Самостоятельная работа 1"),
        item("1026", "Тестирование 1", { kind: "quiz", status: "", dueText: "Нет даты закрытия" }),
      ], [["Методические указания", ["ПЗ 1. Создание базы.pdf", "ПЗ 2. ER-диаграмма.pdf", "ПЗ 3. Нормализация.pdf", "ПЗ 4. Запросы.pdf"]]],
        brs([8.6, 18, null, null], 120, "Не зачтено", [["Практическое задание 3", "Текущий контроль", "assign", 8, 10], ["Практическое задание 4", "Текущий контроль", "assign", 10, 10], ["Тестирование 1", "Текущий контроль", "quiz", null, 5]])),
      course("103", "ТМП", "Технологии и методы программирования", [
        item("1031", "Практическое задание № 2", { due: at(now, -2) }),
        item("1032", "Практическое задание № 3", { ...done, due: at(now, 5) }),
        item("1033", "Практическое задание № 5", { due: at(now, 22), opens: at(now, 3, 0, 0) }),
        item("1034", "Практическое задание № 6", { due: at(now, 26), opens: at(now, 7, 0, 0) }),
        item("1035", "Тестирование 1", { kind: "quiz", status: "", due: at(now, -1), submitted: true, grade: "9,60/10,00" }),
        item("1036", "Тестирование 2", { kind: "quiz", status: "", due: at(now, 25), opens: at(now, 3, 0, 0) }),
      ], [["Практические занятия", ["ПЗ 1.pdf", "ПЗ 2.pdf", "ПЗ 3.pdf", "ПЗ 4.pdf", "ПЗ 5.pdf", "ПЗ 6.pdf"]]]),
      course("104", "ОС", "Операционные системы", [
        item("1041", "Подготовка доклада", { ...done, grade: "10,0", due: at(now, 53) }),
        item("1042", "Практическая работа 1-4", { ...done, grade: "5,0", due: at(now, 58) }),
        item("1043", "Практическая работа 5-8", { ...done, due: at(now, 58) }),
        item("1044", "Самостоятельная работа 1"),
        item("1045", "Тестирование 1", { kind: "quiz", status: "", due: at(now, 18), opens: at(now, 12, 0, 0) }),
      ], [["Методички", ["ПР 1. Установка.pdf", "ПР 2. Файловые системы.pdf", "ПР 3. Процессы.pdf", "ПР 4. Сеть.pdf"]]]),
      course("105", "ИИ", "Системы искусственного интеллекта", [
        item("1051", "Защита рабочих тетрадей № 1-2", { ...done, grade: "8,0" }),
        item("1052", "Защита рабочих тетрадей № 3-4", { ...done, grade: "8,0" }),
        item("1053", "Защита рабочих тетрадей № 5-8"),
        item("1054", "Самостоятельная работа 1"),
        item("1055", "Контрольный тест № 2", { kind: "quiz", status: "", due: at(now, 47), opens: at(now, 40, 9, 0) }),
      ], [["Лекции", ["Лекция 1. Введение.pdf", "Лекция 2. Данные.pdf"]], ["Рабочие тетради", ["Тетрадь 1.pdf", "Тетрадь 2.pdf", "Тетрадь 3.pdf"]]],
        brs([7.5, 20, 40, null], 120, "Зачтено", [["Защита рабочих тетрадей № 1-2", "Текущий контроль", "assign", 8, 8], ["Защита рабочих тетрадей № 3-4", "Текущий контроль", "assign", 8, 8], ["Контрольный тест № 1", "Текущий контроль", "quiz", 4, 4]])),
      course("106", "Англ", "Иностранный язык (английский)", [
        item("1061", "Контрольная работа № 1", { ...done, grade: "9,0" }),
        item("1062", "Контрольная работа № 2", { due: at(now, 1, 18, 0) }),
        item("1063", "Эссе", { due: at(now, 12) }),
      ], [["Материалы", ["Unit 1.pdf", "Unit 2.pdf"]]]),
    ],
    queue: [
      { course: "ТМП", name: "Практическое задание № 5", cmid: "1033", due: dayKey(addDays(now, 22)), files: ["ПР5 Комков.docx", "ПР5 расчёты.xlsx"], note: "форма откроется через 3 дня" },
    ],
    queueAt: at(now, 0, 8, 55),
    reports: {
      check: {
        text: "Проверка СДО и GitHub: со вчерашнего вечера новых заданий нет.\n\nСрочно:\n1. БД, ПЗ 1: срок прошёл, отчёт готов, форма закрыта — просить преподавателя открыть.\n2. ТМП, ПЗ 2: срок прошёл два дня назад, отчёт готов, форма закрыта.\n3. Матан, ПЗ 1 и ПЗ 2: срок через два дня, работ ещё нет.\n\nГотово к загрузке: 1 работа, форма откроется через три дня.",
        at: at(now, 0, 8, 55),
      },
      submit: {
        text: "ТМП ПЗ 3: загружено и отправлено на проверку, статус «Отправлено для оценивания».",
        at: at(now, -1, 3, 46),
      },
    },
  };
}
