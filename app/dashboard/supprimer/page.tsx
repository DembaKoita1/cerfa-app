'use client';
import { useEffect, useState } from 'react';

export default function SupprimerPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/liste')
      .then(res => res.json())
      .then(setData);
  }, []);

  const handleDelete = async (id: string) => {
  const confirmDelete = confirm('Voulez-vous vraiment supprimer cet apprenti ?');
  if (!confirmDelete) return;

  try {
    const res = await fetch('/api/delete', {
      method: 'POST', // au lieu de DELETE
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Erreur suppression:', result);
      return alert(result?.error || 'Erreur lors de la suppression.');
    }

    setData(prev => prev.filter(item => item.id !== id));
  } catch (err) {
    console.error('Erreur réseau:', err);
    alert('Erreur réseau ou serveur.');
  }
};

  const filteredData = data.filter(item =>
    `${item.NomApprenti} ${item.PrenomApprenti}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Supprimer un Apprenti</h1>

      <input
        type="text"
        placeholder="Rechercher un apprenti..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <ul className="space-y-4">
        {filteredData.map((item, idx) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow hover:bg-red-50"
          >
            <span className="text-gray-800 font-medium">{item.NomApprenti} {item.PrenomApprenti}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}