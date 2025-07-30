// /pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const snapshot = await getDocs(collection(db, 'cerfa'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}