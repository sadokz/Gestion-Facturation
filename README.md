# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution complète de gestion financière et opérationnelle conçue spécifiquement pour les bureaux d'études. Elle permet de suivre l'intégralité du cycle de vie des projets, de la signature du contrat à l'encaissement final.

## 🚀 Fonctionnalités Clés

### 📊 Tableau de Bord (Dashboard)
- **Indicateurs de Performance (KPIs)** : Visualisation en temps réel du total des contrats, du montant facturé, du reste à facturer et des dépenses totales (en DT HT).
- **Flux Mensuel** : Graphique comparatif des ventes et des achats par mois.
- **Activité Récente** : Flux chronologique des dernières factures émise/payées, nouveaux projets et achats.

### 🏗️ Gestion des Projets & Ventes
- **Réorganisation Intelligente** : Système de **glisser-déposer (Drag & Drop)** pour organiser l'ordre de priorité de vos projets dans la liste.
- **Suivi des Contrats** : Gestion des montants de base et des avenants.
- **Statuts de Facturation Automatiques** : Le statut du projet est calculé dynamiquement selon les montants réels :
  - **Non facturé** : Aucune facture émise.
  - **Partiellement Facturé** : Cumul facturé < Montant total du contrat.
  - **Totalement Facturé** : Contrat entièrement facturé, mais paiements en attente.
  - **Soldé** : Contrat entièrement facturé ET entièrement payé (Reste à payer = 0).
- **Facturation Multi-situations** : Création de factures structurées (Avance, Missions S0 à S5, Règlement Définitif).
- **Suivi des Encaissements** : Gestion des dates d'émission et des dates de paiement pour un suivi précis de la trésorerie.

### 👥 Gestion des Clients & Entreprises
- **Annuaire Clients** : Gestion des clients directs avec leurs responsables.
- **Annuaire Entreprises** : Gestion des partenaires et sous-traitants.
- **Interface Extensible** : Visualisation rapide des contacts et des factures via un système de lignes extensibles.

### 🛒 Gestion des Achats & Dépenses
- **Suivi Fournisseurs** : Enregistrement des factures d'achats par catégorie.
- **Liaison Projets** : Affectation des dépenses à des projets spécifiques pour une analyse de coût réelle et calcul de marge brute.

### ⚙️ Paramètres & Configuration
- **Exercices Comptables** : Filtrage global de l'application par année d'exercice.
- **Recherche Globale** : Accès rapide via le menu de commande (Ctrl+K).

## 🛠️ Détails Techniques
- **Framework** : React avec TypeScript.
- **Styling** : Tailwind CSS & Shadcn/UI.
- **Interactions** : dnd-kit pour le glisser-déposer.
- **Formatage** : Support complet du Dinar Tunisien (DT) avec 3 décimales.

## 📋 Utilisation
1. Utilisez la **poignée de saisie** (icône à gauche) pour réorganiser vos projets.
2. Le **Statut** se met à jour automatiquement dès que vous ajoutez une facture ou que vous marquez une facture comme "Payée".
3. Consultez l'**Analyse complète** d'un projet pour voir les graphiques de rentabilité détaillés.