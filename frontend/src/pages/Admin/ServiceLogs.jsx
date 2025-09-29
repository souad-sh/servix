import React, { useState } from 'react';

const ServiceLog = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    vehicleVin: '',
    description: '',
    partsUsed: '',
    cost: '',
    date: '',
  });

  const handleSubmit = () => {
    setLogs([...logs, form]);
    setForm({
      vehicleVin: '',
      description: '',
      partsUsed: '',
      cost: '',
      date: '',
    });
    alert('Service logged!');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Log Maintenance Service</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Vehicle VIN"
          value={form.vehicleVin}
          onChange={(e) => setForm({ ...form, vehicleVin: e.target.value })}
          className="col-span-2 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Service Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="col-span-2 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Parts Used (e.g. Brake Pads x2)"
          value={form.partsUsed}
          onChange={(e) => setForm({ ...form, partsUsed: e.target.value })}
          className="col-span-2 px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Total Cost ($)"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 border rounded"
        />
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Log
        </button>
      </div>

      {logs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Logged Services</h3>
          <ul className="space-y-2">
            {logs.map((log, i) => (
              <li key={i} className="bg-gray-50 border p-3 rounded">
                <p className="text-sm">
                  <strong>VIN:</strong> {log.vehicleVin}
                </p>
                <p className="text-sm">
                  <strong>Description:</strong> {log.description}
                </p>
                <p className="text-sm">
                  <strong>Parts:</strong> {log.partsUsed}
                </p>
                <p className="text-sm">
                  <strong>Cost:</strong> ${log.cost}
                </p>
                <p className="text-sm">
                  <strong>Date:</strong> {log.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceLog;