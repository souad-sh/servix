import React, { useState, useEffect, useMemo } from "react";

/** ---------- small UI helpers ---------- */
const Pill = ({ children, tone = "slate" }) => {
  const tones = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
};

const StatusBadge = ({ label }) => {
  const map = {
    OK: "green",
    Active: "green",
    "Due Soon": "yellow",
    Overdue: "red",
    "Needs Repair": "red",
  };
  return <Pill tone={map[label] || "slate"}>{label}</Pill>;
};

const NextServiceBadge = ({ label }) => {
  const map = { OK: "green", "Due Soon": "yellow", Overdue: "red" };
  return <Pill tone={map[label] || "slate"}>{label}</Pill>;
};

/** ---------- base modal ---------- */
const BaseModal = ({ title, children, onClose, width = "w-[32rem]" }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl p-8 ${width} max-w-[95vw]`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        {children}
        <div className="mt-8 flex justify-end">
          <button
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/** ---------- driver info modal ---------- */
const DriverModal = ({ driver, onClose }) => {
  if (!driver) return null;
  return (
    <BaseModal title="Driver Information" onClose={onClose}>
      <div className="space-y-4 text-base">
        <p>
          <span className="font-semibold">Name:</span> {driver.name}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {driver.phone ? (
            <a href={`tel:${driver.phone}`} className="text-blue-600 hover:underline">
              {driver.phone}
            </a>
          ) : (
            "—"
          )}
        </p>
      </div>
    </BaseModal>
  );
};

/** ---------- vehicle info modal ---------- */
const VehicleModal = ({ vehicle, onClose }) => {
  if (!vehicle) return null;
  return (
    <BaseModal title="Vehicle Information" onClose={onClose} width="w-[40rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-500">Vehicle Name</div>
          <div className="font-semibold">{vehicle.vehicleName}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-slate-500">Description</div>
          <div className="font-semibold">{vehicle.description}</div>
        </div>
        <div>
          <div className="text-slate-500">Model Year</div>
          <div className="font-semibold">{vehicle.modelYear}</div>
        </div>
        <div>
          <div className="text-slate-500">Chassis Number</div>
          <div className="font-mono">{vehicle.chassisNumber}</div>
        </div>
        <div>
          <div className="text-slate-500">Plate Number</div>
          <div className="font-semibold">{vehicle.plateNumber}</div>
        </div>
        <div>
          <div className="text-slate-500">Internal Number</div>
          <div className="font-semibold">{vehicle.internalNumber}</div>
        </div>

        <div>
          <div className="text-slate-500">Status</div>
          <div className="mt-1"><StatusBadge label={vehicle.status} /></div>
        </div>
        <div>
          <div className="text-slate-500">Next Service</div>
          <div className="mt-1"><NextServiceBadge label={vehicle.nextService} /></div>
        </div>

        <div className="md:col-span-2 border-t pt-4">
          <div className="text-slate-500">Driver</div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-semibold">{vehicle.driver?.name || "—"}</span>
            {vehicle.driver?.phone ? (
              <a
                href={`tel:${vehicle.driver.phone}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {vehicle.driver.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

/** ---------- mock data ---------- */
const MOCK_ROWS = [
  {
    vehicleName: "Toyota Hilux",
    description: "Light-duty pickup for local deliveries",
    modelYear: 2021,
    chassisNumber: "JT1234HILUX0001",
    plateNumber: "LBN 123456",
    internalNumber: "INT-0007",
    driver: { name: "Ali Hassan", phone: "+961 71 123 456" },
    status: "Active",
    nextService: "Due Soon",
  },
  {
    vehicleName: "Ford F-150",
    description: "Long-distance hauler",
    modelYear: 2020,
    chassisNumber: "1FTMF1E50LKE0002",
    plateNumber: "LBN 654321",
    internalNumber: "INT-0021",
    driver: { name: "Sara M.", phone: "+961 76 987 111" },
    status: "Active",
    nextService: "OK",
  },
  {
    vehicleName: "Chevrolet Silverado",
    description: "Heavy load routes",
    modelYear: 2019,
    chassisNumber: "3GCUKRECXFG0003",
    plateNumber: "LBN 998877",
    internalNumber: "INT-0042",
    driver: { name: "Omar K.", phone: "+961 70 555 222" },
    status: "Needs Repair",
    nextService: "Overdue",
  },
  {
    vehicleName: "Mercedes Sprinter",
    description: "Parts shuttle van",
    modelYear: 2022,
    chassisNumber: "WDB9066571S00004",
    plateNumber: "LBN 112233",
    internalNumber: "INT-0103",
    driver: { name: "Mona S.", phone: "+961 71 444 000" },
    status: "Active",
    nextService: "OK",
  },
  {
    vehicleName: "Mercedes Sprinter",
    description: "Technicians crew van",
    modelYear: 2018,
    chassisNumber: "WDB9066571S00005",
    plateNumber: "LBN 445566",
    internalNumber: "INT-0119",
    driver: { name: "—", phone: "" },
    status: "Needs Repair",
    nextService: "Overdue",
  },
];

/** ---------- main component ---------- */
const Dashboard = () => {
  const [rows, setRows] = useState(MOCK_ROWS);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [nameQuery, setNameQuery] = useState("");
  const [chips, setChips] = useState(new Set());

  const toggleChip = (key) => {
    setChips((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredRows = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return rows.filter((r) => {
      const matchName = q ? r.vehicleName.toLowerCase().includes(q) : true;

      if (chips.size === 0) return matchName;

      const wantsOverdue = chips.has("Overdue");
      const wantsDueSoon = chips.has("Due Soon");
      const wantsNeedsRepair = chips.has("Needs Repair");

      const matchesChip =
        (wantsOverdue && r.nextService === "Overdue") ||
        (wantsDueSoon && r.nextService === "Due Soon") ||
        (wantsNeedsRepair && r.status === "Needs Repair");

      return matchName && matchesChip;
    });
  }, [rows, nameQuery, chips]);

  const onDriverClick = (driver) => {
    if (!driver || driver.name === "—") return;
    setSelectedDriver(driver);
  };

  const onVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const onStatusClick = (row) => {
    alert(`Change status for ${row.vehicleName} (current: ${row.status})`);
  };

  const onNextServiceClick = (row) => {
    alert(`Open maintenance for ${row.vehicleName} (Next service: ${row.nextService})`);
  };

  const onDelete = (row) => {
    const confirmed = window.confirm(`Delete ${row.vehicleName} (${row.internalNumber})?`);
    if (!confirmed) return;
    setRows((prev) => prev.filter((r) => r.internalNumber !== row.internalNumber));
    setSelectedVehicle((v) => (v?.internalNumber === row.internalNumber ? null : v));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Dashboard</h1>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by vehicle name..."
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => toggleChip("Overdue")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              chips.has("Overdue")
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            Overdue
          </button>
          <button
            type="button"
            onClick={() => toggleChip("Due Soon")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              chips.has("Due Soon")
                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            Due Soon
          </button>
          <button
            type="button"
            onClick={() => toggleChip("Needs Repair")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              chips.has("Needs Repair")
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            Needs Repair
          </button>

          {chips.size > 0 && (
            <button
              type="button"
              onClick={() => setChips(new Set())}
              className="ml-1 px-3 py-1 rounded-full text-xs font-semibold border bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-xl border border-slate-200">
          <thead className="bg-slate-50 text-slate-600 text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">Vehicle Name</th>
              <th className="px-6 py-3 text-left">Internal Number</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Model (Year)</th>
              <th className="px-6 py-3 text-left">Chassis Number</th>
              <th className="px-6 py-3 text-left">Plate Number</th>
              <th className="px-6 py-3 text-left">Driver / Operator</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Next Service</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-slate-200">
            {filteredRows.map((row) => (
              <tr key={row.internalNumber} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <button
                    type="button"
                    className="underline decoration-dotted hover:decoration-solid text-blue-700"
                    onClick={() => onVehicleClick(row)}
                  >
                    {row.vehicleName}
                  </button>
                </td>
                <td className="px-6 py-4">{row.internalNumber}</td>
                <td className="px-6 py-4 text-slate-700">{row.description}</td>
                <td className="px-6 py-4">{row.modelYear}</td>
                <td className="px-6 py-4 font-mono">{row.chassisNumber}</td>
                <td className="px-6 py-4">{row.plateNumber}</td>

                <td className="px-6 py-4">
                  {row.driver?.name && row.driver.name !== "—" ? (
                    <button
                      type="button"
                      onClick={() => onDriverClick(row.driver)}
                      className="underline decoration-dotted hover:decoration-solid text-blue-600"
                    >
                      {row.driver.name}
                    </button>
                  ) : (
                    <span className="text-slate-400">No driver</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onStatusClick(row)}
                    className="focus:outline-none"
                  >
                    <StatusBadge label={row.status} />
                  </button>
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onNextServiceClick(row)}
                    className="focus:outline-none"
                  >
                    <NextServiceBadge label={row.nextService} />
                  </button>
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-slate-500">
                  No vehicles match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </div>
  );
};

export default Dashboard;
