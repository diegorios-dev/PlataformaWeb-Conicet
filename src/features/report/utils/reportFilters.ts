export const filterByType = (reports, filterType) => {
  if (filterType === "regular") return reports.filter(r => r.type === "regular");
  if (filterType === "rotura") return reports.filter(r => r.type === "rotura");
  return reports;
};

export const filterByPrecipitation = (reports, filter) => {
  const map = { lluvia: 1, nieve: 2, caudal: 3 };
  if (filter === "all") return reports;
  return reports.filter(r => r.site?.event_id === map[filter]);
};

export const filterByZona = (reports, zona) => {
  if (zona === "all") return reports;
  return reports.filter(r => r.site?.zona_id === Number(zona));
};

export const filterBySearch = (reports, search) => {
  if (!search.trim()) return reports;
  
  const q = search.toLowerCase();
  return reports.filter(r =>
    r.id.toString().includes(q) ||
    r.note?.toLowerCase().includes(q) ||
    r.site?.zona?.locality?.toLowerCase().includes(q)
  );
};

export const sortByDate = (reports, order: 'asc' | 'desc' = 'asc') => {
  const sorted = [...reports].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date || 0).getTime();
    const dateB = new Date(b.created_at || b.date || 0).getTime();
    
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  return sorted;
};
