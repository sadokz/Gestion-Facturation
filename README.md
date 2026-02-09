# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution complète de gestion financière et opérationnelle conçue spécifiquement pour les bureaux d'études. Elle permet de suivre l'intégralité du cycle de vie des projets, de la signature du contrat à l'encaissement final.

## 🚀 Fonctionnalités Clés

### 📊 Tableau de Bord (Dashboard)
- **Indicateurs de Performance (KPIs)** : Visualisation en temps réel du total des contrats, du montant facturé, du reste à facturer et des dépenses totales (en DT HT).
- **Flux Mensuel** : Graphique comparatif des ventes et des achats par mois.
- **Activité Récente** : Flux chronologique des dernières factures émise/payées, nouveaux projets et achats.
- **Top Clients** : Classement des clients par volume d'affaires.

### 🏗️ Gestion des Projets & Ventes
- **Réorganisation Intelligente** : Système de **glisser-déposer (Drag & Drop)** pour organiser l'ordre de priorité de vos projets dans la liste.
- **Suivi des Contrats** : Gestion des montants de base et des avenants.
- **Statuts de Facturation Automatiques** : Le statut du projet est calculé dynamiquement selon les montants réels :
  - **Non facturé** : Aucune facture émise.
  - **Partiellement Facturé** : Cumul facturé < Montant total du contrat.
  - **Totalement Facturé** : Contrat entièrement facturé.
- **Facturation Multi-situations** : Création de factures structurées (Avance, Missions S0 à S5, Règlement Définitif).
- **Gestion Documentaire** : Téléversement et suivi des contrats signés, factures, décharges et attestations de retenue à la source.
- **Analyse Détaillée** : Vue "Analyse complète" avec graphiques de rentabilité et marge brute par projet.

### 👥 Gestion des Clients & Entreprises
- **Annuaire Clients** : Gestion des clients directs avec badges de comptage de projets.
- **Annuaire Entreprises** : Gestion des partenaires et sous-traitants.
- **Vues Étendues** : Visualisation directe des responsables/contacts et de l'historique des projets réalisés pour chaque client sans quitter la liste.

### 🛒 Gestion des Achats & Dépenses
- **Suivi Fournisseurs** : Enregistrement des factures d'achats par catégorie (Matériel, Déplacement, Logiciels, etc.).
- **Liaison Projets** : Affectation des dépenses à des projets spécifiques pour un calcul précis de la rentabilité.

### ⚙️ Fonctions Globales
- **Exercices Comptables** : Filtrage global de l'application par année d'exercice via le sélecteur en haut de page.
- **Recherche Globale (Command Palette)** : Accès ultra-rapide à n'importe quelle section ou action via le raccourci **Ctrl+K** ou **⌘K**.
- **Exportation** : Export des données d'achats et de ventes au format CSV.
- **Interface Adaptative** : Design moderne, réactif et optimisé pour une utilisation quotidienne intensive.

## 🛠️ Détails Techniques
- **Framework** : React avec TypeScript.
- **Styling** : Tailwind CSS & Shadcn/UI pour une interface élégante et cohérente.
- **Interactions** : dnd-kit pour le glisser-déposer fluide.
- **Formatage** : Support complet du Dinar Tunisien (DT) avec 3 décimales.

## 📋 Utilisation
1. **Organisation** : Utilisez la poignée de saisie à gauche des lignes pour réorganiser vos projets ou clients.
2. **Facturation** : Développez un projet pour ajouter une situation de travaux ou une facture de mission.
3. **Analyse** : Utilisez le menu "Analyse complète" sur un projet pour comparer vos dépenses réelles par rapport au budget facturé.