export default function AdCard({ ad, onClick }) {
  const fullPath = ad.location || "";
  const city =
    fullPath.split(">").map(s => s.trim()).filter(Boolean).pop() || null;

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-200/70 transition hover:-translate-y-1 hover:border-blue-400"
    >
      {/* SLIKA + BADGE */}
      <div className="relative aspect-[4/3] w-full object-cover overflow-hidden mb-3 bg-gray-100">
        <img
          src={
            ad.image_url
              ? Array.isArray(ad.image_url)
                ? `http://localhost:5000${ad.image_url[0]}`
                : `http://localhost:5000${ad.image_url}`
              : "/logo-placeholder.png"
          }
          alt={ad.title}
          className="h-full w-full object-cover"
          loading={"lazy"}
        />
        <span
          title={fullPath}
          className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-insert ring-blue-200 shadow-sm"
          aria-label={`Lokacija: ${city}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2C6.686 2 4 4.686 4 8c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              clipRule="evenodd"
            />
          </svg>
          {city}
        </span>
      </div>

      {/* NASLOV + KATEGORIJA */}
      <div className="px-3 pt-1 flex items-start justify-between gap-3">
        <h3 className="min-w-0 line-clamp-2 text-base font-semibold text-slate-700">{ad.title}</h3>
        <span className="text-xs rounded-full bg-sky-500 px-3 py-1 text-slate-100 whitespace-nowrap">
          {ad.category || "bez kategorije"}
        </span>
      </div>

      {/* OPIS */}
      <p className="px-3 pb-4 mt-2 text-sm text-slate-600 line-clamp-2">{ad.description}</p>

      {/* CIJENA (opcionalno) */}
      {ad.price != null && (
        <div className="mt-3 text-right text-xs font-semibold text-slate-700">
          {ad.price} KM
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

    </div>

  );
}
