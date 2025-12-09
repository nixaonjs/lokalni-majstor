import { useState, useEffect, useMemo } from "react";
import { createAd, fetchCategories } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { ENTITETI, LOKACIJE } from "../data/locations";

export default function NewAdPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [, setError] = useState("");

    const [entitet, setEntitet] = useState("");
    const [podrucje, setPodrucje] = useState("");
    const [grad, setGrad] = useState ("");

    const [category, setCategory] = useState("");
    const [cats, setCats] = useState([]);
    const [loadingcats, setLoadingCats] = useState(true);
    const [subcategory, setSubcategory] = useState("");
    const selectedCategory = cats.find((c) => c.name === category);
    const subcategories = selectedCategory ? selectedCategory.subcategories : [];
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalMsg, setGlobalMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        setLoadingCats(true);

        fetchCategories()
            .then((res) => {
                const list = Array.isArray(res) ? res : res?.categories ?? [];
                if (active) setCats(list)
            })
            .catch(() => { if (active) setCats([]); })
            .finally(() => { if (active) setLoadingCats(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        setPodrucje("");
    },      [entitet]);

    useEffect(() => {
        setGrad("");
    },      [podrucje]);


    const podrucjaOpcije = useMemo(() => {
        if (!entitet) return [];
        return Object.keys(LOKACIJE[entitet] || {});        
    }, [entitet]);

    const gradoviOpcije = useMemo(() => {
        if (!entitet || !podrucje) return [];
        return LOKACIJE[entitet]?.[podrucje] || [];
    }, [entitet, podrucje]);

    function validate() {
        const e = {};
        if (!title.trim()) e.title = "Naslov je obavezan.";
        else if (title.trim().length < 3) e.title = "Naslov mora imati bar 3 znaka";

        if (!description.trim()) e.description = "Opis je obavezan.";
        else if (description.trim().length < 10) e.description = "Opis mora sadrzati minimalno 10 znakova.";

        if (!entitet) e.entitet = "Izaberi entitet.";
        if (!podrucje) e.podrucje = "Izaberi kanton ili regiju.";
        if (!grad) e.grad = "Izaberi grad.";

        return e;
    }

    function onPickImage(e) {
      const f = e.target.files?.[0];
      setImageFile(f || null);
      setPreview(f ? URL.createObjectURL(f) : '');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('SUBMIT >>>>', { title, description, entitet, podrucje, grad, category, imageFile });
        setError("");
        setGlobalMsg("");
        setErrors({});

        const v = validate();
        console.log("[NEW-AD] validate ->", v);
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }

        const locationPath = `${entitet} > ${podrucje} > ${grad}`;
        const payload = { title, description, category: subcategory, location: locationPath, imageFile};

        try {
            setSubmitting(true);
            const res = await createAd(payload);
            console.log("[NEW-AD] created ->", res);
            setGlobalMsg("Oglas je sacuvan.");
            setTimeout(() => navigate("/"), 600);
        }   catch (err) {
            console.error(
              "[NEW-AD] create error",
              err?.response?.status || err?.code || "no-status",
              err?.response?.data?.message || err?.message || "no-message"
            );
            const msg = err?.response?.data?.message || "Greska pri kreiranju oglasa.";
            setError(msg);
        }   finally {
            setSubmitting(false);
        }
    };

     return (
     <div className="min-h-screen max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Novi oglas</h1>
        <Link to="/" className="text-sm px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Nazad
        </Link>
      </div>

      {globalMsg && (
        <div className="mb-4 rounded border p-3 text-sm bg-gray-50">{globalMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Naslov */}
        <div>
          <label className="block text-sm font-medium mb-1">Naslov *</label>
          <input
            type="text"
            className={`w-full rounded border p-2 outline-none focus:ring-2 ${
              errors.title ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="npr. Moleraj, Keramičar, Stolar"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Opis */}
        <div>
          <label className="block text-sm font-medium mb-1">Opis *</label>
          <textarea
            rows={5}
            className={`w-full rounded border p-2 outline-none focus:ring-2 ${
              errors.description ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Napiši što detaljniji opis..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Kategorija */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Kategorija</label>
          <select
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
          >
            <option value="">— Bez kategorije —</option>
            {cats.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {loadingcats && <p className="mt-1 text-xs text-gray-500">Učitavam kategorije…</p>}
        </div>

        {subcategories.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Podkategorija</label>
            <select 
              className="w-full border p-2 rounded"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option value="">— Odaberi podkategoriju —</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {/* Entitet */}
          <div>
            <label className="block text-sm font-medium mb-1">Entitet *</label>
            <select
              className={`w-full rounded border p-2 outline-none focus:ring-2 ${
                errors.entitet ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"
              }`}
              value={entitet}
              onChange={(e) => setEntitet(e.target.value)}
            >
              <option value="">— Odaberi —</option>
              {ENTITETI.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            {errors.entitet && <p className="mt-1 text-xs text-red-600">{errors.entitet}</p>}
          </div>

          {/* Kanton/Regija */}
          <div>
            <label className="block text-sm font-medium mb-1">Kanton / Regija *</label>
            <select
              className={`w-full rounded border p-2 outline-none focus:ring-2 ${
                errors.podrucje ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"
              }`}
              value={podrucje}
              onChange={(e) => setPodrucje(e.target.value)}
              disabled={!entitet}
            >
              <option value="">— Odaberi —</option>
              {podrucjaOpcije.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.podrucje && <p className="mt-1 text-xs text-red-600">{errors.podrucje}</p>}
          </div>

          {/* Grad */}
          <div>
            <label className="block text-sm font-medium mb-1">Grad *</label>
            <select
              className={`w-full rounded border p-2 outline-none focus:ring-2 ${
                errors.grad ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"
              }`}
              value={grad}
              onChange={(e) => setGrad(e.target.value)}
              disabled={!podrucje}
            >
              <option value="">— Odaberi —</option>
              {gradoviOpcije.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.grad && <p className="mt-1 text-xs text-red-600">{errors.grad}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slike (opcionalno)</label>
          <input type="file" accept="image/*" onChange={onPickImage} />
          {preview && (
            <div className="mt-2 w-full max-w-sm">
              <img src={preview} alt="Preview" className="rounded-lg border aspect-video object-cover" />
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Spašavam…" : "Sačuvaj oglas"}
          </button>
        </div>
      </form>
    </div>
  );
}