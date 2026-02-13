# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise.

---

## 📊 1. Tableau de Bord (Dashboard)
Le centre de pilotage de votre activité, entièrement personnalisable.

### Indicateurs de Performance (KPIs)
Huit indicateurs clés calculés en temps réel pour l'exercice sélectionné :
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

### Fonctionnalités
- **Tableau Intelligent** : Colonnes redimensionnables, triables et personnalisables.
- **Suivi des Avenants** : Gestion séparée du montant initial et des modifications contractuelles.
- **Calcul Automatique du Statut** : Le système détermine si un projet est "Non facturé", "Partiellement" ou "Totalement" selon les factures émises.
- **Détail des Situations** : Liste déroulante sous chaque projet pour gérer les factures (Avance, Missions S0 à S5, Règlement Définitif).

---

## 👷 3. Suivi Technique des Projets (Nouveau)
Coordination technique et suivi de l'avancement physique des chantiers.

### Fonctionnalités
- **Annuaire des Intervenants** : Identification rapide de l'Architecte, des Ingénieurs (Fluides, Structure) et du Bureau de Contrôle pour chaque projet.
- **Avancement Physique** : Barre de progression visuelle (0-100%) pour suivre l'état réel des travaux sur site.
- **Statut Technique** : Distinction entre les phases de démarrage, en cours et terminé.

---

## 👥 4. Annuaires (Clients & Entreprises)
Gestion des tiers et de leurs contacts.

- **Annuaires Séparés** : Distinction claire entre Maîtres d'Ouvrage (Clients) et Partenaires/Sous-traitants (Entreprises).
- **Gestion des Responsables** : Liste illimitée de contacts par entité avec rôles, téléphones et emails directs.

---

## 🛒 5. Achats & Dépenses
Contrôle des coûts opérationnels.

- **Catégorisation** : Classement des dépenses (Matériel, Déplacement, Logiciels, etc.).
- **Affectation Analytique** : Possibilité de lier un achat à un projet spécifique pour calculer la marge brute par projet.

---

## 👨‍💼 6. Salaires & RH
Gestion du capital humain et des absences.

### Ressources Humaines (RH)
- **Droit aux Congés** : Configuration du quota annuel par employé (ex: 30 jours).
- **Suivi des Soldes** : Calcul automatique des jours pris et du solde restant.

### Salaires
- **Fiches de Paie** : Historique mensuel des versements incluant Primes, Tickets Restaurant et Carburant.

---

## 📂 7. Gestion des Documents (Uploads)
L'application permet de centraliser les documents officiels aux points suivants :

1.  **Contrats Projets** : Téléversement du contrat signé (PDF/Image).
2.  **Factures de Ventes** : Fichier Facture, Décharge de dépôt et Attestation de Retenue.
3.  **Justificatifs RH** : Certificats médicaux ou demandes de congés signées.

---

## 🛠️ 8. Outils Transverses & UX
- **Recherche Globale (Ctrl+K)** : Palette de commande pour naviguer instantanément.
- **Mode Confidentialité (👁️)** : Masquage instantané de toutes les données financières (`*****`).
- **Gestion des Exercices** : Séparation stricte des données par année.