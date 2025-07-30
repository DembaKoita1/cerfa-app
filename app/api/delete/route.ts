// /app/api/delete/route.ts
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // ✅ Corrigé ici

    console.log('🔎 Reçu pour suppression :', body);

    const id = body?.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID manquant ou invalide' }, { status: 400 });
    }

    await deleteDoc(doc(db, 'cerfa', id)); // ✅ Supprime depuis la collection 'cerfa'

    return NextResponse.json({ success: true, message: `Document ${id} supprimé.` });
  } catch (error: any) {
    console.error('❌ Erreur complète Firestore :', error);
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 });
  }
}
