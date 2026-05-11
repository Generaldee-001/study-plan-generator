import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Upload,
  Type,
  Calendar,
  Clock,
  CalendarDays,
  Sparkles,
  Download,
  RotateCcw,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DynoSchedule — Generate Your Study Plan" },
      {
        name: "description",
        content:
          "Create a personalized weekly study timetable from your syllabus or subject in seconds.",
      },
    ],
  }),
});

type AppState = "setup" | "review" | "result";
type InputMode = "upload" | "subject";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type ScheduleRow = { day: string; topic: string; duration: string };

const MOCK_SCHEDULE: ScheduleRow[] = [
  { day: "Mon · Week 1", topic: "Introduction & Atomic Structure", duration: "2h" },
  { day: "Tue · Week 1", topic: "Hybridization and Bonding", duration: "2h" },
  { day: "Wed · Week 1", topic: "Alkanes — Nomenclature", duration: "2h" },
  { day: "Thu · Week 1", topic: "Alkenes & Alkynes", duration: "2h" },
  { day: "Fri · Week 1", topic: "Practice Problems Set 1", duration: "2h" },
  { day: "Mon · Week 2", topic: "Stereochemistry Basics", duration: "2h" },
  { day: "Tue · Week 2", topic: "Reaction Mechanisms — SN1/SN2", duration: "2h" },
  { day: "Wed · Week 2", topic: "Elimination Reactions E1/E2", duration: "2h" },
  { day: "Thu · Week 2", topic: "Alcohols & Ethers", duration: "2h" },
  { day: "Fri · Week 2", topic: "Mid-plan Review & Quiz", duration: "2h" },
];

function Index() {
  const [state, setState] = useState<AppState>("setup");
  const [mode, setMode] = useState<InputMode>("subject");
  const [subject, setSubject] = useState("Organic Chemistry");
  const [syllabus, setSyllabus] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [hours, setHours] = useState(2);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const toggleDay = (d: string) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const topic = mode === "subject" ? subject || "your subject" : "your uploaded syllabus";

  const reset = () => {
    setState("setup");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">DynoSchedule</span>
          </div>
          <span className="text-sm text-slate-500">Smart study planner</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {state === "setup" && (
          <SetupView
            mode={mode}
            setMode={setMode}
            subject={subject}
            setSubject={setSubject}
            syllabus={syllabus}
            setSyllabus={setSyllabus}
            weeks={weeks}
            setWeeks={setWeeks}
            hours={hours}
            setHours={setHours}
            days={days}
            toggleDay={toggleDay}
            onNext={() => setState("review")}
          />
        )}

        {state === "review" && (
          <ReviewView
            topic={topic}
            weeks={weeks}
            hours={hours}
            days={days}
            onBack={() => setState("setup")}
            onConfirm={() => setState("result")}
          />
        )}

        {state === "result" && <ResultView onReset={reset} />}
      </main>
    </div>
  );
}

function SetupView(props: {
  mode: InputMode;
  setMode: (m: InputMode) => void;
  subject: string;
  setSubject: (s: string) => void;
  syllabus: string;
  setSyllabus: (s: string) => void;
  weeks: number;
  setWeeks: (n: number) => void;
  hours: number;
  setHours: (n: number) => void;
  days: string[];
  toggleDay: (d: string) => void;
  onNext: () => void;
}) {
  const {
    mode,
    setMode,
    subject,
    setSubject,
    syllabus,
    setSyllabus,
    weeks,
    setWeeks,
    hours,
    setHours,
    days,
    toggleDay,
    onNext,
  } = props;

  const canSubmit =
    days.length > 0 &&
    weeks > 0 &&
    hours > 0 &&
    (mode === "subject" ? subject.trim().length > 0 : syllabus.trim().length > 0);

  return (
    <section>
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" /> AI-powered planning
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Generate Your Study Plan
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Tell us what you're studying and how much time you have. We'll build a clean,
          week-by-week timetable you can actually follow.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          <ToggleBtn
            active={mode === "upload"}
            onClick={() => setMode("upload")}
            icon={<Upload className="h-4 w-4" />}
            label="Upload Syllabus"
          />
          <ToggleBtn
            active={mode === "subject"}
            onClick={() => setMode("subject")}
            icon={<Type className="h-4 w-4" />}
            label="Enter Subject"
          />
        </div>

        <div className="mt-6">
          {mode === "upload" ? (
            <div>
              <Label icon={<Upload className="h-4 w-4" />}>Syllabus (PDF or text)</Label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 hover:border-indigo-400 hover:bg-indigo-50/50">
                <Upload className="mb-2 h-6 w-6 text-slate-400" />
                <span className="font-medium text-slate-700">Click to upload PDF</span>
                <span className="mt-1 text-xs">or paste your syllabus below</span>
                <input type="file" accept=".pdf,.txt" className="hidden" />
              </label>
              <textarea
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Paste syllabus text here..."
                rows={4}
                className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          ) : (
            <div>
              <Label icon={<BookOpen className="h-4 w-4" />}>Subject Name</Label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Organic Chemistry"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label icon={<Calendar className="h-4 w-4" />}>Total Weeks</Label>
            <input
              type="number"
              min={1}
              max={52}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div>
            <Label icon={<Clock className="h-4 w-4" />}>Study Hours / Day</Label>
            <input
              type="number"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label icon={<CalendarDays className="h-4 w-4" />}>Days of the Week</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const active = days.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!canSubmit}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue <Sparkles className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function ReviewView(props: {
  topic: string;
  weeks: number;
  hours: number;
  days: string[];
  onBack: () => void;
  onConfirm: () => void;
}) {
  const { topic, weeks, hours, days, onBack, onConfirm } = props;
  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Review</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Preparing a {weeks}-week plan for {topic}…
        </h2>
        <p className="mt-2 text-slate-600">
          We'll schedule {hours} hour{hours > 1 ? "s" : ""} per day across the days you
          selected. Review the summary below before we generate your timetable.
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Duration" value={`${weeks} weeks`} />
          <Stat label="Daily" value={`${hours} hours`} />
          <Stat label="Days" value={`${days.length}/wk`} />
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {days.map((d) => (
            <span
              key={d}
              className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
            >
              {d}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4" /> Confirm & Generate
          </button>
        </div>
      </div>
    </section>
  );
}

function ResultView({ onReset }: { onReset: () => void }) {
  return (
    <section>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Your Study Timetable
          </h2>
          <p className="mt-1 text-slate-600">
            A clean breakdown of what to study, when, and for how long.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> Start Over
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Day</th>
              <th className="px-6 py-3 font-medium">Topic</th>
              <th className="px-6 py-3 font-medium text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_SCHEDULE.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{row.day}</td>
                <td className="px-6 py-4 text-slate-700">{row.topic}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    <Clock className="h-3 w-3" /> {row.duration}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-white text-indigo-700 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Label({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
      {icon} {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}
