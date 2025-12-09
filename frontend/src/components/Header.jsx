import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [q, setQ] = useState("");

  function handleLogout() {
      logout();
      setMenuOpen(false);
      navigate("/login");
  }

  function onSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/pretraga?q=${encodeURIComponent(term)}` : "/pretraga");
  }


  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4 relative">
        {/* Logo */}
        <Link to="/" className="shrink-0" aria-label="Lokalni Majstor – Početna">
          <img
            src="/logo-header.png" 
            alt="Lokalni Majstor"
            className="h-20 w-20 rounded-md"
            loading="eager"
          />
        </Link>

        {/* Search */}
        <form
          onSubmit={onSubmit}
          role="search"
          aria-label="Pretraga oglasa"
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-400 dark:border-slate-700 dark:bg-slate-800"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500 dark:text-slate-400" aria-hidden="true">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="search"
            placeholder="Pretraži majstore, usluge ili grad…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="submit"
            className="hidden rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:block"
          >
            Pretraži
          </button>
        </form>

        {/* Auth actions */}
        <nav className="ml-auto hidden items-center gap-2 sm:flex">
          <Link
            to="/profil"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
              Profil
          </Link>
          <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="relative flex flex-col justify-center gap-[3px] px-2 py-1 rounded-md border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
          >
              <span className="block h-[2px] w-5 bg-slate-800 rounded-full" />
              <span className="block h-[2px] w-5 bg-slate-800 rounded-full" />
              <span className="block h-[2px] w-5 bg-slate-800 rounded-full" />
          </button>


            {menuOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg text-slate-900">
                    <div className="px-3 py-3 text-xs font-semibold text-slate-400 border-b border-slate-100">
                        {user ? user.email : "Nalog"}
                    </div>

                    <Link
                        to="/my-ads"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-slate-100"
                    >
                        Moji oglasi
                    </Link>

                    <Link
                        to="/favorites"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-slate-100"
                    >
                        Omiljeni oglasi
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                        Odjava
                    </button>
                </div>
            )}
        </nav>

        {/* Mobile auth shortcut */}
        <Link
          to="/login"
          className="sm:hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Nalog
        </Link>
      </div>
    </header>
  );
}
