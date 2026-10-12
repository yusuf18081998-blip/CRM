import { Student, AttendanceRecord, Homework, StudentSubmission } from '../types';

export interface DatabaseBackup {
  version: string;
  exportedAt: string;
  students: Student[];
  attendance?: AttendanceRecord[];
  homework?: Homework[];
  submissions?: StudentSubmission[];
}

/**
 * Generate a shareable URL that embeds the students data in the URL hash.
 * This allows the teacher to send one link to Telegram/phone, and students'
 * phones will automatically sync the student database into their localStorage.
 */
export function generateSyncUrl(
  students: Student[],
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''
): string {
  try {
    const payload = JSON.stringify({
      v: 1,
      s: students,
    });
    // UTF-8 safe base64 encoding
    const encoded = btoa(encodeURIComponent(payload));
    return `${baseUrl}#sync=${encoded}`;
  } catch (e) {
    console.error('Failed to generate sync URL', e);
    return baseUrl;
  }
}

/**
 * Checks if the current URL hash contains #sync=... data.
 * If present, returns the extracted students array and removes the hash.
 */
export function parseSyncUrl(): Student[] | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash || !hash.includes('sync=')) return null;

  try {
    const rawEncoded = hash.split('sync=')[1]?.split('&')[0];
    if (!rawEncoded) return null;

    const decoded = decodeURIComponent(atob(rawEncoded));
    const parsed = JSON.parse(decoded);
    if (parsed && Array.isArray(parsed.s)) {
      // Remove hash from address bar without reloading
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return parsed.s;
    }
  } catch (e) {
    console.warn('Failed to parse sync data from URL hash', e);
  }
  return null;
}

/**
 * Export full database as a JSON file download
 */
export function exportDatabaseFile(
  students: Student[],
  attendance: AttendanceRecord[] = [],
  homework: Homework[] = [],
  submissions: StudentSubmission[] = []
) {
  const data: DatabaseBackup = {
    version: '4.0',
    exportedAt: new Date().toISOString(),
    students,
    attendance,
    homework,
    submissions,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maktab45_ai_baza_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
