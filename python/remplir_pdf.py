# cerfa_generator_firestore.py

import os
from pdfrw import PdfReader, PdfWriter
import fitz
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

cred = credentials.Certificate("python/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

TEMPLATE_PDF = "python/modele.pdf"
OUTPUT_FOLDER = "python/output"                                                    #Chemin du document Cerfa vierge
OUTPUT_FOLDER = "python/output/outpout_rempli"                                                       #Chemin des documents remplie

# Mapping PDF
FIELD_MAP = {
    # Employeur
    'Nom et prénom ou dénomination :': 'NomEntreprise',
    'N°SIRET de l\x90établissement d\x90exécution du contrat :': 'SIRET',
    'N°': 'AdresseNum',
    'Voie': 'AdresseVoie',
    'Complément': 'AdresseComplement',
    'Code postal': 'CodePostal',
    'Commune': 'Commune',
    'Téléphone': 'Telephone',
    'Courriel 1': 'Email1',
    'Courriel 2': 'Email2',
    'Code activité de l\x90entreprise \\(NAF\\) :': 'CodeNAF',
    'Effectif total salariés de l\x90entreprise :': 'Effectif',
    'Type d\x90employeur': 'TypeEmployeur',
    'Employeur spécifique': 'EmployeurSpecifique',
    'Code IDCC de la convention collective applicable :': 'CodeIDCC',

    

  
    # Apprenti
    'Nom de naissance de l\x90apprenti\\(e\\) :': 'NomApprenti',
    'Nom dusage': 'NomUsage',
    'Le premier prénom de l\x90apprenti\\(e\\) selon l\x90état civil :': 'PrenomApprenti',
    'NIR de l\x90apprenti\\(e\\)': 'NIR',
    'Adresse de l\x90apprenti\\(e\\) Voie': 'AdresseVoieApprenti',
    'Adresse de l\x90apprenti\\(e\\) Complément': 'AdresseComplementApprenti',
    'Adresse de l\x90apprenti\\(e\\) CP': 'CodePostalApprenti',
    'Adresse de l\x90apprenti\\(e\\) N°': 'NumVoieApprenti',
    'Adresse de l\x90apprenti\\(e\\) Commune': 'Ville',
    'Adresse de l\x90apprenti\\(e\\) Téléphone': 'TelephoneApprenti',
    'Adresse de l\x90apprenti\\(e\\) Courriel1': 'EmailApprenti1',
    'Adresse de l\x90apprenti\\(e\\) Courriel2': 'EmailApprenti2',
    'Département naissance apprenti': 'DepartementNaissance',
    'Commune naissance apprenti': 'CommuneNaissance',
    'Nationalité apprenti': 'Nationalite',
    'Régime social apprenti': 'RegimeSocial',
    'Situation avant ce contrat': 'SituationAvant',
    'Apprenti Date naissance_af_date': 'DateNaissance',
    'Dernier diplôme ou titre préparé': 'DernierDiplome',
    'Dernière classe / année suivie': 'DerniereClasse',
    'Intitulé précis du dernier diplôme ou titre préparé :': 'IntituleDiplome',
    'Diplôme ou titre le plus élevé obtenu': 'DiplomePlusHaut',

    'Représentant légal Nom / Prénom': 'NomRep',
    'Adresse du représentant légal N°': 'AdressenumResp',
    'Adresse du représentant légal Voie': 'AdresseVoieResp',
    
    
    # Maitre de stage
    
    'Maître d\x90apprentissage n°1 Nom de naissance': 'NomMaitre',
    'Maître d\x90apprentissage n°1 Prénom': 'PrenomMaitre',
    'Maître d\x90apprentissage n°1 Courriel1': 'Courriel1Maitre',
    'Maître d\x90apprentissage n°1 Courriel2': 'Courriel2Maitre',
    #'Maître d\x90apprentissage n°1 Courriel2suite': 'Courriel2Maitre',
    'Maître d\x90apprentissage n°1 Emploi occupé :': 'EmploiOccupe',
    'Maître d\x90apprentissage n°1 Date naissance_af_date': 'DateNaissanceMaitre',
    'Maître d\x90apprentissage n°1Diplôme ou titre le plus élevé obtenu :': 'DiplomeTitre',
    'Maître d\x90apprentissage n°1 Niveau de diplôme ou titre le plus élevé obtenu :': 'NiveauDiplome',




    'Type de contrat ou d\x90avenant :': 'TypeContrat',
    'Type de dérogation :': 'TypeDerogation',
    'Numéro du contrat précédent ou du contrat sur lequel porte l\x90avenant :': 'NumContrat',
    'Date de conclusion : _af_date': 'DateConclusion',
    'Date de début d\x90exécution du contrat : _af_date': 'DateDebutexe',
    'Date de début de formation pratique chez l\x90employeur : _af_date': 'DateDebutform',
    'Salaire brut mensuel à l\x90embauche :': 'Salaire',


    # Contrat
    'Date de conclusion : _af_date': 'DateConclusion',
    'Date de début dexécution du contrat : _af_date': 'DateDebutContrat ',
    'ate de fin du contrat ou de la période d\'apprentissage_af_date': 'DateFinContrat ',
    'Durée hebdomadaire du travail  heure': 'DureeTravailHeures',
    'Durée hebdomadaire du travail  minutes': 'DureeTravailMinutes',
  

    #Case à Cocher
        
        'Sexe M': 'Sexe',
        'Sexe F': 'Sexe',
        'Déclare être inscrit sur la liste des sportifs de haut niveau OUI': 'SportifHautNiveau',
        'Déclare être inscrit sur la liste des sportifs de haut niveau NON': 'SportifHautNiveau',
        'Déclare bénéficier de la reconnaissance travailleur handicapé OUI': 'Handicape',
        'Déclare bénéficier de la reconnaissance travailleur handicapé NON': 'Handicape',
        'Déclare avoir un projet de création ou de reprise d\x90entreprise OUI': 'ProjetEntreprise',
        'Déclare avoir un projet de création ou de reprise d\x90entreprise NON': 'ProjetEntreprise',


    

    }

CHAMPS_DATES = [
        'Apprenti Date naissance_af_date',
        'Date de conclusion : _af_date',
        'Date de début d\x90exécution du contrat : _af_date',
        "ate de fin du contrat ou de la période d'apprentissage_af_date",
        'Date de début de formation pratique chez l\x90employeur : _af_date',
        'Maître d\x90apprentissage n°1 Date naissance_af_date'
    ]

cases_a_cocher = [
    # Sexe
    {"x": 337.9, "y": 379.8, "champ": "Sexe", "valeur": "m"},
    {"x": 365.3, "y": 379.6, "champ": "Sexe", "valeur": "f"},

    # Sportif de haut niveau
    {"x": 345.3, "y": 475.7, "champ": "SportifHautNiveau", "valeur": "oui"},
    {"x": 399.7, "y": 475.5, "champ": "SportifHautNiveau", "valeur": "non"},

    # Travailleur handicapé
    {"x": 363.7, "y": 505.7, "champ": "Handicape", "valeur": "oui"},
    {"x": 418.9, "y": 504.9, "champ": "Handicape", "valeur": "non"},

    # Projet de création ou reprise d’entreprise
    {"x": 371.3, "y": 645.2, "champ": "ProjetEntreprise", "valeur": "oui"},
    {"x": 424.9, "y": 645.2, "champ": "ProjetEntreprise", "valeur": "non"},
]

def remplir_formulaire(pdf_input, pdf_output, valeurs):
    pdf = PdfReader(pdf_input)
    for page in pdf.pages:
        if not page.Annots:
            continue
        for annot in page.Annots:
            if annot.T:
                champ = annot.T[1:-1]
                if champ in valeurs:
                    valeur=valeurs[champ]
                    if pd.isna(valeur):
                        annot.V = ''
                    else:
                        annot.V = str(valeur)

                    annot.AP = None  # Force l'affichage du champ modifié
    PdfWriter(pdf_output, trailer=pdf).write()

def dessiner_coches(pdf_path, valeurs):
    doc = fitz.open(pdf_path)
    page = doc[0]
    for case in cases_a_cocher:
        valeur_case = str(valeurs.get(case["champ"], "")).strip().lower()
        valeur_attendue = str(case["valeur"]).strip().lower()
        if valeur_case and valeur_case != 'nan' and valeur_case == valeur_attendue:
            x = case["x"] - 2
            y = case["y"] - 2
            page.insert_text(
                (x, y),
                "x",
                fontsize=15,
                fontname="helv",
                color=(0, 0, 0),
                overlay=True
            )
    
    tmp_path = pdf_path + ".tmp"
    doc.save(tmp_path)
    doc.close()
    os.replace(tmp_path, pdf_path)
    print(f"✅ PDF final enregistré : {pdf_path}")

def generer_pdf_depuis_firestore(doc_id: str):
    doc_ref = db.collection("cerfa").document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise ValueError(f"Aucun document trouvé avec l'ID : {doc_id}")

    data = doc.to_dict()

    valeurs = {}
    for champ_pdf, cle in FIELD_MAP.items():
        valeur = data.get(cle, "")
        if champ_pdf in CHAMPS_DATES and valeur:
            try:
                from datetime import datetime
                valeur = datetime.strptime(valeur, "%Y-%m-%d").strftime("%d/%m/%Y")
            except:
                pass
        valeurs[champ_pdf] = valeur

    for case in cases_a_cocher:
        champ = case["champ"]
        valeurs[champ] = data.get(champ, "")

    nom = data.get("NomApprenti", "inconnu")
    prenom = data.get("PrenomApprenti", "inconnu")
    output_pdf = f"{OUTPUT_FOLDER}/{nom}_{prenom}.pdf"

    remplir_formulaire(TEMPLATE_PDF, output_pdf, valeurs)
    dessiner_coches(output_pdf, valeurs)
    print(f"✅ PDF généré : {output_pdf}")
    return output_pdf