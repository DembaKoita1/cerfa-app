// app/api/debug-champs/route.ts
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export async function GET() {
  try {
    const pdfPath = path.resolve('./public/cerfa_modele.pdf');
    const existingPdfBytes = readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const champs = fields.map(field => ({
      nom: field.getName(),
      type: field.constructor.name,
    }));

    return NextResponse.json({ champs });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Erreur lecture PDF', error: error.message },
      { status: 500 }
    );
  }
}
