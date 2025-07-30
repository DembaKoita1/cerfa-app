'use client';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  NomApprenti: string;
  PrenomApprenti: string;
  NIR: string;
  NomEntreprise: string;
};

export default function ListePage() {
  const [data, setData] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/liste')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter(item =>
    `${item.NomApprenti} ${item.PrenomApprenti}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(d => d.id));
    }
  };

  const handleGenerateCerfa = () => {
    if (selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins un apprenti.');
      return;
    }
    fetch('/api/genere', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    })
      .then(res => {
        if (res.ok) return res.blob();
        throw new Error('Erreur lors de la génération des CERFA');
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cerfa.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Liste des étudiants</h1>

      <input
        type="text"
        placeholder="Rechercher un apprenti..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={toggleSelectAll}
      >
        {selectedIds.length === filteredData.length ? 'Tout désélectionner' : 'Tout sélectionner'}
      </button>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500">Aucun apprenti trouvé.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {filteredData.map(item => (
            <li key={item.id} className="flex items-center bg-white p-4 rounded shadow hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="mr-4"
              />
              <div>
                <p className="text-gray-800 font-medium">
                  {item.NomApprenti} {item.PrenomApprenti}
                </p>
                <p className="text-sm text-gray-500">{item.NIR} • {item.NomEntreprise}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleGenerateCerfa}
        disabled={selectedIds.length === 0}
        className={`px-6 py-3 rounded text-white ${selectedIds.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        Générer CERFA pour {selectedIds.length} apprenti(s)
      </button>
    </div>
  );
}
