# Système de Gestion pour Bureau d'Études Ingénierie (ERP)

Cette application est une solution ERP complète conçue spécifiquement pour les bureaux d'études. Elle centralise la gestion financière, opérationnelle et humaine pour offrir une vision claire de la rentabilité réelle de l'entreprise.

---

## 📊 1. Pilotage Financier & Performance
Le centre de pilotage de votre activité financière.
- **Tableau de Bord (KPIs)** : Suivi en temps réel des Contrats HT, Facturé HT, Reste à Facturer, Achats, Salaires et Bénéfice Réel.
- **Flux Mensuel** : Comparaison graphique entre revenus encaissés (Ventes TTC) et charges (Achats + Salaires).
- **Mode Confidentialité (Privacy)** : Un bouton "œil" permet de masquer instantanément tous les montants financiers lors de présentations ou de partages d'écran.

---

## 👷 2. Dashboard & Suivi Technique
Outil de pilotage opérationnel pour les chefs de projets et la direction technique.
- **Dashboard Technique** : Vue d'ensemble du nombre de projets par phase (Études, Travaux, Terminés).
- **Gestion des Blocages** : Identification prioritaire des projets dont le statut technique est "Bloqué" (affichés en rouge pour une action immédiate).
- **Suivi Détaillé** : Coordination des intervenants (Architectes, Bureaux de contrôle, Entreprises) et journal d'interventions (Réunions, PV, Envois).
- **Progression Physique** : Distinction entre l'avancement des études et l'avancement des travaux sur chantier.

---

## 🏗️ 3. Projets & Facturation
Gestion rigoureuse du cycle de vie des contrats.
- **Suivi HT/TTC** : Calcul automatique des montants incluant les avenants et les taux de TVA spécifiques.
- **Historique de Facturation** : Gestion des situations, des retenues à la source et archivage des justificatifs (Factures, Décharges).
- **Modes de Vue Personnalisables** : Possibilité de créer et sauvegarder des configurations de colonnes spécifiques (ex: Vue HT, Vue TTC, Vue Statut).

---

## 👥 4. Ressources Humaines & Salaires
Gestion du capital humain et des coûts fixes.
- **Salaires** : Historique des paiements incluant primes, tickets restaurant et frais de carburant.
- **RH (Congés)** : Suivi des droits aux congés, des absences pour maladie et des validations en attente.

---

## 🛡️ 5. Administration & Sécurité (Super Admin)
Le panneau Super Admin permet un contrôle total sur l'infrastructure de l'application :
- **Gestion Multi-Entités** : Possibilité de gérer plusieurs bureaux d'études ou entités juridiques distinctes.
- **Activation/Désactivation** : Une entité désactivée devient inaccessible en modification (Lecture seule) et ses utilisateurs sont automatiquement suspendus.
- **Contrôle d'Accès Granulaire** : Définition de rôles types et attribution de permissions par module (Finances, Technique, RH) et par entité.

---

## 💾 6. Gestion des Données & Sauvegarde
Situé dans l'onglet **Paramètres**, ce module assure la pérennité de vos informations :
- **Export JSON** : Génère un fichier de sauvegarde complet contenant tous les utilisateurs, rôles, entités et préférences système.
- **Import JSON** : Permet de restaurer l'intégralité d'une configuration ou de transférer les données vers un autre environnement de travail.
- **Export CSV** : Disponible dans les modules Achats et Projets pour des analyses externes (Excel).

---

## 🛠️ Stack Technique
- **Frontend** : React 19, TypeScript, Vite.
- **UI/UX** : Tailwind CSS, Shadcn/UI, Lucide Icons.
- **Graphiques** : Recharts.
- **Gestion d'état** : Context API (Year, Company, User, Navigation, Dashboard, Privacy).
- **Drag & Drop** : @dnd-kit pour la réorganisation des tableaux et du dashboard.