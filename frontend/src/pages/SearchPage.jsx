import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdCard from "../components/AdCard";

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const q = params.get("q") || "";
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = q
      ? `http://localhost:5000/api/ads?q=${encodeURIComponent(q)}`
      : "http://localhost:5000/api/ads";

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.items)) {
          setData(d);
        } else if (Array.isArray(d)) {
          setData({ items: d, total: d.length });
        } else {
          setData({ items: [], total: 0 });
        }
      })
      .catch((err) => {
        console.error("Greška pri fetch-u:", err);
        setData({ items: [], total: 0 });
      })
      .finally(() => setLoading(false));
  }, [q]);

  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <section className="min-h-screen px-4 sm:px-6 py-6 space-y-6">
      <h1 className="text-xl font-bold">
        Rezultati pretrage{" "}
        {q && <span className="font-normal text-slate-500">– “{q}”</span>}
      </h1>

      {loading ? (
        <p className="text-slate-500">Pretražujem...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">
          Nema rezultata za <span className="font-semibold">"{q}"</span>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onClick={() => navigate(`/ads/${ad.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
