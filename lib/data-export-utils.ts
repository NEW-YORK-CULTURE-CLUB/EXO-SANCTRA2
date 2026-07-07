import type { ExportRow } from './data-export-config';

function serializeValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
    if (typeof maybeTimestamp.toDate === 'function') {
      return maybeTimestamp.toDate().toISOString();
    }
    if (typeof maybeTimestamp.seconds === 'number') {
      return new Date(maybeTimestamp.seconds * 1000).toISOString();
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function flattenDocument(
  collectionPath: string,
  docId: string,
  data: Record<string, unknown>
): ExportRow {
  const row: ExportRow = {
    _collection: collectionPath,
    _id: docId,
  };

  for (const [key, value] of Object.entries(data)) {
    row[key] = serializeValue(value);
  }

  return row;
}

export function rowsToCsv(rows: ExportRow[]): string {
  if (rows.length === 0) {
    return '_collection,_id\n';
  }

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  const escape = (cell: string) => {
    const text = cell ?? '';
    if (/[",\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(',')),
  ];

  return lines.join('\n');
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadPdfFromRows(title: string, rows: ExportRow[]) {
  const headers =
    rows.length > 0
      ? Array.from(
          rows.reduce((set, row) => {
            Object.keys(row).forEach((key) => set.add(key));
            return set;
          }, new Set<string>())
        )
      : ['_collection', '_id'];

  const tableHead = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
  const tableBody = rows
    .map(
      (row) =>
        `<tr>${headers.map((h) => `<td>${escapeHtml(row[h] ?? '')}</td>`).join('')}</tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    p { color: #666; font-size: 12px; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; font-size: 10px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; vertical-align: top; word-break: break-word; }
    th { background: #f5f5f5; }
    tr:nth-child(even) { background: #fafafa; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>Exported ${rows.length} record(s) — ${new Date().toLocaleString()}</p>
  <table>
    <thead><tr>${tableHead}</tr></thead>
    <tbody>${tableBody || '<tr><td colspan="' + headers.length + '">No records</td></tr>'}</tbody>
  </table>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Pop-up blocked. Allow pop-ups to export PDF, or use CSV export instead.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_');
}
