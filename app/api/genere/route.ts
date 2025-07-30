import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    // On récupère docId depuis ids[0] ou docId directement
    const docId = Array.isArray(body.ids) ? body.ids[0] : body.docId;

    if (!docId) {
      return NextResponse.json({ message: 'docId is required' }, { status: 400 });
    }

    // Ici tu appelleras ton API FastAPI avec docId
    // Exemple simplifié :
    const apiUrl = `http://10.0.2.15:8000/generate/${docId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: errorText }, { status: response.status });
    }

    const pdfBuffer = await response.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cerfa_${docId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
