import React, { useEffect, useMemo, useState } from "react";
import { FaRegClipboard, FaTools, FaListAlt } from "react-icons/fa";

const steps = [
  { key: "Details", label: "Details", icon: <FaRegClipboard /> },
  { key: "SpecCap", label: "Specification & Capacity", icon: <FaListAlt /> },
  { key: "Maint", label: "Maintenance Types", icon: <FaTools /> },
];

const initial = {
  // Details
  group: "",
  vehicle_name: "",
  number_id: "",
  serial_number: "",
  plate_number: "",
  type: "",
  make: "",
  model_year: "",
  fuel_type: "",
  driver_name: "",
  driver_contact_number: "",
  // Spec & Capacity
  fluids: "",
  liters: "",
  viscosity: "",
  filter_type: "",
  filter_code: "",
  // Maintenance
  maintenance_engine: "",
  maintenance_interval: "",
  current_odometer: "",
  last_service_date: "",
  status: "Active", // Active | Needs Repair
  // If Needs Repair
  status_note: "",
  repaired_part_name: "",
  repaired_vendor: "",
  repaired_price: "",
  repaired_description: "",
};

const groupsOptions = [
  { value: "", label: "Select a group" },
  { value: "1", label: "Group 1" },
  { value: "2", label: "Group 2" },
  { value: "3", label: "Group 3" },
];

const vehicleTypes = ["Car", "Truck", "Van", "Excavator", "Bus", "Pickup"];
const fuelTypes = ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"];

