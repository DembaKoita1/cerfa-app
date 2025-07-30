// /pages/api/update.ts
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, updated } = req.body;

    if (!id || typeof updated !== 'object') {
      return res.status(400).json({ message: 'ID ou données manquantes' });
    }

    try {
      const docRef = doc(db, 'cerfa', id); // Référence au document avec l'ID Firestore
      await updateDoc(docRef, updated);
      res.status(200).json({ message: 'Document mis à jour' });
    } catch (error: any) {
      console.error('Erreur de mise à jour:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}