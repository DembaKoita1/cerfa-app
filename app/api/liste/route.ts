// /app/api/liste/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'cerfa'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants :', error);
    return NextResponse.json(
      { message: 'Erreur serveur', error },
      { status: 500 }
    );
  }
}
