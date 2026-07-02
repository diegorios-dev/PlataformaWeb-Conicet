import type { Report } from "@features/report/types";

export const filterByType = (reports: Report[], filterType: string) => {
  if (filterType === "regular") return reports.filter(r => r.type === "regular");
  if (filterType === "rotura") return reports.filter(r => r.type === "rotura");
  return reports;
};

export const filterByPrecipitation = (reports: Report[], filter: "all" | "lluvia" | "nieve" | "caudal") => {
  const map = { lluvia: 1, nieve: 2, caudal: 3 } as const;
  if (filter === "all") return reports;
  return reports.filter(r => r.site?.event_id === map[filter]);
};

export const filterByZona = (reports: Report[], zona: string) => {
  if (zona === "all") return reports;
  return reports.filter(r => r.site?.zona_id === Number(zona));
};

export const filterBySearch = (reports: Report[], search: string) => {
  if (!search.trim()) return reports;
  
  const q = search.toLowerCase();
  return reports.filter(r =>
    r.id.toString().includes(q) ||
    r.note?.toLowerCase().includes(q) ||
    r.site?.zona?.locality?.toLowerCase().includes(q)
  );
};

export const sortByDate = (reports: Report[], order: 'asc' | 'desc' = 'asc') => {
  const sorted = [...reports].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date || 0).getTime();
    const dateB = new Date(b.created_at || b.date || 0).getTime();
    
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  return sorted;
};
