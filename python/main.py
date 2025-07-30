from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
import os
from python.remplir_pdf import generer_pdf_depuis_firestore

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API CERFA FastAPI est en ligne"}

@app.get("/generate/{doc_id}")
def generate_cerfa(doc_id: str):
    print(f"[INFO] Reçu requête pour générer CERFA avec doc_id: {doc_id}")
    try:
        pdf_path = generer_pdf_depuis_firestore(doc_id)
        print(f"[INFO] PDF généré à: {pdf_path}")

        if not os.path.exists(pdf_path):
            print("[ERROR] Fichier PDF non trouvé après génération.")
            raise HTTPException(status_code=404, detail="PDF non trouvé après génération")

        return FileResponse(pdf_path, media_type="application/pdf", filename=os.path.basename(pdf_path))
    except Exception as e:
        print(f"[EXCEPTION] Erreur lors de la génération du CERFA: {e}")
        raise HTTPException(status_code=500, detail=str(e))
