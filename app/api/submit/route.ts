// /pages/api/submit.ts

import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { id, updated } = req.body;

  // 🛡️ Validation basique
  if (!id || typeof updated !== 'object' || Array.isArray(updated)) {
    return res.status(400).json({ message: 'ID ou données mises à jour invalides.' });
  }

  try {
    const docRef = doc(db, 'cerfa', id);

    // 🔍 Vérifie si le document existe
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ message: `Document avec l'ID ${id} introuvable.` });
    }

    // 🧩 Si le champ `id` est manquant, on l’ajoute
    const currentData = snapshot.data();
    if (!currentData.id) {
      await updateDoc(docRef, { id });
    }

    // ✏️ Mise à jour des données principales
    await updateDoc(docRef, updated);

    return res.status(200).json({ message: 'Mise à jour réussie', id });
  } catch (err: any) {
    console.error('❌ Erreur Firestore:', err);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du document.',
      error: err.message,
    });
  }
}