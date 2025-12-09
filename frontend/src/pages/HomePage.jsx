import { useEffect, useState } from "react";
import { fetchAds, fetchCategories } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AdCard from "../components/AdCard";

export default function HomePage() {
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([fetchAds(), fetchCategories()])
      .then(([adsRes, catRes]) => {
        setAds(adsRes.status === "fulfilled" ? adsRes.value : []);
        setCategories(catRes.status === "fulfilled" && Array.isArray(catRes.value) ? catRes.value : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAds = selectedCat ? ads.filter((ad) => ad.category === selectedCat) : ads;

  const countAdsInSubcategory = (subcategory) =>
    ads.filter((ad) => ad.category === subcategory).length;

  if (loading) return <p className="text-center mt-10">Učitavam oglase…</p>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER / ACTIONS */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Kategorije</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/ads/new")}
            className="rounded-lg font-semibold bg-sky-500 px-4 py-2 text-white hover:bg-sky-500"
          >
            Novi oglas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 px-4 sm:px-6 pb-10">
        {/* SIDEBAR */}
        <aside className="h-fit col-span-12 md:col-span-3 bg-white border rounded-lg shadow p-4">
          <ul className="space-y-2">
            <li key="all">
              <button
                onClick={() => {
                  setSelectedCat(null);
                  setExpandedCategory(null);
                }}
                className={`w-full text-left rounded-lg px-3 py-2 font-bold text-sm tracking-wide transition ${
                  selectedCat === null
                    ? "bg-sky-500 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Svi oglasi
              </button>
            </li>

            {Array.isArray(categories) &&
              categories.map((category) => (
                <li key={category.name}>
                  <p
                    className="text-slate-900 uppercase text-xs font-bold pl-2 pt-2 pb-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.name ? null : category.name
                      )
                    }
                  >
                    {category.name}
                    <span className="ml-1 text-slate-500">
                      {expandedCategory === category.name ? "-" : "+"}
                    </span>
                  </p>

                  {expandedCategory === category.name && (
                    <ul className="pl-4">
                      {category.subcategories?.map((sub) => (
                        <li key={sub}>
                          <button
                            className={`w-full gap-2 text-left text-sm rounded px-3 py-1 transition hover:scale-[101%] ${
                              selectedCat === sub
                                ? "bg-sky-500 text-white"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                            onClick={() => setSelectedCat(sub)}
                          >
                            {sub}
                            <span className="ml-2 bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                              {countAdsInSubcategory(sub)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
          </ul>
        </aside>

        {/* LISTA OGLASA */}
        <main className="col-span-12 md:col-span-9">
          {filteredAds.length === 0 ? (
            <p className="text-center text-slate-500 mt-10">
              Nema oglasa u ovoj kategoriji.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map((a) => (
                <AdCard
                  key={a.id}
                  ad={a}
                  onClick={() => navigate(`/ads/${a.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
