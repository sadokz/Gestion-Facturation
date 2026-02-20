# Système de Gestion Intégré (ERP) pour Bureau d'Études Ingénierie

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise et assurer un suivi technique rigoureux des chantiers.

---

## 📊 1. Tableau de Bord (Pilotage Stratégique)
Le centre de pilotage est entièrement personnalisable pour s'adapter aux besoins de chaque profil (Gérant vs Technicien).
- **Personnalisation par Glisser-Déposer** : Réorganisez l'ordre des indicateurs (KPIs) et des graphiques via une interface intuitive.
- **Mise en page flexible** : Ajustez la largeur de chaque bloc (25%, 50%, 75% ou 100%) pour prioriser les informations visuelles.
- **Indicateurs Clés (HT)** : Visualisation en temps réel du Total Contrats, Facturé, Reste à Facturer, Achats, CNSS, Salaires, Chiffre d'affaires encaissé et Bénéfice Réel.
- **Analyse des Flux** : Graphique comparatif mensuel entre les revenus (encaissés/en attente) et les charges (achats/salaires).

---

## 🏗️ 2. Projets & Gestion Commerciale
Suivi complet du cycle de vie des contrats, de la signature au règlement définitif.
- **Modes de Vue ("Mes Vues")** : Système exclusif permettant de sauvegarder des configurations de colonnes (ex: "Vue Financière", "Vue Simplifiée"). Ces vues sont persistantes et modifiables.
- **Gestion des Avenants** : Prise en compte des modifications contractuelles avec calcul automatique du nouveau total HT/TTC.
- **Suivi de Facturation** : Historique détaillé des factures émises par projet, incluant la gestion des retenues à la source et des modes de paiement.
- **Tableaux Dynamiques** : Colonnes redimensionnables, triables et réorganisables par simple glisser-déposer.

---

## 👷 3. Suivi Technique & Coordination
Outil dédié aux ingénieurs pour la gestion de l'exécution et du suivi de chantier.
- **Journal d'Interventions** : Enregistrement chronologique des réunions, relevés, envois/réceptions de plans et tâches.
- **Gestion Documentaire** : Archivage des PV de réunion, décharges et comptes-rendus directement liés aux événements techniques.
- **Double Avancement** : Suivi distinct de l'avancement des études (interne) et de l'avancement physique des travaux (chantier).
- **Liaison de Contacts** : Sélection ciblée des responsables chez le client ou l'entreprise de travaux pour chaque projet spécifique.

---

## 👨‍💼 4. Ressources Humaines & Salaires
Gestion centralisée du capital humain et des coûts salariaux.
- **Dossier Employé** : Centralisation des informations contractuelles, CIN, CNSS et documents numérisés.
- **Gestion des Absences** : 
    - Calcul automatique des soldes de congés restants sur la base du droit annuel.
    - Suivi des arrêts maladie avec archivage des justificatifs.
    - Workflow de validation (En attente, Validé, Refusé).
- **Historique des Paiements** : Suivi mensuel incluant le Net, les Primes, les Tickets Resto et les frais de Carburant.

---

## 🔐 5. Sécurité, Rôles & Permissions
Le système repose sur une architecture de sécurité stricte pour protéger les données sensibles.

### 👥 Hiérarchie des Rôles
Les accès sont définis par trois profils types :
1. **Gérant** : Accès total à tous les modules, gestion financière complète et administration des utilisateurs.
2. **Responsable Technique** : Focus sur les projets et le suivi technique. Accès restreint aux données financières sensibles (salaires, bénéfices globaux).
3. **Responsable Direction** : Accès administratif et RH, gestion des achats et des clients, sans modification des paramètres techniques profonds.

### 🛡️ Système de Permissions Héritées
- **Verrouillage des Permissions** : Les permissions ne sont plus modifiables individuellement par utilisateur. Elles sont strictement héritées du **Rôle** sélectionné pour garantir la cohérence de la politique de sécurité.
- **Contrôle d'Accès (ACL)** : Seuls les utilisateurs ayant le rang de **Gérant** ou **Super Admin** peuvent accéder au menu de gestion des utilisateurs.
- **Mode Confidentialité (👁️)** : Un bouton "œil" dans l'en-tête permet de masquer instantanément toutes les données financières (`*****`) sur tous les écrans, idéal pour les présentations ou le travail en espace partagé.

---

## 🏢 6. Multi-Entités & Super Administration
Conçu pour les structures gérant plusieurs bureaux ou filiales.
- **Gestion Multi-Bureaux** : Basculez instantanément entre différentes entités juridiques.
- **Logos Personnalisés** : Chaque entité peut uploader son propre logo, qui personnalise alors l'interface (Sidebar et Header).
- **Configuration Super Admin** : 
    - Activation/Désactivation des modules par entité (ex: masquer le module "Comptabilité" pour une filiale spécifique).
    - Gestion globale des exercices fiscaux (ajout/suppression d'années).
    - Création et modification des profils de Rôles globaux.

---

## 🛠️ 7. Fonctionnalités Transverses (UX/UI)
- **Recherche Globale (⌘K / Ctrl+K)** : Palette de commande ultra-rapide pour naviguer vers un projet, un client ou un employé sans quitter le clavier.
- **Export Comptable** : Exportation de toutes les listes (Achats, Ventes) au format CSV.
- **Interface Adaptative** : Support complet du mode sombre (Dark Mode) et design responsive pour tablettes.
- **Notifications (Toasts)** : Confirmation visuelle immédiate pour chaque action effectuée.