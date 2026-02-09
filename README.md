# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution complète de gestion financière et opérationnelle conçue spécifiquement pour les bureaux d'études. Elle permet de suivre l'intégralité du cycle de vie des projets, de la signature du contrat à l'encaissement final.

## 🚀 Fonctionnalités Clés

### 📊 Tableau de Bord (Dashboard)
- **Indicateurs de Performance (KPIs)** : Visualisation en temps réel du total des contrats, du montant facturé, du reste à facturer et des dépenses totales (en DT HT).
- **Flux Mensuel** : Graphique comparatif des ventes et des achats par mois.
- **Activité Récente** : Flux chronologique des dernières factures émise/payées, nouveaux projets et achats.

### 🏗️ Gestion des Projets & Ventes
- **Suivi des Contrats** : Gestion des montants de base et des avenants.
- **Facturation Multi-situations** : Création de factures structurées selon les étapes types d'un projet d'ingénierie :
  - **Avance**
  - **Missions S0 à S5** (Suivi des phases d'études)
  - **Règlement Définitif**
  - **Autre**
- **Suivi des Encaissements** : Gestion des dates d'émission et des **dates de paiement** pour un suivi précis de la trésorerie client.
- **Analyse de Rentabilité** : Calcul automatique de la marge brute par projet.

### 👥 Gestion des Clients & Entreprises
- **Annuaire Clients** : Gestion des clients directs avec leurs responsables.
- **Annuaire Entreprises** : Gestion des partenaires et sous-traitants avec leurs responsables respectifs.
- **Interface Extensible** : Visualisation rapide des contacts via un système de lignes extensibles dans les tableaux.

### 🛒 Gestion des Achats & Dépenses
- **Suivi Fournisseurs** : Enregistrement des factures d'achats par catégorie.
- **Suivi des Paiements** : Nouveau champ **Date de paiement** pour suivre les décaissements effectifs.
- **Liaison Projets** : Affectation des dépenses à des projets spécifiques pour une analyse de coût réelle.

### ⚙️ Paramètres & Configuration
- **Profil du Bureau** : Personnalisation des informations de l'entreprise.
- **Exercices Comptables** : Filtrage global de l'application par année d'exercice.
- **Recherche Globale** : Accès rapide via le menu de commande (Ctrl+K).

## 🛠️ Détails Techniques
- **Framework** : React avec TypeScript.
- **Styling** : Tailwind CSS & Shadcn/UI.
- **Graphiques** : Recharts.
- **Formatage** : Support complet du Dinar Tunisien (DT) avec 3 décimales.

## 📋 Utilisation
1. Sélectionnez l'**Année d'Exercice** en haut à droite.
2. Utilisez la **Recherche Globale** (⌘K) pour naviguer.
3. Dans les onglets **Clients** ou **Entreprises**, cliquez sur la flèche à gauche pour gérer les responsables.
4. Lors de la création d'une facture (Vente ou Achat), renseignez la **Date de paiement** dès que le règlement est effectif pour mettre à jour vos indicateurs de trésorerie.