# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise.

---

## 📊 1. Tableau de Bord (Dashboard)
Le centre de pilotage de votre activité, entièrement personnalisable.

### Indicateurs de Performance (KPIs)
- **Total Contrats (HT)** : Somme des montants de base et des avenants signés.
- **Total Facturé (HT)** : Cumul de toutes les factures de ventes émises.
- **Reste à Facturer (HT)** : Différence entre le montant total des contrats et le déjà facturé.
- **Total Achats (HT)** : Somme de toutes les dépenses fournisseurs enregistrées.
- **Total Payé CNSS** : Cumul des cotisations sociales versées.
- **Total Salaires** : Somme des montants nets versés aux employés.
- **Total Encaissé (HT)** : Chiffre d'affaires réel basé uniquement sur les factures marquées comme "Payées".
- **Bénéfice Réel (HT)** : Calculé selon la formule : `Total Encaissé - (Achats + Salaires + CNSS)`.

---

## 🏗️ 2. Projets & Facturation
Gestion du cycle de vie des contrats et suivi rigoureux des paiements.

### Description des colonnes
- **Référence** : Identifiant unique du projet (ex: PRJ-2026-001).
- **Projet** : Nom du projet et nom du client associé.
- **Contrat** : État du document contractuel (icône verte si téléversé).
- **Total Contrat HT** : Montant de base du contrat hors taxes.
- **Avenant HT** : Montant des modifications contractuelles supplémentaires.
- **TVA** : Montant de la taxe calculé sur le total HT (Base + Avenant).
- **Total Contrat TTC** : Valeur totale du projet incluant la TVA.
- **Total Facturé HT** : Somme des montants hors taxes de toutes les factures émises.
- **Facturé TTC** : Valeur totale facturée incluant la TVA.
- **Total Reçu TTC** : Montant réellement encaissé (factures au statut "Payé").
- **Reste à Facturer TTC** : Montant restant à réclamer au client pour atteindre le total TTC du contrat.
- **Statut** : État de facturation (Non facturé, Partiellement, Totalement).

---

## 👷 3. Suivi Technique des Projets
Coordination technique et suivi de l'avancement physique des chantiers.

### Description des colonnes
- **Référence** : Rappel de l'identifiant unique du projet.
- **Projet / Maître d'Ouvrage** : Nom du projet et entité commanditaire.
- **Resp. Interne** : Ingénieur ou collaborateur du bureau responsable du dossier.
- **Architecte** : Cabinet d'architecture partenaire sur le projet.
- **Ing. Fluides / Structure** : Bureaux d'études partenaires spécialisés.
- **Bureau de Contrôle** : Organisme chargé de la conformité technique (ex: Veritas).
- **Phase** : Étape actuelle de l'étude (APS, APD, DAO...).
- **Indice** : Version actuelle des plans ou documents (A, B, C...).
- **Avancement Études** : Pourcentage de progression de la production intellectuelle.
- **Entreprise** : Entreprise de travaux (BTP) en charge de l'exécution.
- **Avancement Travaux** : Pourcentage de progression réelle du chantier sur site.

---

## 👥 4. Annuaires (Clients & Entreprises)
Gestion des tiers et de leurs contacts.

### Description des colonnes (Communes aux deux onglets)
- **Client / Entreprise** : Nom ou Raison Sociale de l'entité.
- **Matricule Fiscal** : Identifiant légal de l'entreprise.
- **Adresse** : Localisation physique du siège ou de l'agence.
- **Google Maps** : Lien direct vers la localisation GPS.
- **Téléphone / Fax / Email** : Coordonnées de contact de l'entité.

---

## 🛒 5. Achats & Dépenses
Contrôle des coûts opérationnels.

### Description des colonnes
- **Fournisseur** : Nom du prestataire ou magasin.
- **N° Facture** : Référence de la facture d'achat.
- **Date Facture** : Date d'émission du document.
- **Date Paiement** : Date à laquelle la dépense a été réglée.
- **Catégorie** : Type de dépense (Matériel, Logiciels, Déplacement...).
- **Montant HT** : Valeur de l'achat hors taxes.
- **TTC** : Valeur totale payée incluant la TVA.
- **Statut** : État du règlement (À payer, Payée).

---

## 👨‍💼 6. Salaires & RH
Gestion du capital humain et des absences.

### Onglet Salaires (Colonnes Employés)
- **Employé** : Nom, prénom et photo/initiales du collaborateur.
- **CIN** : Numéro de la Carte d'Identité Nationale.
- **Poste** : Fonction occupée au sein du bureau.
- **S. Brut** : Salaire brut contractuel.
- **S. Net** : Salaire net à payer (base).
- **Téléphone** : Numéro de contact direct.

### Onglet RH (Suivi des Congés)
- **Employé** : Nom et poste du collaborateur.
- **Total Congés** : Quota annuel de jours de repos (ex: 30j).
- **Congés Pris** : Nombre de jours de congés déjà validés et consommés.
- **Solde Restant** : Jours disponibles restants pour l'année.
- **Maladies** : Cumul des jours d'absence pour raison médicale.
- **En attente** : Nombre de demandes de congés non encore traitées.

---

## 📂 7. Gestion des Documents (Uploads)
L'application permet de centraliser les documents officiels :
1.  **Contrats Projets** : PDF du contrat signé.
2.  **Factures de Ventes** : Facture, Décharge de dépôt et Attestation de Retenue.
3.  **Dossier RH** : Copie de la **CIN** et **Contrat de travail** pour chaque employé.
4.  **Justificatifs RH** : Certificats médicaux ou demandes signées.

---

## 🛠️ 8. Outils Transverses & UX
- **Recherche Globale (Ctrl+K)** : Palette de commande pour naviguer instantanément.
- **Mode Confidentialité (👁️)** : Masquage instantané de toutes les données financières (`*****`).
- **Gestion des Exercices** : Séparation stricte des données par année.