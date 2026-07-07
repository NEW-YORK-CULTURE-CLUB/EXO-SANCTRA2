import {
  collection,
  getDocs,
  getDoc,
  doc,
  type Firestore,
} from 'firebase/firestore';
import {
  EXO_SANCTRA_ROOT_COLLECTIONS,
  USER_SUBCOLLECTIONS,
  type ExportRow,
} from './data-export-config';
import { flattenDocument } from './data-export-utils';

export type CollectionExport = {
  path: string;
  label: string;
  rows: ExportRow[];
  error?: string;
};

async function exportCollection(
  db: Firestore,
  collectionPath: string
): Promise<ExportRow[]> {
  const snapshot = await getDocs(collection(db, collectionPath));
  return snapshot.docs.map((document) =>
    flattenDocument(collectionPath, document.id, document.data() as Record<string, unknown>)
  );
}

async function exportUserSubcollections(db: Firestore): Promise<CollectionExport[]> {
  const results: CollectionExport[] = [];
  const usersSnapshot = await getDocs(collection(db, 'users'));

  for (const sub of USER_SUBCOLLECTIONS) {
    const rows: ExportRow[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const path = `users/${userDoc.id}/${sub}`;
      const subSnapshot = await getDocs(collection(db, 'users', userDoc.id, sub));

      for (const subDoc of subSnapshot.docs) {
        rows.push(
          flattenDocument(path, subDoc.id, {
            _userId: userDoc.id,
            ...(subDoc.data() as Record<string, unknown>),
          })
        );
      }

      if (sub === 'albums') {
        for (const albumDoc of subSnapshot.docs) {
          const itemsPath = `users/${userDoc.id}/albums/${albumDoc.id}/items`;
          const itemsSnapshot = await getDocs(
            collection(db, 'users', userDoc.id, 'albums', albumDoc.id, 'items')
          );
          for (const itemDoc of itemsSnapshot.docs) {
            rows.push(
              flattenDocument(itemsPath, itemDoc.id, {
                _userId: userDoc.id,
                _albumId: albumDoc.id,
                ...(itemDoc.data() as Record<string, unknown>),
              })
            );
          }
        }
      }
    }

    results.push({
      path: `users/*/${sub}`,
      label: `users — ${sub}`,
      rows,
    });
  }

  return results;
}

async function exportGalleriesAssignments(db: Firestore): Promise<CollectionExport> {
  const rows: ExportRow[] = [];
  const galleriesSnapshot = await getDocs(collection(db, 'galleries'));

  for (const galleryDoc of galleriesSnapshot.docs) {
    const path = `galleries/${galleryDoc.id}/assignments`;
    const assignmentsSnapshot = await getDocs(
      collection(db, 'galleries', galleryDoc.id, 'assignments')
    );

    for (const assignmentDoc of assignmentsSnapshot.docs) {
      rows.push(
        flattenDocument(path, assignmentDoc.id, {
          _galleryId: galleryDoc.id,
          ...(assignmentDoc.data() as Record<string, unknown>),
        })
      );
    }
  }

  return {
    path: 'galleries/*/assignments',
    label: 'galleries — assignments',
    rows,
  };
}

export async function exportAllExoSanctraData(db: Firestore): Promise<CollectionExport[]> {
  const exports: CollectionExport[] = [];

  for (const collectionName of EXO_SANCTRA_ROOT_COLLECTIONS) {
    try {
      const rows = await exportCollection(db, collectionName);
      exports.push({
        path: collectionName,
        label: collectionName,
        rows,
      });
    } catch (error) {
      exports.push({
        path: collectionName,
        label: collectionName,
        rows: [],
        error: error instanceof Error ? error.message : 'Failed to read collection',
      });
    }
  }

  try {
    const userSubs = await exportUserSubcollections(db);
    exports.push(...userSubs);
  } catch (error) {
    exports.push({
      path: 'users/*/subcollections',
      label: 'users — subcollections',
      rows: [],
      error: error instanceof Error ? error.message : 'Failed to read user subcollections',
    });
  }

  try {
    exports.push(await exportGalleriesAssignments(db));
  } catch (error) {
    exports.push({
      path: 'galleries/*/assignments',
      label: 'galleries — assignments',
      rows: [],
      error: error instanceof Error ? error.message : 'Failed to read gallery assignments',
    });
  }

  return exports;
}

export async function verifyFirestoreConnection(db: Firestore): Promise<boolean> {
  try {
    await getDoc(doc(db, 'users', '__export_probe__'));
    return true;
  } catch {
    return false;
  }
}
