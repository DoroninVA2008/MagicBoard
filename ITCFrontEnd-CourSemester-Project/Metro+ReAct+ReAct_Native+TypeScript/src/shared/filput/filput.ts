import type { Tale } from '@/shared/data/db'

export const filterTales = (tales: Tale[], query: string): Tale[] => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return tales;

  return tales.filter((tale) => {
    const nameMatch = tale.name?.toLowerCase().includes(trimmed) ?? false;
    const authorMatch = tale.author?.toLowerCase().includes(trimmed) ?? false;
    const inDevMatch = tale.inDev?.toLowerCase().includes(trimmed) ?? false;
    return nameMatch || authorMatch || inDevMatch;
  });
};