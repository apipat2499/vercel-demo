export const saveToLocal = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocal = (key: string) => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const toggleFavorite = (article: any) => {
  const favorites = getFromLocal("favorites");
  const exists = favorites.find((a: any) => a.url === article.url);
  let updated;

  if (exists) {
    updated = favorites.filter((a: any) => a.url !== article.url);
  } else {
    updated = [...favorites, article];
  }

  saveToLocal("favorites", updated);
  return updated;
};