/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { addFavorite, removeFavorite, getFavoritesIds } from "../services/favoritesService";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // ────────────────────────────────
    // 1. UČITAVANJE USERA IZ TOKENA
    // ────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        api
            .get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => {
                delete api.defaults.headers.common["Authorization"];
                localStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // ────────────────────────────────
    // 2. UČITAVANJE FAVORITES SA BACKENDA
    // ────────────────────────────────
    useEffect(() => {
        async function loadFavorites() {
            if (!user) {
                setFavorites([]);
                return;
            }

            try {
                const ids = await getFavoritesIds(); // MORA POSTOJATI API ROUTA GET /favorites
                setFavorites(Array.isArray(ids) ? ids : []);
                console.log("Authcontext favorites nakon GET-a:", ids);
            } catch (err) {
                console.error("Greška pri učitavanju favorites:", err);
                setFavorites([]);
            }
        }

        loadFavorites();
    }, [user]);

    // ────────────────────────────────
    // 3. TOGGLE FAVORITE
    // ────────────────────────────────
    async function toggleFavorite(adId) {
        if (!user) return;

        const isFav = favorites.includes(adId);

        // optimistic update
        setFavorites((prev) =>
            isFav ? prev.filter((id) => id !== adId) : [...prev, adId]
        );

        try {
            if (isFav) {
                await removeFavorite(adId);
            } else {
                await addFavorite(adId);
            }
        } catch (err) {
            console.error("toggleFavorite error:", err);

            // revert changes
            setFavorites((prev) =>
                isFav ? [...prev, adId] : prev.filter((id) => id !== adId)
            );
        }
    }

    // ────────────────────────────────
    // 4. LOGOUT
    // ────────────────────────────────
    function logout() {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        setUser(null);
        setFavorites([]);
    }

    // ────────────────────────────────
    // 5. KONTEKST VALUE
    // ────────────────────────────────
    const value = {
        user,
        loading,
        favorites,
        toggleFavorite,
        setUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <p className="text-center mt-10">Učitavam...</p> : children}
        </AuthContext.Provider>
    );
}
