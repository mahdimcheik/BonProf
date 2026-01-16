# 📚 BonProf - Plateforme de Soutien Scolaire

> **Statut:** 🚧 En construction

BonProf est une plateforme moderne de soutien scolaire conçue pour connecter professeurs et élèves dans un environnement d'apprentissage intégré et efficace. [Bonprof.fr](https://bonprof.fr)

## 🎯 À propos

BonProf est une solution complète de soutien scolaire qui facilite la mise en relation entre enseignants et apprenants. La plateforme offre un écosystème complet pour gérer l'ensemble du parcours d'apprentissage, de la réservation de cours au suivi pédagogique.

### 👥 Pour qui ?

- **Professeurs** : Gestion de leur emploi du temps, suivi de leurs élèves, partage de ressources pédagogiques
- **Élèves** : Réservation de cours, accès aux documents partagés, suivi de leur progression

## ✨ Ce qui nous différencie

BonProf se distingue des autres plateformes de soutien scolaire par son approche tout-en-un :

### 🔑 Fonctionnalités Clés Intégrées

1. **📅 Gestion des Créneaux**
   - Système de planification intelligent avec calendrier interactif
   - Visualisation en temps réel des disponibilités
   - Synchronisation automatique des emplois du temps

2. **💳 Paiement Intégré**
   - Gestion complète des transactions
   - Suivi des paiements et facturation automatisée
   - Sécurité et transparence financière

3. **📊 Suivi de Cours**
   - Tableau de bord de progression personnalisé
   - Historique complet des sessions
   - Statistiques et analyses de performance

4. **📁 Partage de Documents**
   - Espace de partage sécurisé entre professeur et élève
   - Bibliothèque de ressources pédagogiques
   - Gestion des devoirs et corrections

## 🛠️ Technologies Utilisées

### Frontend

#### Framework Principal
- **Angular 20** - Framework moderne de développement web
- **TypeScript 5.8.3** - Langage de programmation typé

#### UI/UX
- **PrimeNG 20** - Bibliothèque de composants UI riches
- **PrimeUI Themes** - Système de thèmes personnalisables
- **TailwindCSS 4.1** - Framework CSS utility-first
- **PrimeIcons 7.0** - Bibliothèque d'icônes

#### Bibliothèques Fonctionnelles
- **RxJS 7.8** - Programmation réactive
- **Luxon 3.7** - Gestion des dates et heures
- **Chart.js 4.4** - Visualisation de données et graphiques
- **Quill 2.0** - Éditeur de texte riche
- **MapLibre GL 5.15** - Cartes interactives

#### Composants Spécialisés
- **Syncfusion Schedule 31.2** - Gestion avancée de calendrier
- **Angular CDK 20** - Kit de développement de composants
- **DOMPurify 3.3** - Sécurisation du contenu HTML

#### Outils de Développement
- **ESLint 9.30** - Linter pour qualité du code
- **Prettier 3.6** - Formatage automatique du code
- **ng-openapi 0.2** - Génération automatique du client API
- **Karma & Jasmine** - Tests unitaires

### Backend

- **.NET 8.0** - Framework backend actuel
- **Migration prévue vers .NET 10** - Une fois la version stabilisée et largement supportée par l'écosystème

### Architecture

- **API RESTful** - Communication frontend/backend
- **OpenAPI** - Documentation et génération automatique d'API
- **Docker** - Containerisation de l'application

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (version LTS recommandée)
- npm ou yarn
- Angular CLI 20

### Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Générer le client API
npm run gen-api

# Lancer l'application en mode développement
npm start
```

### Scripts Disponibles

```bash
npm start          # Démarre le serveur de développement
npm run dev        # Démarre avec HTTPS (port 4201)
npm run build      # Build de développement
npm run build:prod # Build de production
npm run format     # Formater le code avec Prettier
npm run gen-api    # Générer le client API depuis OpenAPI
```

## 📦 Build et Déploiement

### Build de Production

```bash
npm run build:prod
```

Les fichiers de build seront générés dans le dossier `dist/`.

### Docker

Un `Dockerfile` et une configuration `nginx.conf` sont inclus pour faciliter le déploiement en conteneur.

```bash
# Build de l'image Docker
docker build -t bonprof .

# Lancer le conteneur
docker run -p 80:80 bonprof
```

## 🔐 Sécurité

- Authentification et autorisation intégrées
- Protection CSRF
- Sanitisation des entrées utilisateur avec DOMPurify
- Communication HTTPS en production

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 💻 Desktop
- 📱 Tablettes
- 📱 Smartphones

## 🤝 Contribution

Ce projet est actuellement en développement. Les contributions seront bientôt ouvertes.

## 📄 Licence

[À définir]

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter.

---

**Note:** Ce projet est en développement actif. De nouvelles fonctionnalités sont ajoutées régulièrement.
