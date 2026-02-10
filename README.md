# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution complète de gestion financière et opérationnelle conçue spécifiquement pour les bureaux d'études. Elle permet de suivre l'intégralité du cycle de vie des projets, de la signature du contrat à l'encaissement final, tout en gérant les ressources humaines et les dépenses.

## 🚀 Fonctionnalités Implémentées

### 📊 Tableau de Bord (Dashboard)
- **Personnalisation** : Choisissez les sections à afficher ou masquer (cartes KPIs, graphiques, activités récentes, top clients).
- **Indicateurs de Performance (KPIs)** : Visualisation en temps réel du total des contrats, du montant facturé, du reste à facturer, des dépenses totales, du **Total Payé CNSS**, du **Total Salaires**, du **Chiffre d'affaires** et du **Bénéfice Total** (en DT HT).
- **Flux Mensuel** : Graphique comparatif des ventes et des achats par mois.
- **Activité Récente** : Flux chronologique des dernières factures émise/payées, nouveaux projets et achats.
- **Top Clients** : Classement des clients par volume d'affaires avec barre de progression relative.
- **Statut des Factures** : Graphique circulaire montrant la répartition des factures par statut (Payée, En attente, Non facturée).

### 🏗️ Gestion des Projets & Ventes
- **Organisation par Priorité** : Système de **glisser-déposer (Drag & Drop)** pour réorganiser la liste des projets.
- **Suivi des Contrats** : Gestion des montants de base, des avenants et du taux de TVA spécifique au projet.
- **Statuts de Facturation Automatiques** : Calcul en temps réel (Non facturé, Partiellement, Totalement) basé sur le cumul des factures émises.
- **Analyse de Rentabilité** : Vue détaillée par projet incluant la marge brute (Facturé HT - Achats liés).
- **Facturation Multi-situations** : 
  - Types de factures : Avance, Missions S0 à S5, Règlement Définitif.
  - Gestion des **Retenues à la source**.
  - Suivi des dates d'émission et de paiement effectif.

### 👥 Annuaires Clients & Entreprises
- **Gestion des Tiers** : Annuaires séparés pour les clients (maîtres d'ouvrage) et les entreprises (partenaires/sous-traitants).
- **Responsables & Contacts** : Liste illimitée d'interlocuteurs par entité avec rôles et coordonnées directes.
- **Historique des Projets** : Visualisation immédiate de tous les projets liés à un client ou une entreprise.
- **Outils Pratiques** : Liens directs vers Google Maps pour les adresses et boutons d'appel/email.

### 🛒 Gestion des Achats & Dépenses
- **Suivi Fournisseurs** : Enregistrement des factures d'achats avec catégories (Matériel, Déplacement, Logiciels, etc.).
- **Affectation Analytique** : Possibilité de lier chaque achat à un projet spécifique pour le calcul des marges.
- **Exportation** : Bouton d'export complet de la liste des achats au format **CSV**.
- **Organisation** : Support du Drag & Drop pour classer les dépenses.

### 👨‍💼 Salaires & Ressources Humaines
- **Fiches Employés** : Gestion des profils (Poste, CIN, Salaire Brut/Net contractuel).
- **Gestion des Absences (RH)** : 
  - Configuration du **Droit aux congés annuel** (ex: 30 jours).
  - Suivi automatique du solde restant et des jours pris.
  - Types d'absences : Congé Payé, Maladie, Sans solde, Récupération.
- **Paiements Mensuels** : Historique des rémunérations incluant Primes, Tickets Restaurant et Frais de Carburant.

### 🛠️ Outils d'Interface Avancés (UX)
- **Recherche Globale (Command Palette)** : Accessible via **Ctrl+K** pour naviguer instantanément partout.
- **Tableaux Intelligents** :
  - **Colonnes Personnalisables** : Masquer/Afficher les colonnes selon vos besoins.
  - **En-têtes Redimensionnables** : Ajustez la largeur des colonnes à la souris.
  - **Tri Dynamique** : Cliquez sur les en-têtes pour trier les données.
- **Gestion des Modules** : Activez ou désactivez les onglets du menu depuis les paramètres.

## 📂 Gestion des Documents (Uploads)

L'application permet de centraliser vos documents importants aux emplacements suivants :

1.  **Projets** : Téléversement du **Contrat signé** (PDF ou Image) dans le formulaire projet.
2.  **Factures Ventes** : Trois points d'upload par facture :
    - Le fichier de la **Facture** elle-même.
    - La **Décharge de dépôt** (preuve de réception par le client).
    - L'attestation de **Retenue à la source**.
3.  **RH / Absences** : Téléversement du **Justificatif** (certificat médical ou demande signée) pour chaque absence.
4.  **Paramètres** : Téléversement du **Logo du Bureau** pour la personnalisation de l'interface.

## 🛠️ Détails Techniques
- **Framework** : React 19 / TypeScript.
- **Design** : Tailwind CSS / Shadcn UI (Thème moderne "Slate & Indigo").
- **Données** : Context API pour la gestion de l'année d'exercice et de la navigation.
- **Formatage** : Monétaire en Dinar Tunisien (DT) avec 3 décimales.