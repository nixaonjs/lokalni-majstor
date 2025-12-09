import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAds } from "../services/authService";
import AdCard from "../components/AdCard";
import { Link, useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                const data = await fetchAds({ owner: user?.id });
                const list = Array.isArray(data)
                    ? data
                    : (Array.isArray(data?.items) ? data.items : [])
                if (active) setAds(list);
            }   catch (e) {
                if (active) setErr("Greška pri učitavanju tvojih oglasa.");
            }   finally {
                if (active) setLoading(false);
            }
        }
        if (user?.id) load();
        return () => { active = false; };
    }, [user?.id]);

    return (
        <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Moj profil</h1>
                    <p className="text-sm text-slate-600">
                        Email: <span className="font-medium">{user?.email || "-"}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                        Korisnički ID: <span className="font-mono">{user?.id}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/ads/new")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Novi oglas
                    </button>
                    <Link
                        to="/"
                        className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                        Nazad na početnu
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-4">
                <h2 className="mb-4 text-lg font-semibold">Moji oglasi</h2>

                {loading && <p className="text-slate-500">Učitavam...</p>}
                {err && <p className="text-red-600">{err}</p>}

                {!loading && !err && ads.length === 0 && (
                    <p className="text-slate-500">Nemaš još nijedan oglas.</p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {ads.map((ad) => (
                        <AdCard
                            key={ad.id}
                            ad={ad}
                            onClick={() => navigate(`/ads/${ad.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}