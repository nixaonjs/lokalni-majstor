import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getCity(location) {
  return location?.split(">")?.pop()?.trim() || "";
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("sr-Latn-BA");
}

function getImageSrc(ad) {
  if (!ad?.image_url) return null;
  return ad.image_url.startsWith("http") ? ad.image_url : `${API_URL}${ad.image_url}`;
}

export default function MyAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest"); // newest | oldest

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/ads/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "Greška pri učitavanju oglasa.");
        }

        const data = await res.json();
        setAds(Array.isArray(data) ? data : data.ad || []);
      } catch (e) {
        setErr(e.message || "Greška.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = ads.filter((ad) => {
      if (!query) return true;
      const title = (ad.title || "").toLowerCase();
      const city = getCity(ad.location).toLowerCase();
      return title.includes(query) || city.includes(query);
    });

    list = [...list].sort((a, b) => {
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return list;
  }, [ads, q, sort]);

  const onDelete = async (adId) => {
    if (!window.confirm("Obrisati oglas?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/ads/${adId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Greška pri brisanju oglasa.");
      }

      setAds((prev) => prev.filter((ad) => ad.id !== adId));
    } catch (e) {
      alert(e.message || "Greška pri brisanju.");
    }
  };

  const toggleStatus = async (ad) => {
    const nextStatus = ad.status === 'active' ? 'paused' : 'active';

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/ads/${ad.id}/status`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Greska pri promjeni statusa oglasa.");
    }
      const updated = await res.json();

      setAds((prev) =>
        prev.map((x) => (x.id === ad.id ? { ...x, status: updated.status } : x)),
        );
      } catch (e) {
        alert(e.message || "Greska pri promjeni statusa oglasa.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Moji oglasi
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Ovdje se prikazuju oglasi koje si objavio, {" "}
              <span className="text-slate-400">{ads.length}</span> ukupno.
            </p>
          </div>

          <Link
            to="/create-ad"
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
          >
            + Novi oglas
          </Link>
        </div>

        {/* Controls */}
        <div className="mb-6 grid gap-3 rounded-2xl border border-blue-400 bg-gray-200/70 p-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-slate-600">Pretraga</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pretraži po naslovu ili gradu..."
              className="w-full rounded-xl border border-blue-400 bg-gray-300 px-3 py-2 text-sm text-slate-600 outline-none placeholder:text-slate-600 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-900">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-blue-400 bg-gray-300 px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-400"
            >
              <option value="newest">Najnovije</option>
              <option value="oldest">Najstarije</option>
            </select>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
            Učitavanje oglasa…
          </div>
        )}

        {!loading && err && (
          <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-6 text-red-200">
            {err}
          </div>
        )}

        {!loading && !err && filtered.length === 0 && (
          <div className="rounded-2xl border border-blue-400 bg-gray-200 p-10 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-800/60">
              🗂️
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Nema oglasa</h3>
            <p className="mt-1 text-sm text-slate-400">
              Objavi prvi oglas i pojaviće se ovdje.
            </p>
            <Link
              to="/create-ad"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
            >
              Kreiraj oglas
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !err && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ad) => {
              const city = getCity(ad.location);
              const src = getImageSrc(ad);

              return (
                <div
                  key={ad.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-200/70 transition hover:-translate-y-1 hover:border-blue-400"
                >
                  {/* Image */}
                  <div className="relative h-40 w-full bg-slate-800/40">
                    {src ? (
                      <img
                        src={src}
                        alt={ad.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-slate-700">
                        Nema slike
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-slate-100">
                      ID: #{ad.id}
                    </div>
                  </div>

                  {/* Content */}
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold
                      ${
                        ad.status === "active"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
                          : "border-emerald-500/30 bg-amber-500/15 text-amber-200"
                      }`}
                    >
                      {ad.status === "active" ? "Aktivan" : "Pauziran"}
                  </span>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-slate-700">
                      {ad.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-100">
                    {ad.category && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2.5 py-1 text-[11px]">
                          {ad.category}
                        </span>
                    )}

                      {city && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2.5 py-1 text-[11px]">
                          {city}
                        </span>
                      )}

                      {ad.price != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/60 px-2.5 py-1 text-[11px] text-slate-100">
                          💰 {ad.price} KM
                        </span>
                      )}

                      {ad.created_at && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2.5 py-1 text-[11px]">
                          {formatDate(ad.created_at)}
                        </span>
                      )}
                    </div>

                    {ad.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-700">
                        {ad.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        to={`/ads/${ad.id}`}
                        className="text-sm font-semibold text-slate-700 hover:text-white"
                      >
                        Pogledaj
                      </Link>

                      <div className="flex gap-2">
                        <Link
                          to={`/edit-ad/${ad.id}`}
                          className="rounded-xl border border-sky-500 px-3 py-1.5 text-xs font-semibold text-sky-500 hover:border-white"
                        >
                          Uredi
                        </Link>

                        <button
                          onClick={() => onDelete(ad.id)}
                          className="rounded-xl border border-red-400 px-3 py-1.5 text-xs font-semibold text-red-400 hover:border-white"
                        >
                          Obriši
                        </button>

                        <button
                          onClick={() => toggleStatus(ad)}
                          className="rounded-xl border border-amber-400 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:border-white"
                          >
                            {ad.status === "active" ? "Pauziraj" : "Aktiviraj"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* subtle glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                    <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
