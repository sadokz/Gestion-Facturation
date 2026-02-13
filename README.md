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

### Sections Visuelles
- **Flux Mensuel (TTC)** : Graphique à barres comparant les ventes (encaissées vs attente), les achats et les salaires par mois.
- **Statut des Factures** : Graphique circulaire montrant la répartition (Payée, En attente, Non facturée).
- **Activité Récente** : Flux chronologique des dernières actions (nouvelles factures, projets signés, achats).
- **Top Clients** : Classement des clients par volume d'affaires avec barres de progression.

### Fonctionnalités Avancées
- **Personnalisation** : Bouton "Personnaliser" pour masquer/afficher chaque KPI ou graphique.
- **Drag & Drop** : Réorganisez l'ordre des KPIs et des graphiques par simple glisser-déposer.
- **Largeur Flexible** : Ajustez la taille des graphiques (25%, 50%, 75% ou 100%) depuis les réglages du dashboard.

---

## 🏗️ 2. Projets & Facturation
Gestion du cycle de vie des contrats et suivi rigoureux des paiements.

### Fonctionnalités
- **Tableau Intelligent** : Colonnes redimensionnables, triables et personnalisables.
- **Suivi des Avenants** : Gestion séparée du montant initial et des modifications contractuelles.
- **Calcul Automatique du Statut** : Le système détermine si un projet est "Non facturé", "Partiellement" ou "Totalement" selon les factures émises.
- **Détail des Situations** : Liste déroulante sous chaque projet pour gérer les factures (Avance, Missions S0 à S5, Règlement Définitif).
- **Retenue à la Source** : Déduction automatique des retenues pour calculer le montant net à recevoir.

---

## 👥 3. Annuaires (Clients & Entreprises)
Gestion des tiers et de leurs contacts.

- **Annuaires Séparés** : Distinction claire entre Maîtres d'Ouvrage (Clients) et Partenaires/Sous-traitants (Entreprises).
- **Gestion des Responsables** : Liste illimitée de contacts par entité avec rôles, téléphones et emails directs.
- **Historique Croisé** : Visualisation immédiate de tous les projets liés à un client ou une entreprise spécifique.
- **Intégration Maps** : Liens directs vers la localisation géographique des sièges sociaux.

---

## 🛒 4. Achats & Dépenses
Contrôle des coûts opérationnels.

- **Catégorisation** : Classement des dépenses (Matériel, Déplacement, Logiciels, etc.).
- **Affectation Analytique** : Possibilité de lier un achat à un projet spécifique pour calculer la marge brute par projet.
- **Export CSV** : Extraction complète des données d'achats pour traitement comptable externe.

---

## 👨‍💼 5. Salaires & RH
Gestion du capital humain et des absences.

### Ressources Humaines (RH)
- **Droit aux Congés** : Configuration du quota annuel par employé (ex: 30 jours).
- **Suivi des Soldes** : Calcul automatique des jours pris et du solde restant.
- **Types d'Absences** : Gestion des Congés Payés, Maladies, Sans solde et Récupérations.
- **Statuts de Validation** : Suivi des demandes "En attente", "Validées" ou "Refusées".

### Salaires
- **Fiches de Paie** : Historique mensuel des versements.
- **Éléments Variables** : Saisie des Primes, Tickets Restaurant et Frais de Carburant.
- **Modes de Paiement** : Suivi des règlements par Virement, Chèque ou Espèces.

---

## 📂 6. Gestion des Documents (Uploads)
L'application permet de centraliser les documents officiels aux points suivants :

1.  **Contrats Projets** : Téléversement du contrat signé (PDF/Image) dans le formulaire de création/édition de projet.
2.  **Factures de Ventes** (3 documents par facture) :
    *   **Fichier Facture** : La facture originale envoyée au client.
    *   **Décharge de dépôt** : Preuve de réception signée par le client.
    *   **Attestation de Retenue** : Document justifiant la retenue à la source effectuée par le client.
3.  **Justificatifs RH** : Téléversement des certificats médicaux ou demandes de congés signées pour chaque absence déclarée.
4.  **Logo Entreprise** : Personnalisation de l'interface via les paramètres.

---

## 🛠️ 7. Outils Transverses & UX
- **Recherche Globale (Ctrl+K)** : Palette de commande pour naviguer instantanément vers n'importe quel module ou action rapide.
- **Mode Confidentialité (👁️)** : Masquage instantané de toutes les données financières (`*****`) pour les présentations ou le travail en espace public.
- **Gestion des Exercices** : Séparation stricte des données par année (2024, 2025, 2026...).
- **Thèmes** : Support complet des modes Clair, Sombre et Système.
- **Visibilité des Modules** : Possibilité de désactiver des onglets entiers du menu (ex: masquer "Comptabilité" si non utilisée) via les Paramètres.