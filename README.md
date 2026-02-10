# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution complète de gestion financière et opérationnelle conçue spécifiquement pour les bureaux d'études. Elle permet de suivre l'intégralité du cycle de vie des projets, de la signature du contrat à l'encaissement final, tout en gérant les ressources humaines et les dépenses.

## 🚀 Fonctionnalités Clés

### 📊 Tableau de Bord (Dashboard)
- **Indicateurs de Performance (KPIs)** : Visualisation en temps réel du total des contrats, du montant facturé, du reste à facturer et des dépenses totales (en DT HT).
- **Flux Mensuel** : Graphique comparatif des ventes et des achats par mois.
- **Activité Récente** : Flux chronologique des dernières factures émise/payées, nouveaux projets et achats.
- **Top Clients** : Classement des clients par volume d'affaires.

### 🏗️ Gestion des Projets & Ventes
- **Réorganisation Intelligente** : Système de **glisser-déposer (Drag & Drop)** pour organiser l'ordre de priorité de vos projets.
- **Suivi des Contrats** : Gestion des montants de base, des avenants et archivage des contrats signés.
- **Statuts de Facturation Dynamiques** : Calcul automatique (Non facturé, Partiellement, Totalement) basé sur les situations réelles.
- **Facturation Multi-situations** : Création de factures structurées (Avance, Missions S0 à S5, Règlement Définitif) avec gestion des retenues à la source.

### 👥 Gestion des Clients & Entreprises
- **Annuaires Dédiés** : Gestion séparée des clients directs et des partenaires/sous-traitants.
- **Vues Étendues** : Accès rapide aux responsables/contacts et à l'historique des projets pour chaque entité.
- **Géolocalisation** : Intégration de liens Google Maps pour les sièges sociaux.

### 🛒 Gestion des Achats & Dépenses
- **Suivi Fournisseurs** : Enregistrement des factures d'achats par catégorie (Matériel, Déplacement, Logiciels, etc.).
- **Rentabilité par Projet** : Affectation des dépenses à des projets spécifiques pour un calcul précis de la marge brute.

### 👨‍💼 Salaires & Ressources Humaines
- **Profils Employés** : Gestion complète des fiches employés (Poste, CIN, Salaire Brut/Net).
- **Gestion des Congés** : 
  - Configuration personnalisée du **Droit aux congés annuel** par employé.
  - Suivi en temps réel du solde restant, des jours pris et des absences maladie.
  - Historique détaillé des absences avec justificatifs.
- **Paiements** : Suivi mensuel des salaires, primes, tickets restaurant et frais de carburant.

### ⚙️ Configuration & Personnalisation
- **Gestion des Modules** : Possibilité d'activer ou de désactiver chaque onglet du menu (Dashboard, RH, Achats, etc.) via les paramètres pour une interface épurée.
- **Profil Bureau** : Personnalisation des informations légales et du logo du bureau d'études.
- **Exercices Comptables** : Filtrage global de l'application par année d'exercice.

### 🛠️ Modules en Développement (Prochainement)
- **Déclaration CNSS** : Automatisation des calculs de cotisations et génération des rapports trimestriels.
- **Bilan Comptable** : Génération d'états financiers simplifiés et comptes de résultats annuels.

## 📋 Utilisation Rapide
1. **Recherche Globale** : Utilisez **Ctrl+K** (ou ⌘K) pour accéder instantanément à n'importe quel projet ou menu.
2. **Organisation** : Utilisez les poignées de saisie (grip) pour réorganiser vos listes par priorité.
3. **Exportation** : Exportez vos données de ventes et d'achats en CSV pour vos besoins comptables externes.

## 🛠️ Détails Techniques
- **Framework** : React 19 avec TypeScript.
- **Styling** : Tailwind CSS & Shadcn/UI.
- **Interactions** : dnd-kit pour le glisser-déposer.
- **Formatage** : Support complet du Dinar Tunisien (DT) avec 3 décimales.