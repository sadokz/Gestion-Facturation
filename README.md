# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise.

---

## 📊 1. Tableau de Bord (Dashboard)
Le centre de pilotage de votre activité, entièrement personnalisable par chaque utilisateur.
- **Personnalisation Avancée** : Via l'icône ⚙️ en haut à droite, vous pouvez choisir quels indicateurs afficher, réorganiser les graphiques par glisser-déposer et ajuster la largeur des blocs (25%, 50%, 75% ou 100%).
- **Indicateurs (KPIs)** : Total Contrats, Facturé, Reste à Facturer, Achats, CNSS, Salaires, Chiffre d'affaires encaissé et Bénéfice Réel.
- **Flux de Trésorerie** : Graphique comparatif mensuel entre les ventes (encaissées/en attente) et les dépenses (achats/salaires).

---

## 🏗️ 2. Projets & Facturation
Gestion du cycle de vie des contrats et suivi rigoureux des paiements.
- **Modes de Vue ("Mes Vues")** : Créez des configurations de colonnes personnalisées (ex: "Vue Financière", "Vue Simplifiée"). Ces vues sont sauvegardées par catégorie et accessibles via le bouton "Modes de vue".
- **Suivi des Paiements** : Chaque projet peut être étendu pour afficher l'historique détaillé des factures émises, leur statut (Payé, En attente) et les documents joints (PDF).
- **Calculs Automatiques** : Gestion des avenants, calcul de la TVA et du reste à facturer en temps réel.

---

## 👷 3. Suivi Technique des Projets
Coordination technique et suivi de l'avancement physique des chantiers.
- **Interventions & PV** : Enregistrez chaque réunion, relevé, envoi de plan ou visite de chantier. Possibilité de joindre des comptes-rendus et des décharges signées.
- **Gestion des Intervenants** : Centralisation des contacts tiers (Architectes, Bureaux de contrôle, Ingénieurs spécialisés).
- **Liaison de Contacts** : Pour chaque projet, sélectionnez les responsables spécifiques chez le client ou l'entreprise de travaux pour un accès rapide.
- **Avancement Double** : Suivi distinct de l'avancement des études (interne) et de l'avancement des travaux (chantier).

---

## 👥 4. Annuaires (Clients & Entreprises)
Gestion des tiers et de leurs contacts.
- **Segmentation** : Deux annuaires distincts pour les Maîtres d'Ouvrage (Clients) et les Partenaires/Entreprises de travaux.
- **Fiches Détaillées** : Matricules fiscaux, adresses avec liens Google Maps, coordonnées complètes.
- **Historique** : Visualisation immédiate de tous les projets liés à un client ou une entreprise depuis sa fiche.

---

## 🛒 5. Achats & Dépenses
Contrôle des coûts opérationnels et frais généraux.
- **Catégorisation** : Classement des dépenses (Matériel, Logiciels, Abonnements, etc.).
- **Statuts de Paiement** : Suivi des factures fournisseurs à payer vs payées.
- **Export Comptable** : Exportation de la liste filtrée en format CSV pour une intégration facile dans vos outils comptables.

---

## 👨‍💼 6. Salaires & RH
Gestion du capital humain et des absences.
- **Salaires** : Historique mensuel des paiements incluant le Net, les Primes, les Tickets Resto et le Carburant.
- **RH (Congés & Absences)** : 
    - Calcul automatique des soldes de congés restants sur la base du droit annuel.
    - Suivi des arrêts maladie avec archivage des justificatifs.
    - Système de validation des demandes (En attente, Validé, Refusé).

---

## ⚙️ 7. Paramètres, Sécurité & Multi-Entités
Le cœur de la configuration du bureau.

### 🏢 Profil du Bureau & Logos
- **Gestion Multi-Entités** : Gérez plusieurs bureaux ou succursales (ex: Bureau Tunis, Bureau Sfax) au sein de la même interface.
- **Logos Personnalisés** : Chaque entité peut avoir son propre logo. Une fois téléversé dans les paramètres, il remplace l'icône par défaut dans la barre latérale et l'en-tête pour une identification visuelle immédiate.

### 🔐 Gestion des Utilisateurs & Permissions
- **Changement d'Utilisateur** : L'avatar en haut à droite permet de basculer instantanément entre les profils (simulant une déconnexion/reconnexion).
- **Accès aux Entités** : Un utilisateur peut être restreint à une seule entreprise ou avoir accès à plusieurs. 
    - *Note* : Le sélecteur d'entité dans le header ne s'affiche que si l'utilisateur a accès à au moins deux entreprises.
- **Permissions Granulaires** : Activez ou désactivez l'accès aux modules (ex: un technicien ne verra pas les "Salaires" ou les "Achats" si la permission n'est pas cochée).

---

## 🛠️ 8. Outils Transverses & UX
- **Recherche Globale (⌘K / Ctrl+K)** : Palette de commande pour naviguer instantanément vers un projet, un client ou un module.
- **Mode Confidentialité (👁️)** : Masquage instantané de toutes les données financières sensibles (`*****`) sur tous les écrans (Dashboard, Tableaux, Modals).
- **Gestion des Exercices** : Séparation stricte des données par année fiscale. Les Super Admins peuvent ajouter de nouvelles années ou supprimer les anciens exercices.
- **Tableaux Resizables** : Ajustez la largeur des colonnes et masquez celles qui ne vous sont pas utiles via le menu de configuration des colonnes.