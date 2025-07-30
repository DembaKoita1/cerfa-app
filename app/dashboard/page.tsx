'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function countDocuments() {
  const coll = collection(db, "cerfa");
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
}

async function fetchLastFive() {
  const cerfaRef = collection(db, "cerfa");
  const q = query(cerfaRef, orderBy("createdAt", "desc"), limit(5));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [lastFive, setLastFive] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => setData(json));

    // Charger le count total depuis Firebase
    countDocuments()
      .then(c => setCount(c))
      .catch(err => {
        console.error("Erreur lors du comptage des documents :", err);
        setCount(null);
      });
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-green-200 to-green-500 text-white">
      <h1 className="text-4xl font-bold mb-8">HOME</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
          <p className="text-md"><strong>Contrats CERFA créés :</strong> {data.length}</p>
          <p className="text-md">
            <strong>Nombre total d’étudiants :</strong> {count !== null ? count : "Chargement..."}
          </p>
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Derniers étudiants créés</h2>
          {lastFive.length === 0 && <p>Aucun étudiant trouvé.</p>}
          {lastFive.map((item, idx) => (
            <div key={item.id || idx} className="border-b border-gray-200 py-2">
              <p className="font-medium">{item.PrenomApprenti} {item.NomApprenti}</p>
              <p className="text-sm text-gray-500">{item.Email1}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <Link href="/ajouter" className="bg-black text-white text-center py-3 px-4 rounded-xl shadow hover:bg-gray-900 transition">Ajouter</Link>
        <Link href="/liste" className="bg-black text-white text-center py-3 px-4 rounded-xl shadow hover:bg-gray-900 transition">Liste</Link>
        <Link href="/modifier" className="bg-black text-white text-center py-3 px-4 rounded-xl shadow hover:bg-gray-900 transition">Modifier</Link>
        <Link href="/supprimer" className="bg-black text-white text-center py-3 px-4 rounded-xl shadow hover:bg-gray-900 transition">Supprimer</Link>
      </div>
    </div>
  );
}
