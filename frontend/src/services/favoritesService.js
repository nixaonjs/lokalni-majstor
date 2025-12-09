import api from "./api";

export async function getFavoritesIds() {
    const res = await api.get("/favorites");
    const ids = res.data.ids;
    return Array.isArray(ids) ? ids.map(Number) : [];
}

export async function addFavorite(adId) {
    await api.post(`/favorites/${adId}`);
}

export async function removeFavorite(adId) {
    await api.delete(`/favorites/${adId}`);
}

