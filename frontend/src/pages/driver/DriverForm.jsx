// src/pages/driver/DriverForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import useOnlineStatus from "./useOnlineStatus";
import { submitMaintenance } from "./driverApi";

/* ---------------- i18n ---------------- */
const TRANSLATIONS = {
  ar: {
    appTitle: "صيانة السائق",
    subtitle: "يرجى تعبئة بيانات ما قبل الانطلاق وفحص النقاط السريعة.",
    group: "المجموعة",
    chooseGroup: "اختر المجموعة",
    trucks: "الشاحنات",
    vans: "الفانات",
    excavators: "الحفّارات",
    vehicle: "المركبة",
    chooseVehicle: "اختر المركبة",
    odometer: "قراءة العداد (كم)",
    odoPH: "مثال: 128540",
    engineHours: "ساعات عمل المحرّك",
    engineHoursPH: "اختياري",
    checklist: "قائمة التحقق",
    checkFluids: "فحص السوائل",
    checkBrakes: "فحص الفرامل",
    checkBattery: "اختبار البطارية",
    notes: "ملاحظات",
    notesPH: "اكتب أي ملاحظات أو أعطال…",
    addPhotos: "أضف صوراً (مثلاً صورة العطل)",
    photosHint:
      "يمكنك إضافة حتى 5 صور. يدعم الالتقاط المباشر من الكاميرا على الهاتف.",
    status: "الحالة",
    online: "متصل",
    offline: "غير متصل (سيتم المزامنة لاحقاً)",
    submit: "إرسال",
    sending: "جارٍ الإرسال…",
    sentOK: "تم الإرسال بنجاح ✅",
    sentFail: "فشل الحفظ ❌",
    delete: "حذف",
    tooltip: "التبديل بين العربية والإنجليزية",
    required: "رجاءً عبّي الحقول المطلوبة",
    invalidNumbers: "أرقام غير صحيحة",
  },
  en: {
    appTitle: "Driver Maintenance",
    subtitle: "Please fill pre-drive details and quick checks.",
    group: "Group",
    chooseGroup: "Select Group",
    trucks: "Trucks",
    vans: "Vans",
    excavators: "Excavators",
    vehicle: "Vehicle",
    chooseVehicle: "Select Vehicle",
    odometer: "Odometer (km)",
    odoPH: "e.g., 128540",
    engineHours: "Engine Hours",
    engineHoursPH: "Optional",
    checklist: "Checklist",
    checkFluids: "Check fluids",
    checkBrakes: "Inspect brakes",
    checkBattery: "Test battery",
    notes: "Notes",
    notesPH: "Write any remarks or observed issues…",
    addPhotos: "Add photos (e.g., the issue)",
    photosHint:
      "You can add up to 5 photos. Mobile camera capture supported.",
    status: "Status",
    online: "Online",
    offline: "Offline (will sync later)",
    submit: "Submit",
    sending: "Sending…",
    sentOK: "Submitted successfully ✅",
    sentFail: "Failed to save ❌",
    delete: "Delete",
    tooltip: "Toggle between Arabic and English",
    required: "Please fill required fields",
    invalidNumbers: "Invalid numbers",
  },
};

/* ------------- simple toast ------------- */
function Toast({ kind = "success", children, onClose }) {
  const tone =
    kind === "success"
      ? "bg-green-600"
      : kind === "error"
      ? "bg-red-600"
      : "bg-amber-600";
  return (
    <div className={`${tone} text-white rounded-md px-4 py-2 shadow-lg`}>
      <div className="flex items-center gap-3">
        <span className="font-semibold">{children}</span>
        <button
          type="button"
          onClick={onClose}
          className="ms-auto inline-flex rounded-md bg-white/20 px-2 py-0.5 hover:bg-white/30"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ----------- image resize helper ---------- */
/** Downscale images before Base64 to reduce payload size */
async function resizeImage(file, { maxW = 1280, maxH = 1280, quality = 0.8 } = {}) {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  const ratio = Math.min(maxW / width, maxH / height, 1);
  const targetW = Math.round(width * ratio);
  const targetH = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  const blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b), "image/jpeg", quality)
  );
  return blob;
}

