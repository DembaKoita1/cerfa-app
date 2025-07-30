'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const steps = ['Apprenti', 'Contrat', 'Employeur', 'Maître d’apprentissage', 'Confirmation'];

export default function ModifierPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({});
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'cerfa'));
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(docs);
      if (docs.length > 0) setForm(docs[0]);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!form.id) return alert('ID manquant');
    const { id, ...updated } = form;

    const res = await fetch('/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updated }),
    });

    if (res.ok) {
      alert('Données mises à jour');
      router.push('/liste');
    } else {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex-1 text-center">
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${i + 1 === step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
            {i + 1}
          </div>
          <p className={`mt-2 text-sm ${i + 1 === step ? 'text-blue-600 font-semibold' : ''}`}>{label}</p>
        </div>
      ))}
    </div>
  );

  const Input = ({ name, placeholder, type = 'text' }: { name: string; placeholder: string; type?: string }) => (
    <input
      name={name}
      type={type}
      value={form[name] || ''}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
    />
  );

  const renderSummary = () => (
    <div className="space-y-2 text-sm">
      <h2 className="text-lg font-semibold mb-2">Résumé des informations :</h2>
      {Object.entries(form).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="font-medium">{key}</span>
          <span>{String(value)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Modifier un contrat CERFA</h1>

      {data.length > 0 && (
        <select
          className="mb-4 w-full px-4 py-2 border rounded"
          value={form.id}
          onChange={(e) => {
            const selected = data.find(d => d.id === e.target.value);
            if (selected) setForm(selected);
          }}
        >
          {data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.NomApprenti || 'Sans nom'} {item.PrenomApprenti || ''}
            </option>
          ))}
        </select>
      )}

      <StepIndicator />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <Input name="NomApprenti" placeholder="Nom" />
          <Input name="PrenomApprenti" placeholder="Prénom" />
          <Input name="NIR" placeholder="NIR" />
          <Input name="DateNaissance" placeholder="Date de naissance" />
          <Input name="DepartementNaissance" placeholder="Département de naissance" />
          <Input name="CommuneNaissance" placeholder="Commune de naissance" />
          <Input name="Nationalite" placeholder="Nationalité" />
          <select name="Sexe" value={form.Sexe || 'M'} onChange={handleChange} className="w-full px-4 py-2 border rounded">
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Suivant</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <Input name="RegimeSocial" placeholder="Régime social" />
          <Input name="TypeContrat" placeholder="Type de contrat" />
          <Input name="EtatContrat" placeholder="État du contrat" />
          <Input name="DateDebutexe" placeholder="Début d'exécution" />
          <Input name="DateConclusion" placeholder="Date de conclusion" />
          <Input name="Salaire" type="number" placeholder="Salaire (€)" />
          <div className="flex gap-4">
            <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Suivant</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <Input name="NomEntreprise" placeholder="Nom entreprise" />
          <Input name="SIRET" placeholder="SIRET" />
          <Input name="AdresseNum" placeholder="N° Adresse" />
          <Input name="AdresseVoie" placeholder="Voie" />
          <Input name="CodePostal" placeholder="Code postal" />
          <Input name="Commune" placeholder="Commune" />
          <Input name="Telephone" placeholder="Téléphone" />
          <Input name="Email1" placeholder="Email" />
          <div className="flex gap-4">
            <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Suivant</button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-4">
          <Input name="NomMaitre" placeholder="Nom" />
          <Input name="PrenomMaitre" placeholder="Prénom" />
          <Input name="DateNaissanceMaitre" placeholder="Date de naissance" />
          <Input name="TéléphoneMaitre" placeholder="Téléphone" />
          <Input name="Courriel1Maitre" placeholder="Courriel" />
          <Input name="EmploiOccupe" placeholder="Emploi occupé" />
          <Input name="DiplomeTitre" placeholder="Diplôme" />
          <Input name="NiveauDiplome" placeholder="Niveau diplôme" />
          <div className="flex gap-4">
            <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Suivant</button>
          </div>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div className="space-y-4">
          {renderSummary()}
          <div className="flex gap-4">
            <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Confirmer et enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