const Vehicles = () => {
  const [active, setActive] = useState("Details");
  const [form, setForm] = useState(initial);

  // Auto-clear repair fields when switching back to Active
  useEffect(() => {
    if (form.status === "Active") {
      setForm((p) => ({
        ...p,
        status_note: "",
        repaired_part_name: "",
        repaired_vendor: "",
        repaired_price: "",
        repaired_description: "",
      }));
    }
  }, [form.status]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // TODO: replace with API call
    console.table(form);
    alert("Vehicle added (see console payload).");
  };

  // UI atoms
  const Field = ({ label, name, children, className = "", required, ...rest }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={name} className="text-[13px] font-medium text-slate-900">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      {children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          value={form[name]}
          onChange={onChange}
          className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          {...rest}
        />
      )}
    </div>
  );

  const Select = (props) => (
    <select
      {...props}
      className={`w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none
                 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${props.className || ""}`}
    />
  );

  const Card = ({ title, children }) => (
    <section className="rounded-2xl bg-white border border-blue-100 shadow-[0_8px_24px_rgba(30,64,175,0.06)]">
      <header className="px-5 py-4 border-b border-blue-100">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );

  // Sections
  const Details = (
    <Card title="Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Group" name="group" required>
          <Select id="group" name="group" value={form.group} onChange={onChange}>
            {groupsOptions.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Vehicle Name" name="vehicle_name" required placeholder="e.g. Fleet Van 01" />
        <Field label="Number (ID)" name="number_id" required placeholder="e.g. 1023" />
        <Field label="Serial Number" name="serial_number" placeholder="e.g. SN-ABC-00123" />
        <Field label="Plate Number" name="plate_number" placeholder="e.g. ABC-123" />

        <Field label="Type" name="type" required>
          <Select id="type" name="type" value={form.type} onChange={onChange}>
            <option value="">Select type</option>
            {vehicleTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>

        <Field label="Make" name="make" placeholder="e.g. Toyota" />
        <Field label="Model (Year)" name="model_year" type="number" placeholder="e.g. 2024" />
        <Field label="Fuel Type" name="fuel_type">
          <Select id="fuel_type" name="fuel_type" value={form.fuel_type} onChange={onChange}>
            <option value="">Select fuel type</option>
            {fuelTypes.map((ft) => (
              <option key={ft} value={ft}>{ft}</option>
            ))}
          </Select>
        </Field>

        <Field label="Driver’s Name" name="driver_name" placeholder="e.g. Ahmad Sleiman" />
        <Field label="Contact Number (Driver)" name="driver_contact_number" type="tel" placeholder="e.g. +961 70 123 456" />
      </div>
    </Card>
  );

  const SpecCap = (
    <Card title="Specification & Capacity">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Fluids" name="fluids" placeholder="e.g. Engine oil, Coolant" />
        <Field label="Liters" name="liters" type="number" placeholder="e.g. 5" />
        <Field label="Viscosity" name="viscosity" placeholder="e.g. 5W-30" />
        <Field label="Filter Type" name="filter_type" placeholder="e.g. Oil filter" />
        <Field label="Filter Code" name="filter_code" placeholder="e.g. OF-1234" />
      </div>
    </Card>
  );

  const Maintenance = (
    <Card title="Maintenance Types">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Maintenance Engine" name="maintenance_engine" placeholder="e.g. Oil change, belt check" />
        <Field label="Maintenance Interval" name="maintenance_interval" placeholder="e.g. 10,000 km or 6 months" />
        <Field label="Current Odometer (km)" name="current_odometer" type="number" placeholder="e.g. 120500" />
        <Field label="Last Service Date" name="last_service_date" type="date" />
        <Field label="Status" name="status" required>
          <Select id="status" name="status" value={form.status} onChange={onChange}>
            <option value="Active">Active</option>
            <option value="Needs Repair">Needs Repair</option>
          </Select>
        </Field>

        {form.status === "Needs Repair" && (
          <>
            <Field label="Issue / Status Note" name="status_note" required placeholder="Describe the problem" />
            <Field label="Part Name" name="repaired_part_name" placeholder="e.g. Oil filter" />
            <Field label="Vendor" name="repaired_vendor" placeholder="e.g. ACME Parts" />
            <Field label="Estimated Price" name="repaired_price" type="number" step="0.01" placeholder="e.g. 150.00" />
            <Field label="Description" name="repaired_description" className="md:col-span-2">
              <textarea
                id="repaired_description"
                name="repaired_description"
                rows={4}
                value={form.repaired_description}
                onChange={onChange}
                className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none"
                placeholder="Extra notes about the issue / parts / labor"
              />
            </Field>
          </>
        )}
      </div>
    </Card>
  );

  const content = useMemo(() => {
    if (active === "Details") return Details;
    if (active === "SpecCap") return SpecCap;
    if (active === "Maint") return Maintenance;
    return null;
  }, [active, form]);

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-white font-[Inter,ui-sans-serif,system-ui]">
      {/* Inner sidebar */}
      <aside className="w-80 p-6 pr-4">
        <div className="rounded-2xl bg-blue-50 border border-blue-100 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">New Vehicle</h2>
            <p className="text-xs text-slate-700">Create and classify a vehicle</p>
          </div>
          <nav className="space-y-3">
            {steps.map((s) => {
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={`group w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition
                    ${isActive ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-900 border border-blue-100 hover:bg-blue-100"}`}
                >
                  <span className={`grid place-items-center h-8 w-8 rounded-lg border
                    ${isActive ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-blue-200 text-blue-700"}`}>
                    {s.icon}
                  </span>
                  <span className={`text-sm font-medium whitespace-nowrap ${isActive ? "text-white" : "text-slate-900"}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main (no top navbar; only the form) */}
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-5xl mb-4">
          <h1 className="text-2xl font-semibold text-slate-900">Vehicle Form</h1>
          {/* Removed the <p> "Fill in the details below" */}
        </div>

        <form
          id="vehicle-form"
          onSubmit={onSubmit}
          className="mx-auto max-w-5xl"
        >
          {content}

          {/* Button aligned bottom-right */}
          <div className="flex justify-end mt-4"> {/* <-- small space above button */}
            <button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 shadow-sm"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </main>

    </div>
  );
};

export default Vehicles;