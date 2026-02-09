# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution complète de gestion financière et opérationnelle conçue spécifiquement pour les bureaux d'études. Elle permet de suivre l'intégralité du cycle de vie des projets, de la signature du contrat à l'encaissement final.

## 🚀 Fonctionnalités Clés

### 📊 Tableau de Bord (Dashboard)
- **Indicateurs de Performance (KPIs)** : Visualisation en temps réel du total des contrats, du montant facturé, du reste à facturer et des dépenses totales (en DT HT).
- **Flux Mensuel** : Graphique comparatif des ventes et des achats par mois.
- **Activité Récente** : Flux chronologique des dernières factures émises/payées, nouveaux projets et achats.
- **Analyse par Client** : Classement des meilleurs clients par volume d'affaires.

### 🏗️ Gestion des Projets & Ventes
- **Suivi des Contrats** : Gestion des montants de base et des avenants.
- **Facturation Multi-situations** : Possibilité de créer plusieurs factures (Acomptes, Situations, Solde) pour un seul projet.
- **Suivi des Paiements** : Double datation pour chaque facture :
  - **Date d'émission** : Pour le suivi de la facturation.
  - **Date de paiement** : Pour le suivi de la trésorerie réelle.
- **Analyse de Rentabilité** : Calcul automatique de la marge brute par projet en comparant les ventes et les dépenses liées.

### 🛒 Gestion des Achats & Dépenses
- **Suivi Fournisseurs** : Enregistrement des factures d'achats par catégorie (Matériel, Logiciels, Déplacement, etc.).
- **Liaison Projets** : Affectation des dépenses à des projets spécifiques pour un calcul précis de la rentabilité.
- **Statut de Paiement** : Suivi des factures "À payer" vs "Payées".

### ⚙️ Paramètres & Configuration
- **Profil du Bureau** : Personnalisation des informations de l'entreprise (Nom, Matricule Fiscal, Logo, Adresse).
- **Exercices Comptables** : Filtrage global de l'application par année d'exercice.
- **Recherche Globale** : Accès rapide aux projets et clients via un menu de commande (Ctrl+K).

## 🛠️ Détails Techniques
- **Framework** : React avec TypeScript.
- **Styling** : Tailwind CSS & Shadcn/UI pour une interface moderne et responsive.
- **Gestion d'état** : React Context pour l'année d'exercice et TanStack Query pour les données.
- **Graphiques** : Recharts pour les visualisations de données.
- **Formatage** : Support complet du Dinar Tunisien (DT) avec 3 décimales et dates au format FR.

## 📋 Utilisation
1. Sélectionnez l'**Année d'Exercice** en haut à droite pour filtrer les données.
2. Utilisez la **Recherche Globale** (⌘K) pour naviguer rapidement.
3. Dans l'onglet **Projets**, cliquez sur l'icône de déploiement pour gérer les factures d'un projet spécifique.