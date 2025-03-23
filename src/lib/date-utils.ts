export function parseTweetDate(dateStr: string): number {
    if (dateStr.includes('T') && dateStr.endsWith('Z')) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) throw new Error(`Invalid date: ${dateStr}`);
      return date.getTime();
    }
  
    const delimiter = dateStr.includes('/') ? '/' : '-';
    const [day, month, year] = dateStr.split(delimiter).map(Number);
    return Date.UTC(year, month - 1, day);
  }