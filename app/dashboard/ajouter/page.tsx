// /app/ajouter/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/Input';


const steps = ['Apprenti', 'Coordonnées', 'Diplôme', 'Contrat', 'Employeur', 'Maître d’apprentissage', 'Confirmation'];

export default function AjouterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
  // Étape 1
  NomApprenti: '',
  PrenomApprenti: '',
  NIR: '',
  DateNaissance: '', // corrigé
  DepartementNaissance: '',
  CommuneNaissance: '', // corrigé
  Nationalite: '',
  Sexe: 'M',
  SportifHautNiveau: 'non',
  Handicape: 'non',
  ProjetEntreprise: 'non',

  //Etape 2
  NumVoieApprenti: '',
  AdresseVoieApprenti: '',
  AdresseComplementApprenti: '',
  CodePostalApprenti: '',
  Ville: '',
  TelephoneApprenti: '',
  EmailApprenti1: '',
  EmailApprenti2: '',

  //Etape 3
  SituationAvant: '',
  DernierDiplome: '',
  DerniereClasse: '',
  IntituleDiplome: '',
  DiplomePlusHaut: '',


  // Étape 4
  RegimeSocial: '',
  TypeContrat: '',
  TypeDerogation: '',
  DateDebutform: '',
  DateDebutContrat: '', 
  DateFinContrat: '',
  DureeTravailHeures: '',
  DureeTravailMinutes: '',
  EtatContrat: '',
  DateDebutExe: '', // corrigé
  DateConclusion: '',
  Salaire: '',

  // Étape 5
  NomEntreprise: '',
  SIRET: '',
  AdresseNum: '',
  AdresseVoie: '',
  AdresseComplement: '',
  CodePostal: '',
  Commune: '',
  Telephone: '',
  Email1: '',
  Email2: '',
  CodeNAF: '',
  Effectif: '',
  TypeEmployeur: '',
  EmployeurSpecifique: '',
  CodeIDCC: '',

  // Étape 6
  NomMaitre: '',
  PrenomMaitre: '',
  DateNaissanceMaitre: '',
  TelephoneMaitre: '', // corrigé (pas d’accent)
  Courriel1Maitre: '',
  Courriel2Maitre: '',
  EmploiOccupe: '',
  DiplomeTitre: '',
  NiveauDiplome: ''
  });


  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'cerfa'), form);
      alert('Étudiant enregistré avec succès dans Firebase.');
      router.push('/dashboard/liste');
    } catch (error) {
      console.error('🔥 Firebase error:', error);
      alert("Erreur lors de l'enregistrement dans Firestore : " + (error as Error).message);
    }
  };


    // ✅ Meilleure version du composant Input


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
    <h1 className="text-2xl font-bold mb-6 text-center">Créer un contrat CERFA</h1>
    <StepIndicator />

    {step === 1 && (
      <div className="space-y-4">
        <Input name="NomApprenti" value={form.NomApprenti} onChange={handleChange} placeholder="Nom de l'apprenti" />
        <Input name="PrenomApprenti" value={form.PrenomApprenti} onChange={handleChange} placeholder="Prénom" />
        <Input name="NIR" value={form.NIR} onChange={handleChange} placeholder="NIR" />
       <Input
          name="DateNaissance"
          value={form.DateNaissance}
          onChange={handleChange}
          type="date"
          placeholder="Date de naissance"
        />

        <Input
          name="DepartementNaissance"
          value={form.DepartementNaissance}
          onChange={handleChange}
          placeholder="Département naissance"
        />
        <Input
          name="CommuneNaissance"
          value={form.CommuneNaissance}
          onChange={handleChange}
          placeholder="Commune naissance"
        />
        <Input name="Nationalite" value={form.Nationalite} onChange={handleChange} placeholder="Nationalité" />
        <select
          name="Sexe"
          value={form.Sexe}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </select>

        <select
          name="SportifHautNiveau"
          value={form.SportifHautNiveau}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="non">Non sportif de haut niveau</option>
          <option value="oui">Oui sportif de haut niveau</option>
        </select>

        <select
          name="Handicape"
          value={form.Handicape}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="non">Non reconnu travailleur handicapé</option>
          <option value="oui">Oui reconnu travailleur handicapé</option>
        </select>
        
        <select
          name="ProjetEntreprise"
          value={form.ProjetEntreprise}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        >
          <option value="non">Non projet entreprise</option>
          <option value="oui">Oui projet entreprise</option>
        </select>

        <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
          Suivant
        </button>
      </div>
    )}

    {step === 2 && (
      <div className="space-y-4">
        <Input name="NumVoieApprenti" value={form.NumVoieApprenti} onChange={handleChange} placeholder="Adresse (n°)" />
        <Input name="AdresseVoieApprenti" value={form.AdresseVoieApprenti} onChange={handleChange} placeholder="Adresse (voie)" />
        <Input name="AdresseComplementApprenti" value={form.AdresseComplementApprenti} onChange={handleChange} placeholder="Adresse (complément)" />
        <Input
          name="CodePostalApprenti"
          value={form.CodePostalApprenti}
          onChange={handleChange}
          placeholder="Code postal"
        />
        <Input
          name="Ville"
          value={form.Ville}
          onChange={handleChange}
          placeholder="Ville"
        />
        <Input
          name="TelephoneApprenti"
          value={form.TelephoneApprenti}
          onChange={handleChange}
          placeholder="Telephone"
        />
        <Input
          name="EmailApprenti1"
          value={form.EmailApprenti1}
          onChange={handleChange}
          placeholder="Email 1 (ex: Email1@Email2)"
        />
        <Input
          name="EmailApprenti2"
          value={form.EmailApprenti2}
          onChange={handleChange}
          placeholder="Email 2 (ex: Email1@Email2 sans le @)"
        />
         <div className="flex gap-4">
          <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            Retour
          </button>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      </div>
    )}

    {step === 3 && (
      <div className="space-y-4">
        <Input name="SituationAvant" value={form.SituationAvant} onChange={handleChange} placeholder="Situation avant ce contrat" />
        <Input name="DernierDiplome" value={form.DernierDiplome} onChange={handleChange} placeholder="Dernier diplôme ou titre préparé" />
        <Input name="DerniereClasse" value={form.DerniereClasse} onChange={handleChange} placeholder="Dernière classe / année suivie"/>
        <Input name="IntituleDiplome" value={form.IntituleDiplome} onChange={handleChange} placeholder="Intitulé précis du dernier diplôme ou titre préparé" />
        <Input name="DiplomePlusHaut" value={form.DiplomePlusHaut} onChange={handleChange} placeholder="Diplôme ou titre le plus élevé obtenu" />
        <div className="flex gap-4">
          <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            Retour
          </button>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      </div>
    )}

    {step === 4 && (
      <div className="space-y-4">
        <Input name="RegimeSocial" value={form.RegimeSocial} onChange={handleChange} placeholder="Régime social" />
        <Input name="TypeContrat" value={form.TypeContrat} onChange={handleChange} placeholder="Type de contrat" />
        <Input name="TypeDerogation" value={form.TypeDerogation} onChange={handleChange} placeholder="Type de dérogation" />
        <Input name="DateDebutform" value={form.DateDebutform} onChange={handleChange} placeholder="Date de début de la formation" />
        <Input name="DateDebutContrat" value={form.DateDebutContrat} onChange={handleChange} placeholder="Date de début du contrat" />
        <Input name="DateFinContrat" value={form.DateFinContrat} onChange={handleChange} placeholder="Date de fin de contrat" />
        <Input name="DureeTravailHeures" value={form.DureeTravailHeures} onChange={handleChange} placeholder="Durée hebdomadaire du travail  heure" />
        <Input name="DureeTravailMinutes" value={form.DureeTravailMinutes} onChange={handleChange} placeholder="Durée hebdomadaire du travail  minutes" />
        <Input name="EtatContrat" value={form.EtatContrat} onChange={handleChange} placeholder="Etat du contrat" />
        <Input name="DateDebutExe" value={form.DateDebutExe} onChange={handleChange} placeholder="Date de début d'exécution du contrat" />
        <Input name="DateConclusion" value={form.DateConclusion} onChange={handleChange} placeholder="Date de conclusion" />
        <Input name="Salaire" type="number" value={form.Salaire} onChange={handleChange} placeholder="Salaire (€)" />
        <div className="flex gap-4">
          <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            Retour
          </button>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      </div>
    )}

    {step === 5 && (
      <div className="space-y-4">
        <Input name="NomEntreprise" value={form.NomEntreprise} onChange={handleChange} placeholder="Nom entreprise" />
        <Input name="SIRET" value={form.SIRET} onChange={handleChange} placeholder="SIRET" />
        <Input name="AdresseNum" value={form.AdresseNum} onChange={handleChange} placeholder="N° Adresse" />
        <Input name="AdresseVoie" value={form.AdresseVoie} onChange={handleChange} placeholder="Voie" />
        <Input name="AdresseComplement" value={form.AdresseComplement} onChange={handleChange} placeholder="Adresse (complement)" />
        <Input name="CodePostal" value={form.CodePostal} onChange={handleChange} placeholder="Code postal" />
        <Input name="Commune" value={form.Commune} onChange={handleChange} placeholder="Commune" />
        <Input name="Telephone" value={form.Telephone} onChange={handleChange} placeholder="Téléphone" />
        <Input name="Email1" value={form.Email1} onChange={handleChange} placeholder="Email 1 (ex: Email1@Email2)" />
        <Input name="Email2" value={form.Email2} onChange={handleChange} placeholder="Email 2 (ex: Email1@Email2 sans le @)" />
        <Input name="CodeNAF" value={form.CodeNAF} onChange={handleChange} placeholder="Code activité de l'entreprise (NAF)" />
        <Input name="Effectif" value={form.Effectif} onChange={handleChange} placeholder="Effectif total salariés de l'entreprise " />
        <Input name="TypeEmployeur" value={form.TypeEmployeur} onChange={handleChange} placeholder="Type d'employeur" />
        <Input name="EmployeurSpecifique" value={form.EmployeurSpecifique} onChange={handleChange} placeholder="Employeur spécifique" />
        <Input name="CodeIDCC" value={form.CodeIDCC} onChange={handleChange} placeholder="Email" />
        <div className="flex gap-4">
          <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            Retour
          </button>
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      </div>
    )}

    {step === 6 && (
      <div className="space-y-4">
        <Input name="NomMaitre" value={form.NomMaitre} onChange={handleChange} placeholder="Nom" />
        <Input name="PrenomMaitre" value={form.PrenomMaitre} onChange={handleChange} placeholder="Prénom" />
        <Input
          name="DateNaissanceMaitre"
          value={form.DateNaissanceMaitre}
          onChange={handleChange}
          type="date"
          placeholder="Date de naissance"
        />
        <Input name="TelephoneMaitre" value={form.TelephoneMaitre} onChange={handleChange} placeholder="Téléphone" />
        <Input name="Courriel1Maitre" value={form.Courriel1Maitre} onChange={handleChange} placeholder="Courriel 1" />
        <Input name="Courriel2Maitre" value={form.Courriel2Maitre} onChange={handleChange} placeholder="Courriel 2" />
        <Input name="EmploiOccupe" value={form.EmploiOccupe} onChange={handleChange} placeholder="Emploi occupé" />
        <Input name="DiplomeTitre" value={form.DiplomeTitre} onChange={handleChange} placeholder="Diplôme" />
        <Input name="NiveauDiplome" value={form.NiveauDiplome} onChange={handleChange} placeholder="Niveau de diplôme ou titre le plus élevé obtenu " />
        <div className="flex gap-4">
          <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            Retour
          </button>
          <button onClick={() => setStep(7)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      </div>
    )}

    {step === 7 && (
      <div className="space-y-4">
        {renderSummary()}
        <div className="flex gap-4">
          <button onClick={handleBack} className="bg-gray-400 text-white px-4 py-2 rounded">
            Retour
          </button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
            Confirmer et enregistrer
          </button>
        </div>
      </div>
    )}
  </div>
);
}
