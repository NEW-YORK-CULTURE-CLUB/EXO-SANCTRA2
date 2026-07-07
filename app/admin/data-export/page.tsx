'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { exportAllExoSanctraData, type CollectionExport } from '@/lib/firestore-export-service';
import {
  downloadPdfFromRows,
  downloadTextFile,
  rowsToCsv,
  sanitizeFilename,
} from '@/lib/data-export-utils';
import { Download, FileSpreadsheet, FileText, Loader2, Lock, Database } from 'lucide-react';

const SESSION_KEY = 'exo_data_export_authorized';

export default function DataExportPage() {
  const [accessKey, setAccessKey] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authChecking, setAuthChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exports, setExports] = useState<CollectionExport[] | null>(null);
  const [loadError, setLoadError] = useState('');

  const totalRows = useMemo(
    () => exports?.reduce((sum, item) => sum + item.rows.length, 0) ?? 0,
    [exports]
  );

  const tryAuthorize = useCallback(async () => {
    setAuthChecking(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/export-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: accessKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorized) {
        setAuthError(data.error || 'Invalid access key');
        return;
      }
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthorized(true);
    } catch {
      setAuthError('Could not verify access key');
    } finally {
      setAuthChecking(false);
    }
  }, [accessKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await exportAllExoSanctraData(db);
      setExports(data);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Failed to read Firestore. Check Firebase config and security rules.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnlock = useCallback(async () => {
    await tryAuthorize();
  }, [tryAuthorize]);

  const handleScanOnOpen = useCallback(async () => {
    const res = await fetch('/api/admin/export-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: '' }),
    });
    const data = await res.json();
    if (data.optional && data.authorized) {
      setAuthorized(true);
    } else if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    handleScanOnOpen();
  }, [handleScanOnOpen]);

  const downloadCollectionCsv = (item: CollectionExport) => {
    const csv = rowsToCsv(item.rows);
    downloadTextFile(
      `exo-sanctra_${sanitizeFilename(item.path)}_${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      'text/csv;charset=utf-8'
    );
  };

  const downloadCollectionPdf = (item: CollectionExport) => {
    downloadPdfFromRows(`EXO SANCTRA — ${item.label}`, item.rows);
  };

  const downloadAllCsv = () => {
    if (!exports) return;
    const combined = exports.flatMap((item) => item.rows);
    const csv = rowsToCsv(combined);
    downloadTextFile(
      `exo-sanctra_all_collections_${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      'text/csv;charset=utf-8'
    );
  };

  const downloadAllJson = () => {
    if (!exports) return;
    const payload = exports.map(({ path, label, rows, error }) => ({
      path,
      label,
      error,
      count: rows.length,
      records: rows,
    }));
    downloadTextFile(
      `exo-sanctra_all_collections_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    );
  };

  const downloadAllPdf = () => {
    if (!exports) return;
    const combined = exports.flatMap((item) => item.rows);
    downloadPdfFromRows('EXO SANCTRA — all collections', combined);
  };

  if (!authorized) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-card border rounded-xl p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold">Data export</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Export EXO SANCTRA Firestore data before handover. If{' '}
              <code className="text-xs">DATA_EXPORT_ACCESS_KEY</code> is set on the server, enter it
              below. Otherwise click Continue.
            </p>
            <Input
              type="password"
              placeholder="Access key (if configured)"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button className="w-full" onClick={handleUnlock} disabled={authChecking}>
              {authChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Continue
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-7 h-7 text-primary" />
              <h1 className="text-3xl font-light text-foreground">EXO SANCTRA data export</h1>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              Download everything this application stores in Firebase — users, orders, ceremony
              sign-ups, gift claims, marketplace items, and related records — as CSV or PDF for
              handover to a new team with their own database.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={loadData} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {exports ? 'Refresh scan' : 'Scan database'}
            </Button>
            {exports && (
              <>
                <Button variant="outline" onClick={downloadAllCsv}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download all (CSV)
                </Button>
                <Button variant="outline" onClick={downloadAllJson}>
                  <Download className="w-4 h-4 mr-2" />
                  Download all (JSON)
                </Button>
                <Button variant="outline" onClick={downloadAllPdf}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download all (PDF)
                </Button>
              </>
            )}
          </div>

          {loadError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {loadError}
            </div>
          )}

          {exports && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {exports.length} collection groups · {totalRows} total records
              </p>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Collection</th>
                      <th className="text-left p-3 font-medium w-24">Records</th>
                      <th className="text-right p-3 font-medium w-48">Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exports.map((item) => (
                      <tr key={item.path} className="border-t">
                        <td className="p-3">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.path}</div>
                          {item.error && (
                            <div className="text-xs text-destructive mt-1">{item.error}</div>
                          )}
                        </td>
                        <td className="p-3">{item.rows.length}</td>
                        <td className="p-3 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={item.rows.length === 0}
                            onClick={() => downloadCollectionCsv(item)}
                          >
                            CSV
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={item.rows.length === 0}
                            onClick={() => downloadCollectionPdf(item)}
                          >
                            PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                PDF export opens a print dialog — choose &quot;Save as PDF&quot; in your browser. Empty
                collections may be due to Firestore security rules or no data stored yet.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
