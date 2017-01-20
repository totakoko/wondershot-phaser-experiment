# Séquencement des cas d'utilisation


## Écran de sélection des joueurs

4 pad maximum
Lorsqu'un pad est connecté, on active ses touches,
Lorsqu'il appuie sur A, il s'enregistre pour le match.
Lorsqu'il appuie sur B, il quitte le match.

Puis le match commence.



## Un joueur se connecte


- on charge l'écran de sélection des joueurs
- on écoute alors les événements des différents pad
- dès qu'un pad presse une touche, on active le joueur correspondant
- lorsque tous les joueurs sont prêts, on charge l'arène
- sur l'arène chaque pad est affecté à la direction d'un joueur


## Initialisation du ScoreBoard

Il est initialisé avec les joueurs actifs



## Projectiles


Lorsqu'un projectile touche une cible, l'arme est automatiquement rechargée.

Etat d'une arme :

- ready
- reloading
- projectile_shot



TODO, faire gérer le projetile par l'arme comme il n'y a qu'un seule projectile et que l'arme se déplace avec le projectile
faire en sorte que toutes les entités puissent être appelées dans la loop pour debug render (game.stage.add/remove (avec un id))
