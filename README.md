# WellFollowed

Ce projet utilise [LoopBack](http://loopback.io).

### Langage

Cette est écrite en [Node.js](https://nodejs.org/), il est donc essentiel de l'installer dans sa version 5.5.0, ainsi que [npm](https://www.npmjs.com/).

### Installation

Dans une fenêtre de commande, exécuter les lignes suivantes :
```
npm install -g gulp
npm install -g bower
npm install
bower install
```

**Très important** Il est également nécessaire de créer le dossier ```/srv/storage/wellfollowed/experiments``` avec les droits nécessaire pour que l'utilisateur exécutant Node.js puisse lire et écrire dans ce dernier.

### Lancement

Pour lancer le serveur, ouvrir une fenêtre de commande et taper :
```
node .
```

Pour compiler l'application cliente Angular, dans une fenêtre de commande, exécuter :
```
gulp bower
gulp resources
gulp
```


