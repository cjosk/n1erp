'use client';

import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import type { LogEntry } from '@/lib/types';

const ActivityLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const logRef = collection(db, 'logs');
    const q = query(logRef, orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<LogEntry, 'id'>) }));
      setLogs(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="glass-card rounded-2xl border border-white/40 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Aktivite Kaydı</h3>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="flex items-start justify-between gap-4 border-b border-white/30 pb-3 last:border-b-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-gray-800">{log.action}</p>
              <p className="text-xs text-gray-500">Kullanıcı: {log.userId}</p>
            </div>
            <span className="text-xs text-gray-400">
              {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: tr }) : '—'}
            </span>
          </li>
        ))}
        {!logs.length && <li className="text-sm text-gray-500">Henüz log kaydı bulunmuyor.</li>}
      </ul>
    </div>
  );
};

export default ActivityLog;
