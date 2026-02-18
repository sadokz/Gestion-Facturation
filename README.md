# Système de Gestion pour Bureau d'Études Ingénierie

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise.

---

## 📊 1. Tableau de Bord (Dashboard)
Le centre de pilotage de votre activité, entièrement personnalisable.
- **Personnalisation** : Via l'icône ⚙️ en haut à droite, vous pouvez choisir quels indicateurs afficher, réorganiser les graphiques par glisser-déposer et ajuster la largeur des blocs (25%, 50%, 75% ou 100%).
- **Indicateurs (KPIs)** : Total Contrats, Facturé, Reste à Facturer, Achats, CNSS, Salaires, Chiffre d'affaires encaissé et Bénéfice Réel.

---

## 🏗️ 2. Projets & Facturation
Gestion du cycle de vie des contrats et suivi rigoureux des paiements.
- **Modes de Vue ("Mes Vues")** : Vous pouvez créer des configurations de colonnes personnalisées (ex: "Vue Financière", "Vue Simplifiée"). Ces vues sont sauvegardées et accessibles via le bouton "Modes de vue".
- **Suivi des Paiements** : Chaque projet peut être étendu pour afficher l'historique détaillé des factures émises, leur statut (Payé, En attente) et les documents joints (PDF).

---

## 👷 3. Suivi Technique des Projets
Coordination technique et suivi de l'avancement physique des chantiers.
- **Modes de Vue** : Personnalisez l'affichage pour vous concentrer sur les intervenants (Architecte, Bureau de contrôle) ou sur l'avancement (Phases, Indices).
- **Interventions** : Enregistrez chaque réunion, envoi de plan ou visite de chantier avec compte-rendu et justificatif.
- **Gestion des Contacts** : Liez des responsables spécifiques du client ou de l'entreprise de travaux à chaque projet pour un accès rapide à leurs coordonnées.

---

## 👥 4. Annuaires (Clients & Entreprises)
Gestion des tiers et de leurs contacts.
- **Segmentation** : Deux annuaires distincts pour les Maîtres d'Ouvrage (Clients) et les Partenaires/Entreprises de travaux.
- **Modes de Vue** : Adaptez l'affichage selon vos besoins (Coordonnées complètes, Matricules fiscaux, etc.).
- **Responsables** : Chaque entité possède sa propre liste de contacts avec rôles et coordonnées directes.

---

## 🛒 5. Achats & Dépenses
Contrôle des coûts opérationnels.
- **Modes de Vue** : Filtrez et affichez les colonnes pertinentes pour votre comptabilité (Catégories, Montants HT/TTC, Statuts de paiement).
- **Export** : Possibilité d'exporter la liste filtrée en format CSV pour intégration comptable.

---

## 👨‍💼 6. Salaires & RH
Gestion du capital humain et des absences.
- **Salaires** : Suivi des employés, de leurs contrats (CDI, SIVP, etc.) et historique mensuel des paiements (Net, Primes, Tickets Resto).
- **RH (Congés)** : Calcul automatique des soldes de congés restants, suivi des maladies et gestion des justificatifs d'absence.
- **Modes de Vue** : Basculez entre une vue "Contrats" et une vue "Financière" pour les salaires.

---

## 🛠️ 7. Outils Transverses & UX
- **Modes de Vue Personnalisés** : Disponible sur TOUS les modules. Permet de choisir exactement quelles colonnes afficher, de nommer cette configuration et de la retrouver en un clic.
- **Recherche Globale (Ctrl+K)** : Palette de commande pour naviguer instantanément ou rechercher un élément précis.
- **Mode Confidentialité (👁️)** : Masquage instantané de toutes les données financières sensibles (`*****`) pour travailler en espace partagé.
- **Gestion des Exercices** : Séparation stricte des données par année fiscale (2025, 2026, etc.).
- **Multi-Entités** : Gérez plusieurs bureaux ou succursales au sein de la même interface.

---

## ⚙️ 8. Paramètres & Sécurité (Gestion des Utilisateurs)
Le module de paramètres permet de configurer les accès de manière extrêmement précise :

### Gestion des Utilisateurs
Pour chaque collaborateur, vous pouvez définir :
1.  **Identifiants** : Nom, Email et Mot de passe.
2.  **Accès aux Entités (Nouveau)** : Une liste à cocher permet de restreindre l'utilisateur à certaines entreprises uniquement. S'il n'est pas coché pour une entité, il ne verra aucun projet, achat ou salaire lié à celle-ci.
3.  **Permissions Modules** : Activez ou désactivez l'accès aux onglets spécifiques (ex: un technicien peut voir le "Suivi Technique" mais pas les "Salaires").

### Visibilité Globale
- **Activation des Modules** : Possibilité de masquer des modules entiers pour l'ensemble du bureau (ex: désactiver le module "Comptabilité" s'il n'est pas utilisé).
- **Profil du Bureau** : Configuration des informations légales (Nom, Matricule Fiscal, Adresse) qui servent de base au système.