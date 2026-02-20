# Système de Gestion Intégré (ERP) pour Bureau d'Études Ingénierie

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise et assurer un suivi technique rigoureux des chantiers.

---

## 👑 1. Administration Système (Super Admin)
Le module **Super Admin** est le cœur de contrôle global de l'infrastructure multi-bureaux.

### 🏢 Gestion des Entités (Bureaux d'Études)
- **Activation / Désactivation** : Le Super Admin peut suspendre l'accès à une entité juridique complète.
- **Logique de Sécurité Automatique** : 
    - La désactivation d'une entité **suspend automatiquement** tous les utilisateurs qui n'ont accès qu'à cette structure.
    - L'onglet **Paramètres** est automatiquement masqué pour l'entité désactivée afin d'éviter toute modification légale.
- **Personnalisation Visuelle** : Attribution de logos spécifiques par entité, personnalisant instantanément l'interface (Sidebar et Header) pour les collaborateurs de ce bureau.

### 🛠️ Configuration des Modules
- **Visibilité à la carte** : Le Super Admin définit quels onglets sont visibles pour chaque entité (ex: masquer le module "Comptabilité" pour une filiale de service).
- **Gestion des Exercices** : Ajout ou suppression globale des années fiscales disponibles dans le sélecteur d'exercice.

### 🎭 Profilage des Rôles Globaux
- **Modèles de Permissions** : Création de profils types (Gérant, Ingénieur, Comptable) avec des permissions modulaires.
- **Héritage Strict** : Les utilisateurs héritent des permissions de leur rôle. Cela garantit qu'une modification du rôle "Ingénieur" s'applique instantanément à tous les ingénieurs du système.

---

## 🔐 2. Sécurité & Confidentialité
L'application repose sur une architecture de sécurité à plusieurs niveaux.

### 👥 Hiérarchie des Accès
1. **Super Admin** : Contrôle total, gestion des entités, des rôles et de la visibilité des modules.
2. **Gérant / Administrateur** : Accès complet aux données financières et à la gestion des utilisateurs de son entité.
3. **Utilisateur Standard** : Accès limité aux modules opérationnels (Projets, Suivi Technique) selon son rôle.

### 👁️ Mode Confidentialité (Mode Invité / Présentation)
Un bouton "œil" dans l'en-tête permet de basculer instantanément en **Mode Privé** :
- Toutes les données financières sensibles (montants HT/TTC, salaires, bénéfices) sont remplacées par des astérisques (`*****`).
- Idéal pour travailler en espace partagé, faire une démonstration technique à un client ou projeter l'écran en réunion sans divulguer la rentabilité du bureau.

---

## 📊 3. Tableau de Bord (Pilotage Stratégique)
Entièrement personnalisable par chaque utilisateur pour son propre confort.
- **Interface Drag & Drop** : Réorganisez l'ordre des indicateurs (KPIs) et des graphiques.
- **Mise en page flexible** : Ajustez la largeur de chaque bloc (25% à 100%) pour prioriser les visuels.
- **Analyse des Flux** : Graphique comparatif mensuel entre les revenus (encaissés/en attente) et les charges (achats/salaires).

---

## 🏗️ 4. Projets & Gestion Commerciale
Suivi complet du cycle de vie des contrats, de la signature au règlement définitif.
- **Modes de Vue ("Mes Vues")** : Système permettant de sauvegarder des configurations de colonnes (ex: "Vue Financière", "Vue Simplifiée").
- **Gestion des Avenants** : Calcul automatique du nouveau total contractuel HT/TTC après modifications.
- **Suivi de Facturation** : Historique détaillé incluant les retenues à la source et les modes de paiement.

---

## 👷 5. Suivi Technique & Coordination
Outil dédié aux ingénieurs pour la gestion de l'exécution et du suivi de chantier.
- **Journal d'Interventions** : Chronologie des réunions, relevés, envois/réceptions de plans.
- **Double Avancement** : Suivi distinct de l'avancement des **Études** (interne) et de l'avancement physique des **Travaux** (chantier).
- **Liaison de Contacts** : Sélection ciblée des responsables chez le client ou l'entreprise de travaux pour chaque projet.

---

## 👨‍💼 6. Ressources Humaines & Salaires
- **Dossier Employé** : Centralisation des informations contractuelles, CIN, CNSS et documents numérisés.
- **Gestion des Absences** : Calcul automatique des soldes de congés et suivi des arrêts maladie avec justificatifs.
- **Historique des Paiements** : Suivi mensuel incluant le Net, les Primes, les Tickets Resto et les frais de Carburant.

---

## 🛠️ 7. Fonctionnalités Transverses (UX/UI)
- **Recherche Globale (⌘K / Ctrl+K)** : Palette de commande pour naviguer vers un projet, un client ou un employé.
- **Export Comptable** : Exportation de toutes les listes au format CSV.
- **Interface Adaptative** : Support complet du mode sombre (Dark Mode) et design responsive.