const ALL_VEHICLES = {
  Trucks: [
    { value: "Truck 123", ar: "شاحنة 123", en: "Truck 123" },
    { value: "Truck 456", ar: "شاحنة 456", en: "Truck 456" },
  ],
  Vans: [
    { value: "Van A", ar: "فان A", en: "Van A" },
    { value: "Van B", ar: "فان B", en: "Van B" },
  ],
  Excavators: [
    { value: "Exc 01", ar: "حفّارة 01", en: "Exc 01" },
    { value: "Exc 02", ar: "حفّارة 02", en: "Exc 02" },
  ],
};

export default function DriverForm() {
  const isOnline = useOnlineStatus();

  /* ---------- language & dir ---------- */
  const [lang, setLang] = useState(() => localStorage.getItem("servix_lang") || "ar");
  useEffect(() => {
    localStorage.setItem("servix_lang", lang);
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = useMemo(() => TRANSLATIONS[lang], [lang]);
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  /* ------------- form state ------------- */
  const [form, setForm] = useState({
    group: localStorage.getItem("last_group") || "",
    vehicle: localStorage.getItem("last_vehicle") || "",
    odometer: "",
    engineHours: "",
    checklist: { fluids: false, brakes: false, battery: false },
    notes: "",
    images: [],
  });
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // {kind, msg}

  /* ------- derived vehicle options ------- */
  const groupOptions = useMemo(
    () => [
      { value: "", label: t.chooseGroup },
      { value: "Trucks", label: t.trucks },
      { value: "Vans", label: t.vans },
      { value: "Excavators", label: t.excavators },
    ],
    [t]
  );

  const vehicleOptions = useMemo(() => {
    const base = [{ value: "", label: t.chooseVehicle }];
    const selected = ALL_VEHICLES[form.group] || [];
    return base.concat(
      selected.map((v) => ({
        value: v.value,
        label: isArabic ? v.ar : v.en,
      }))
    );
  }, [form.group, isArabic, t]);

  /* --------------- handlers --------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "group") {
      // reset vehicle if group changed
      setForm((f) => ({ ...f, group: value, vehicle: "" }));
      localStorage.setItem("last_group", value);
      localStorage.removeItem("last_vehicle");
    }
    if (name === "vehicle") {
      localStorage.setItem("last_vehicle", value);
    }
  };

  const handleChecklist = (e) => {
    const { name, checked } = e.target;
    setForm((f) => ({
      ...f,
      checklist: { ...f.checklist, [name]: checked },
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const nextFiles = [...form.images, ...files].slice(0, 5);
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));
    setForm((f) => ({ ...f, images: nextFiles }));
    setPreviews(nextPreviews);
  };

  const removeImage = (idx) => {
    const nextFiles = form.images.filter((_, i) => i !== idx);
    const nextPreviews = previews.filter((_, i) => i !== idx);
    setForm((f) => ({ ...f, images: nextFiles }));
    setPreviews(nextPreviews);
  };

  const numberOk = (v) =>
    v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0 && Number.isFinite(Number(v)));

  const validate = () => {
    if (!form.group || !form.vehicle || !form.odometer) {
      setToast({ kind: "error", msg: t.required });
      return false;
    }
    if (!numberOk(form.odometer) || !numberOk(form.engineHours)) {
      setToast({ kind: "error", msg: t.invalidNumbers });
      return false;
    }
    return true;
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setToast(null);
    try {
      // downscale images first, then to Base64
      const resizedBlobs = await Promise.all(
        (form.images || []).map((f) => resizeImage(f).catch(() => f))
      );
      const imagesBase64 = await Promise.all(resizedBlobs.map((b) => fileToBase64(b)));

      const payload = {
        ...form,
        images: imagesBase64,
        lang,
      };

      await submitMaintenance(payload, isOnline);
      setToast({ kind: "success", msg: t.sentOK });

      // reset but keep last group/vehicle in localStorage
      setForm((f) => ({
        group: localStorage.getItem("last_group") || f.group || "",
        vehicle: localStorage.getItem("last_vehicle") || f.vehicle || "",
        odometer: "",
        engineHours: "",
        checklist: { fluids: false, brakes: false, battery: false },
        notes: "",
        images: [],
      }));
      setPreviews([]);
    } catch (err) {
      console.error(err);
      setToast({ kind: "error", msg: `${t.sentFail}` });
    } finally {
      setLoading(false);
    }
  };

  /* ----------------- UI ------------------ */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8" dir={dir}>
        {/* header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800">
              {t.appTitle}
            </h2>
            <p className="text-lg text-slate-600 font-medium mt-1">
              {t.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLang(isArabic ? "en" : "ar")}
            className="rounded-full p-2 hover:bg-slate-100 transition text-2xl leading-none"
            title={t.tooltip}
            aria-label={t.tooltip}
          >
            🌐
          </button>
        </div>

        {/* toasts */}
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
          {toast && (
            <Toast kind={toast.kind} onClose={() => setToast(null)}>
              {toast.msg}
            </Toast>
          )}
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="p-6 space-y-6 text-lg font-semibold text-slate-800">
            {/* Group & Vehicle */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1">{t.group}</label>
                <select
                  name="group"
                  value={form.group}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-lg font-medium shadow-sm outline-none transition focus:ring-4 focus:ring-blue-200"
                  required
                >
                  {groupOptions.map((opt) => (
                    <option key={opt.value + opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">{t.vehicle}</label>
                <select
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-lg font-medium shadow-sm outline-none transition focus:ring-4 focus:ring-blue-200"
                  required
                >
                  {vehicleOptions.map((opt) => (
                    <option key={opt.value + opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Odometer & Engine Hours */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1">{t.odometer}</label>
                <input
                  type="number"
                  name="odometer"
                  value={form.odometer}
                  onChange={handleChange}
                  placeholder={t.odoPH}
                  inputMode="numeric"
                  min={0}
                  required
                  className="w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-lg font-medium shadow-sm outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block mb-1">{t.engineHours}</label>
                <input
                  type="number"
                  name="engineHours"
                  value={form.engineHours}
                  onChange={handleChange}
                  placeholder={t.engineHoursPH}
                  inputMode="numeric"
                  min={0}
                  className="w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-lg font-medium shadow-sm outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Checklist */}
            <div>
              <label className="block mb-2">{t.checklist}</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-base">
                <label className="flex items-center gap-2 rounded-lg border border-slate-400 bg-white px-3 py-3 shadow-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="fluids"
                    checked={form.checklist.fluids}
                    onChange={handleChecklist}
                    className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t.checkFluids}</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-400 bg-white px-3 py-3 shadow-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="brakes"
                    checked={form.checklist.brakes}
                    onChange={handleChecklist}
                    className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t.checkBrakes}</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-400 bg-white px-3 py-3 shadow-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="battery"
                    checked={form.checklist.battery}
                    onChange={handleChecklist}
                    className="h-5 w-5 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t.checkBattery}</span>
                </label>
              </div>
            </div>

            {/* Notes + Photos */}
            <div className="space-y-3">
              <div>
                <label className="block mb-1">{t.notes}</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t.notesPH}
                  className="w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-lg font-medium shadow-sm outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block mb-1">{t.addPhotos}</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleImages}
                  className="block w-full rounded-lg border border-slate-400 bg-white px-3 py-3 text-lg font-medium shadow-sm outline-none transition file:me-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-base hover:file:bg-slate-200 focus:ring-4 focus:ring-blue-200"
                />
                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg border border-slate-300"
                      >
                        <img
                          src={src}
                          alt={`${isArabic ? "صورة" : "Photo"} ${idx + 1}`}
                          className="h-28 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 left-1 rounded-md bg-white/90 px-2 py-0.5 text-sm font-bold text-red-600 shadow"
                        >
                          {t.delete}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-500">{t.photosHint}</p>
              </div>
            </div>

            {/* Status */}
            <p className="text-base font-bold">
              {t.status}:{" "}
              <span className={isOnline ? "text-green-600" : "text-amber-600"}>
                {isOnline ? t.online : t.offline}
              </span>
            </p>
          </div>

          {/* Submit */}
          <div className="rounded-b-2xl border-t border-slate-200 bg-slate-100 p-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg px-6 py-3 text-lg font-bold text-white shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200 transition ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? t.sending : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
