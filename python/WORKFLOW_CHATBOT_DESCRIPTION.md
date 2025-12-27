# Description du Workflow du Chatbot E-Bank

## Vue d'ensemble

Le workflow du chatbot de l'application E-Bank suit une architecture modulaire et itérative, permettant aux utilisateurs de naviguer de manière intuitive à travers différentes catégories de questions et d'obtenir des réponses détaillées selon leurs besoins. Le système est conçu pour offrir une expérience utilisateur fluide avec la possibilité de poursuivre la conversation ou de la terminer à tout moment.

## Structure du Workflow

### 1. Phase d'Initialisation

Le processus débute par un **message de bienvenue** qui accueille l'utilisateur et l'oriente vers l'interface du chatbot. Ce message initial sert d'introduction et prépare l'utilisateur à interagir avec le système d'assistance virtuelle.

### 2. Menu Principal (Menu Général)

Après le message de bienvenue, l'utilisateur accède au **menu général**, qui constitue le point central de navigation. Ce menu présente plusieurs catégories principales permettant à l'utilisateur de sélectionner le domaine d'assistance souhaité :

- **Authentification et Connexion** : Questions relatives à la connexion, à la récupération de mot de passe, à la création de compte, et aux problèmes d'accès
- **Comptes** : Informations sur la gestion des comptes bancaires, la consultation des soldes, les RIB, et l'historique des opérations
- **Virements** : Assistance concernant les transferts d'argent, les procédures de virement, les limites, et la résolution de problèmes liés aux transactions
- **Choix Multiples** : Catégories supplémentaires permettant d'accéder à d'autres fonctionnalités et services bancaires

### 3. Navigation par Catégorie

Chaque catégorie du menu principal redirige l'utilisateur vers un **sous-menu spécialisé** contenant des questions spécifiques à ce domaine :

#### 3.1. Authentification et Connexion
Le menu des questions d'authentification et de connexion propose un ensemble de questions couvrant :
- Les procédures de connexion
- La récupération des identifiants
- La création de compte (via agent de guichet)
- La résolution des problèmes d'accès
- La gestion de la sécurité des comptes

**Note importante** : Chaque question de cette catégorie possède sa propre réponse personnalisée. Au total, cette section comprend **5 réponses distinctes**, chacune adaptée à une question spécifique d'authentification ou de connexion.

#### 3.2. Comptes
Le menu des questions sur les comptes permet d'accéder à des informations concernant :
- La consultation des soldes
- L'obtention des RIB
- La gestion de plusieurs comptes
- L'historique des opérations
- Le statut des comptes (ouvert, bloqué, fermé)

Chaque question dispose d'une réponse détaillée et personnalisée.

#### 3.3. Virements
Le menu des questions sur les virements couvre :
- Les procédures d'effectuation de virement
- Les informations requises pour un virement
- Les frais et délais
- L'annulation de virements
- La résolution des problèmes de virement

Chaque question possède sa propre réponse spécifique.

#### 3.4. Choix Multiples
Les menus de choix multiples offrent un accès à d'autres catégories de services et fonctionnalités, permettant une navigation étendue dans l'écosystème bancaire.

### 4. Génération des Réponses

Après la sélection d'une question dans l'un des sous-menus, le système génère une **réponse personnalisée** adaptée à la question choisie. Il est important de noter que le nœud "Réponse selon la question choisie" représente en réalité **plusieurs réponses distinctes**, et non une réponse générique :

- Pour la catégorie **Authentification et Connexion** : **5 réponses différentes**, chacune correspondant à une question spécifique
- Pour la catégorie **Comptes** : Plusieurs réponses personnalisées selon la question sélectionnée
- Pour la catégorie **Virements** : Réponses détaillées adaptées à chaque type de question sur les virements
- Pour les autres catégories : Réponses spécifiques selon le contexte

Chaque réponse est conçue pour être précise, informative et adaptée au contexte de la question posée par l'utilisateur.

### 5. Proposition de Poursuite

Une fois la réponse fournie, le système affiche un **message offrant le choix de poursuivre** la conversation. Ce mécanisme permet à l'utilisateur de décider s'il souhaite :
- Poser une autre question
- Explorer une autre catégorie
- Terminer la session

### 6. Décision de Continuation

L'utilisateur est confronté à un **choix binaire** :
- **Oui** : L'utilisateur souhaite continuer → Le workflow retourne au menu général, permettant une nouvelle sélection de catégorie et une nouvelle interaction
- **Non** : L'utilisateur souhaite terminer → Le processus se termine, mettant fin à la session de chat

### 7. Fin du Processus

Lorsque l'utilisateur choisit de ne pas poursuivre, le workflow atteint son point final, concluant l'interaction avec le chatbot.

## Caractéristiques du Workflow

### Avantages de l'Architecture

1. **Modularité** : Chaque catégorie est indépendante, facilitant la maintenance et l'ajout de nouvelles fonctionnalités
2. **Flexibilité** : L'utilisateur peut naviguer librement entre les différentes catégories
3. **Itérativité** : La boucle de retour au menu général permet des sessions de conversation prolongées
4. **Personnalisation** : Chaque question dispose d'une réponse spécifique et détaillée
5. **Contrôle utilisateur** : L'utilisateur décide à tout moment de poursuivre ou de terminer la conversation

### Points Clés du Design

- **Navigation intuitive** : Structure hiérarchique claire (Menu général → Sous-menu → Réponse)
- **Expérience utilisateur optimisée** : Possibilité de revenir au menu principal après chaque réponse
- **Couvre tous les aspects** : Le workflow couvre les principales fonctionnalités de l'application bancaire
- **Extensibilité** : L'architecture permet l'ajout facile de nouvelles catégories et questions

## Conclusion

Ce workflow représente une architecture robuste et évolutive pour le chatbot E-Bank, offrant aux utilisateurs un accès structuré et intuitif à l'information bancaire. La modularité du système et la personnalisation des réponses garantissent une expérience utilisateur de qualité, tout en permettant une maintenance et une évolution faciles de la base de connaissances du chatbot.



