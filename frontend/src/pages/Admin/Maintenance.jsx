import React, { useEffect, useMemo, useState } from "react";

/* ---- settings ---- */
const DUE_SOON_DAYS = 7;
const DUE_SOON_KM = 500;

/* ---- localStorage helpers ---- */
const TASKS_KEY = "maintenance_tasks";
const HISTORY_KEY = "maintenance_history";

const loadLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));

/* ---- tiny UI bits ---- */
const Pill = ({ tone = "slate", children }) => {
  const tones = {
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
};

export default function Maintenance() {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);

  /* Seed demo tasks on first run, and load history */
  useEffect(() => {
    let storedTasks = loadLS(TASKS_KEY, null);
    if (!storedTasks || !Array.isArray(storedTasks)) {
      // seed demo tasks if nothing in storage
      storedTasks = [
        {
          id: "t1",
          vehicle: "Fleet Van 01",
          task: "Oil Change",
          dueDate: "2025-08-10",    // overdue relative to today
          dueOdometer: 15000,
          currentOdometer: 15550,
        },
        {
          id: "t2",
          vehicle: "Truck A",
          task: "Brake Inspection",
          dueDate: "2025-08-22",    // due soon
          dueOdometer: 32000,
          currentOdometer: 31800,
        },
        {
          id: "t3",
          vehicle: "Car B",
          task: "Coolant Check",
          dueDate: "2025-09-30",    // OK (won’t show)
          dueOdometer: 80000,
          currentOdometer: 76000,
        },
      ];
      saveLS(TASKS_KEY, storedTasks);
    }
    setTasks(storedTasks);

    const storedHistory = loadLS(HISTORY_KEY, []);
    setHistory(storedHistory);
  }, []);

  /* status helpers */
  const statusOf = (t) => {
    const today = new Date();
    const due = new Date(t.dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const kmLeft = t.dueOdometer - t.currentOdometer;

    if (daysLeft < 0 || kmLeft < 0) return "Overdue";
    if (daysLeft <= DUE_SOON_DAYS || kmLeft <= DUE_SOON_KM) return "Due Soon";
    return "OK";
  };

  const visibleTasks = useMemo(
    () => tasks.filter((t) => ["Overdue", "Due Soon"].includes(statusOf(t))),
    [tasks]
  );

  /* mark as done: move to history + persist */
  const markDone = (task) => {
    const remaining = tasks.filter((t) => t.id !== task.id);
    const entry = {
      ...task,
      completedAt: new Date().toISOString(),
    };
    const newHistory = [entry, ...history];

    setTasks(remaining);
    setHistory(newHistory);
    saveLS(TASKS_KEY, remaining);
    saveLS(HISTORY_KEY, newHistory);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Maintenance Tasks</h1>
      <p className="text-sm text-slate-600 mb-6">
        Shows only tasks that are <strong>Overdue</strong> or <strong>Due Soon</strong>.
      </p>

      {/* Tasks table */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Task</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Odometer</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleTasks.map((t) => {
              const s = statusOf(t);
              return (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.vehicle}</td>
                  <td className="p-3">{t.task}</td>
                  <td className="p-3">{t.dueDate}</td>
                  <td className="p-3">
                    {t.currentOdometer} / {t.dueOdometer} km
                  </td>
                  <td className="p-3">
                    {s === "Overdue" && <Pill tone="red">Overdue</Pill>}
                    {s === "Due Soon" && <Pill tone="yellow">Due Soon</Pill>}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => markDone(t)}
                      className="px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                      ✔ Check
                    </button>
                  </td>
                </tr>
              );
            })}
            {visibleTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  ✅ No overdue or due soon tasks.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* History list */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Completed History</h2>
          {/* Quick reset for testing */}
          <button
            onClick={() => {
              saveLS(HISTORY_KEY, []);
              setHistory([]);
            }}
            className="text-xs px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
          >
            Clear History
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No completed maintenance yet.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            {history.map((h) => (
              <li key={h.completedAt + h.id} className="p-3 bg-slate-50 rounded-md border">
                ✔ <strong>{h.task}</strong> for <strong>{h.vehicle}</strong> completed on{" "}
                {new Date(h.completedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
