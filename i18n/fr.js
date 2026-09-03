'use strict';

registerLocale('fr', {
  meta: { name: 'français' },
  site: {
    documentTitle: "Institut des technologies web non productives piloté par l’IA",
    eyebrow: 'AI-DRIVEN NON-PRODUCTIVE WEB TECHNOLOGY LAB.',
    officialLabel: "NOM OFFICIEL DE L’INSTITUT",
    officialName: "Institut des technologies web non productives piloté par l’IA",
    tagline: "Des idées absurdement inutiles, une implémentation digne de la production.",
    brandAlias: 'Muda Engineering Lab', languageLabel: 'Langue', bgmStart: '▶ BGM START', bgmStop: '■ BGM STOP',
    badges: ['🧪 10 PROJETS DE RECHERCHE', '🎮 IMPOSSIBLE DE GAGNER SANS JOUER', '🔊 ACCORDS À PUISSANCE MAXIMALE', '🎉 FANFARE APRÈS AVOIR TOUT TERMINÉ', '📦 CSS ET JS SÉPARÉS PAR JEU'],
    aboutTitle: 'À propos de ce laboratoire',
    about: [
      "Muda Engineering Lab est un site parodique inspiré de pratiques de travail inefficaces observées dans certains bureaux japonais des années 1980 aux années 2000.",
      "Documents papier, télécopieurs, sceaux hanko, longues réunions et circuits d’approbation complexes faisaient alors partie du quotidien de nombreux bureaux.",
      "Ce site exagère volontairement ces pratiques et les transforme en jeux grâce aux technologies web modernes, en consacrant beaucoup trop d’ingénierie à un travail merveilleusement inutile.",
      "Bien entendu, toutes les entreprises japonaises ne fonctionnaient pas ainsi. Il ne s’agit pas d’un document historique, mais d’une satire fictive qui revisite avec humour d’anciennes habitudes professionnelles.",
      "Aucune connaissance de la culture d’entreprise japonaise n’est nécessaire. Avant chaque jeu, une courte explication présente l’habitude professionnelle qui l’a inspiré."
    ],
    back: '← LISTE DES RECHERCHES', controlsPrefix: 'COMMANDES : ', researchNo: 'RESEARCH No.{number}'
  },
  common: {
    cultureNote: '🧪 FICHE DE RECHERCHE CULTURELLE No.{number}', parodyHeading: 'CE QUE CE JEU PARODIE', beginResearch: 'COMMENCER LA RECHERCHE',
    researchComplete: 'RESEARCH COMPLETE', researchCompleteJa: 'RECHERCHE TERMINÉE', researchSuccess: 'RECHERCHE RÉUSSIE',
    researchFailed: 'RESEARCH FAILED', researchFailedJa: 'ÉCHEC DE LA RECHERCHE', promptLabel: "DEMANDE INITIALE ADRESSÉE À L’IA",
    disclaimer: "Ce programme a été créé au fil de conversations avec une IA. Aucune API d’IA externe n’est utilisée pendant son exécution.",
    retry: 'RECOMMENCER LA RECHERCHE', retryFail: 'RÉESSAYER'
  },
  game01: {
    title: 'PRODUCTION — SURTOUT NE PAS APPUYER.exe', description: "Ignorez les 8 avertissements, puis réussissez un rollback d’urgence.", controls: 'CLIC / APPUI',
    culture: {
      heading: "LES PRATIQUES INFORMATIQUES DE L’ÉPOQUE",
      background: ["Des années 1980 aux années 2000, les systèmes informatiques d’entreprise étaient moins automatisés qu’aujourd’hui. Les changements en production pouvaient être risqués et la reprise dépendait souvent des ingénieurs connaissant le système.", "Modifier la production tard un vendredi, alors que les personnes compétentes étaient déjà parties ou sur le point de partir, est devenu un scénario cauchemardesque classique pour les ingénieurs informatiques."],
      parody: ["Avertissements, heure tardive, responsables absents, demande de changement non approuvée… Ce jeu exagère l’ingénieur qui ignore tous les signaux de danger et fonce en production.", "Même si le déploiement réussit, ne vous réjouissez pas trop vite."],
      punchline: "La véritable recherche commence après cela."
    },
    playing: {
      doNotPress: "N’APPUYEZ PAS", warnings: ['DÉPLOYER EN PRODUCTION', 'CONFIRMER ?', 'NOUS SOMMES VENDREDI', 'IL EST 17 H 48', 'LE RESPONSABLE EST PARTI', "L’ÉQUIPE DE SUPERVISION AUSSI", "LA DEMANDE DE CHANGEMENT N’EST PAS APPROUVÉE", 'DÉPLOYER QUAND MÊME'],
      warningHeadings: ["N’APPUYEZ PAS", 'LAISSEZ TOMBER', 'VRAIMENT ?', "C’EST VENDREDI", 'RENTREZ CHEZ VOUS', 'AUCUN RESPONSABLE', 'NON APPROUVÉ'],
      toldNotTo: "※ On vous avait pourtant dit de ne pas appuyer.", warningToast: 'AVERTISSEMENT {count}/8', passed: 'CONFIRMATION {count}/8 CONTOURNÉE', deploy: 'DEPLOY!!!', deploySuccess: 'DEPLOY SUCCESS', thought: '…VOUS Y AVEZ CRU ?', monitoring: 'ALERTE DE SUPERVISION 9999+', emergencyRollback: "ROLLBACK D’URGENCE {count}/6", rollback: 'ROLLBACK {count}/6', rollbackHelp: 'APPUYEZ 6 FOIS POUR REVENIR EN ARRIÈRE'
    },
    clear: 'Production restaurée. Cause : « Nous avons foncé sans réfléchir. »',
    prompt: "Crée un bouton de déploiement en production qui donne de plus en plus envie d’appuyer à mesure qu’on l’interdit. Intègre aussi le rollback final au jeu."
  },
  game02: {
    title: "DÉFENSE DU DÉPART À L’HEURE", description: 'Changez de voie et esquivez 12 obstacles pour quitter le bureau.', controls: '↑ ↓ / APPUI',
    culture: {
      heading: "LES HABITUDES DE BUREAU DE L’ÉPOQUE",
      background: ["Des années 1980 aux années 2000, les longues journées de travail étaient courantes dans de nombreux bureaux japonais. Même après l’heure officielle, il pouvait être difficile de partir lorsque responsables et collègues travaillaient encore.", "Au moment précis de rentrer, un responsable pouvait demander : « Vous avez une minute ? » ou « Juste cinq minutes ». Une nouvelle tâche ou réunion pouvait alors commencer.", "À partir des années 1990, le courrier électronique et la messagerie instantanée ont ajouté de nouvelles façons pour le travail de suivre les employés jusqu’au moment du départ."],
      parody: ["Responsables, e-mails urgents, demandes de revue et notifications deviennent des obstacles qui empêchent de partir à l’heure.", "Esquivez-en 12 et échappez-vous du bureau."],
      punchline: "Partir à l’heure est l’objectif. Probablement."
    },
    playing: { hud: 'ESQUIVÉS {dodges} / 12　HP {hp}', instruction: '↑ ↓ OU APPUYEZ SUR LA VOIE DU HAUT / DU BAS', obstacles: ['CHEF : « UNE MINUTE ? »', '99+ MESSAGES', 'E-MAIL URGENT', 'JUSTE 5 MINUTES', "SOIRÉE D’ÉQUIPE ?", 'UNE PETITE REVUE ?'], dodge: 'DODGE {count}/12' },
    clear: "DÉPART À L’HEURE RÉUSSI ! …Les messages continuent d’arriver.", failure: "Le responsable vous a intercepté. « Juste un point à vérifier… » commence.",
    prompt: "À l’heure du départ, esquivez « Vous avez une minute ? » sur trois voies. Le nombre d’esquives permet de terminer le jeu ; rester inactif ne doit pas fonctionner."
  },
  game03: {
    title: 'RINGI HANKO IMPACT', description: "Apposez le hanko sur 20 cases d’approbation lumineuses dans le bon ordre.", controls: 'GLISSER / CLIQUER',
    culture: {
      heading: "LE SYSTÈME JAPONAIS D’APPROBATION RINGI ET HANKO",
      background: ["Le Ringi est un système japonais dans lequel une proposition ou une demande circule entre les parties concernées pour être approuvée. Le Hanko est un sceau utilisé comme marque d’approbation."],
      parody: ["Ce jeu exagère fortement l’approbation à plusieurs niveaux en exigeant 20 sceaux pour acheter un câble USB à 980 yens (¥980).", "Apposez le hanko sur chaque case jaune et obtenez les 20 approbations."],
      punchline: "HANKO COMBO transforme une procédure ordinaire en attaque spéciale."
    },
    playing: {
      documentTitle: "DEMANDE D’ACHAT RINGI", request: 'DEMANDE : CÂBLE USB — ¥980', approval: 'APPROBATIONS {count} / 20', stampLabel: "Sceau d’approbation hanko", stamp: '承', hint: 'Faites glisser le hanko sur la case lumineuse, ou cliquez sur la case cible.',
      names: ['RESPONSABLE', 'CHEF DE SECTION', 'CHEF DE SERVICE', 'DIR. DE DIVISION', 'FINANCE', 'JURIDIQUE', 'IT INTERNE', 'AUDIT', 'SERVICES GÉNÉRAUX', 'ACHATS', 'SÉCURITÉ', 'PMO', 'ASSURANCE QUALITÉ', 'UNITÉ OPÉRATIONNELLE', 'ADMINISTRATION', 'RH', 'DIRECTION', 'SERVICE MYSTÈRE', 'SERVICE CONCERNÉ', 'APPROBATION FINALE'],
      wrongOrder: "ORDRE D’APPROBATION INCORRECT", combo: 'HANKO COMBO ×{count}'
    },
    clear: "APPROUVÉ : vous pouvez enfin acheter le câble USB à ¥980.", prompt: "Crée un jeu où le joueur ne fait qu’apposer, dans l’ordre, une multitude de hanko sur un formulaire ringi, avec des effets dignes d’une attaque spéciale."
  },
  game04: {
    title: 'RÉPONSE INFINIE AUX INCIDENTS', description: "Rétablissez 25 incidents avant l’épuisement du SLA.", controls: 'CLIC / APPUI',
    culture: { heading: "LES INCIDENTS INFORMATIQUES D’ENTREPRISE", background: ["L’exploitation informatique d’entreprise connaît bien les incidents, les SLA, les causes inconnues, les pannes impossibles à reproduire et les systèmes compris par une seule personne."], parody: ["Ce jeu les exagère sous la forme d’un jeu de clic rapide où les incidents non résolus font chuter le SLA. Rétablissez-en 25."], punchline: "Les incidents n’attendent pas que leur cause soit trouvée." },
    playing: { hud: 'RÉTABLIS {done} / 25　SLA {sla} %', open: 'OUVERTS {count} / 7', help: 'Cliquez sur les incidents rouges pour les rétablir. Après 5 secondes de répit, les incidents non résolus font fondre le SLA.', grace: 'RÉPIT INITIAL : {seconds} s　CLIQUEZ MAINTENANT !', incidents: ['ERREUR DE CONNEXION DB', "C’EST SÛREMENT LE DNS", 'CERTIFICAT EXPIRÉ', 'ÇA MARCHAIT HIER', 'ÇA MARCHE SUR MA MACHINE', 'IMPOSSIBLE À REPRODUIRE', 'CAUSE : INCONNUE'], recover: 'RECOVER {count}/25' },
    clear: 'Cause identifiée : conforme aux spécifications.', failure: "SLA 0 %. La rédaction du rapport d’incident commence.", prompt: "Crée un jeu de type tape-taupe où réparer des incidents en fait apparaître davantage et où les éléments non résolus réduisent le SLA."
  },
  game05: {
    title: 'ESQUIVE DES CHANGEMENTS DE PÉRIMÈTRE', description: 'Esquivez 20 changements avant de subir 3 impacts, puis publiez.', controls: '← → / APPUI',
    culture: { heading: 'LES CHANGEMENTS EN COURS DE DÉVELOPPEMENT', background: ["Pendant le développement, de nouvelles demandes, des modifications de spécifications et des extensions de périmètre peuvent continuer d’arriver."], parody: ["Les demandes soudaines et gênantes deviennent des objets qui tombent. Déplacez-vous à gauche et à droite pour en esquiver 20."], punchline: "Les exigences grandissent le plus vite juste avant la mise en production." },
    playing: { hud: 'ESQUIVÉS {dodges} / 20　HP {hp}', instruction: '← → OU APPUYEZ À GAUCHE / À DROITE', changes: ['MODIFIER LE TEXTE', 'DÉPLACER LE BOUTON', 'AJOUTER LE MOBILE', "PRÉVOIR L’INTERNATIONAL", "ON PEUT AJOUTER DE L’IA ?", 'CHANGER AUSSI LA DB', 'TOUT REVOIR DEPUIS LE DÉBUT'], avoid: 'AVOID {count}/20' },
    clear: 'MISE EN PRODUCTION RÉUSSIE ! …Le prochain changement est arrivé.', failure: 'Enseveli sous les changements. Le SPRINT 2 commence.', prompt: "Fais tomber des changements sur toute la largeur de l’écran pendant que le joueur se déplace à gauche et à droite. Chaque esquive réussie augmente la progression."
  },
  game06: {
    title: 'CRAFT SUR PAPIER QUADRILLÉ EXCEL', description: 'Coloriez uniquement les cellules du plan et terminez le château Excel.', controls: 'CLIC / APPUI',
    culture: { heading: "L’HABITUDE JAPONAISE DU PAPIER QUADRILLÉ EXCEL", background: ["Dans certains bureaux japonais, Excel est parfois utilisé comme du papier quadrillé : la largeur et la hauteur des cellules sont minutieusement ajustées pour créer formulaires, plans et mises en page."], parody: ["Coloriez les cellules selon le plan et terminez les 36 cellules requises. Cinq erreurs renvoient le travail en revue."], punchline: "Construisez le château Excel sans fusionner de cellules." },
    playing: { hud: 'CORRECT {ok} / {total}　ERREURS {wrong} / 5', heading: 'CRAFT EXCEL : PLAN QUADRILLÉ', hint: 'Passez au vert uniquement les cellules encadrées. Cinq erreurs déclenchent une revue.', cellLabel: 'Cellule {x},{y}', cell: 'CELL {count}/{total}' },
    clear: 'Château Excel achevé. La fusion des cellules est désormais interdite.', failure: "Écart par rapport au plan. Renvoyé en revue à l’expert Excel.", prompt: "Crée un défi absurdement ludique où le joueur colorie des cellules selon un plan en papier quadrillé Excel afin de construire un château."
  },
  game07: {
    title: 'GÉNÉRATEUR DE PROGRESSION À 100 %', description: 'Atteignez 100 % malgré les demandes de modification répétées.', controls: 'CLICS RAPIDES',
    culture: { heading: 'LA CULTURE DU POURCENTAGE DE PROGRESSION', background: ["Il arrive que le pourcentage de progression continue d’augmenter alors que le résultat concret du travail reste difficile à trouver."], parody: ["Cet appareil génère de la progression par clics répétés. Atteignez 100 % malgré les modifications demandées environ toutes les quatre secondes."], punchline: "Une progression à 100 % ne garantit pas qu’un résultat concret existe." },
    playing: { reviewIn: 'MODIFICATIONS DANS {seconds} s', generate: 'GÉNÉRER DE LA PROGRESSION', combo: 'COMBO ×{count}', hint: 'Cliquez rapidement. Des modifications sont demandées toutes les 4 secondes.', review: 'MODIFICATIONS DEMANDÉES ! -{loss} %' },
    clear: 'PROGRESSION : 100 %. Aucun résultat concret du travail n’a été trouvé.', prompt: "Crée un bouton qui augmente la progression à chaque clic, mais la réduit périodiquement lorsque des modifications sont demandées."
  },
  game08: {
    title: 'TEMPLE DU KUYŌ DES BUGS', description: 'Apaisez 15 bugs en fuite. Cinq évasions provoquent un échec.', controls: 'CLIC / APPUI',
    culture: {
      heading: 'LA TRADITION JAPONAISE DU KUYŌ',
      background: ["Au Japon, le kuyō est une tradition qui consiste à remercier et honorer avec respect les objets arrivés au terme de leur service.", "Des cérémonies existent notamment pour les aiguilles usagées et les poupées, afin de leur témoigner de la gratitude avant de leur dire adieu.", "En développement logiciel, un « bug » désigne bien sûr un défaut du programme."],
      parody: ["À Muda Engineering Lab, nous avons décidé de ne pas corriger les bugs, mais de leur offrir un kuyō au son du mokugyo, instrument de percussion bouddhique en bois.", "Cliquez sur les bugs en fuite et apaisez-en 15.", "Les bugs abandonnés s’échappent vers la production. Cinq évasions font échouer la recherche."],
      punchline: "Que chaque bug repose en paix."
    },
    playing: { hud: 'APAISÉS {done} / 15　ÉCHAPPÉS {escaped} / 5', output: 'PUISSANCE DU MOKUGYO 300 %', production: '🚨 PRODUCTION', instruction: 'Cliquez sur les 🐛 bugs et apaisez-les.', hint: 'Les bugs rouges fuient vers la production !', escaping: '🚨 FUITE VERS LA PRODUCTION', memorialized: 'REPOSE EN PAIX {done}/15', prevented: 'FUITE EMPÊCHÉE ! REPOSE EN PAIX {done}/15', escapeStart: '🚨 FUITE VERS LA PRODUCTION !', escaped: 'ÉVASION EN PRODUCTION ! {escaped}/5' },
    clear: 'Tous les bugs reposent en paix. Un nouveau bug a été détecté.', failure: "Cinq bugs se sont échappés en production. La réponse aux incidents passe avant le kuyō.", prompt: "Offre un kuyō aux bugs logiciels avec un mokugyo, instrument de percussion bouddhique en bois. Les bugs s’enfuient et chaque évasion rapproche la recherche de l’échec."
  },
  game09: {
    title: 'SIMULATEUR D’ÉVASION DE RÉUNION', description: 'Quittez la réunion trois fois pendant la fenêtre « Autre chose ? ».', controls: 'CLIC AU BON MOMENT',
    culture: {
      heading: "LES HABITUDES DE BUREAU DE L’ÉPOQUE",
      background: ["Des années 1980 aux années 2000, les réunions permettaient fréquemment aux entreprises japonaises de partager des informations et de coordonner des décisions entre de nombreux participants.", "À la fin d’une longue réunion, la personne qui l’animait pouvait demander : « Y a-t-il autre chose ? »", "Si personne ne répondait, la réunion pouvait enfin se terminer.", "Mais quelqu’un pouvait ajouter : « Juste un dernier point… », « À ce sujet… » ou « Une rapide mise à jour… », et la réunion continuait."],
      parody: ["L’instant où « Y a-t-il autre chose ? » apparaît est votre fenêtre de sortie.", "Appuyez sur QUITTER au bon moment et réussissez trois fois."], punchline: "Une réunion est plus dangereuse au moment où elle semble terminée."
    },
    playing: { hud: 'SORTIES {count} / 3', inProgress: 'RÉUNION EN COURS...', roles: ['DIRECTEUR DE DÉPARTEMENT', 'PM', 'DÉVELOPPEUR', 'VOUS'], leave: 'QUITTER', instruction: 'Appuyez uniquement lorsque « Y a-t-il autre chose ? » apparaît.', lines: ['POINT SUIVANT...', 'JUSTE UN DERNIER POINT...', 'À CE SUJET...', 'UNE RAPIDE MISE À JOUR...'], chance: 'Y A-T-IL AUTRE CHOSE ?', toast: 'ESCAPE CHANCE {count}/3', notOver: "CE N’EST PAS ENCORE FINI" },
    clear: 'ÉVASION RÉUSSIE ! « Nous pouvons conclure. » existait vraiment.', prompt: "Crée un jeu de réunion où le joueur ne peut sortir que pendant la brève fenêtre « Y a-t-il autre chose ? » et doit réussir trois fois."
  },
  game10: {
    title: 'SANCTUAIRE DU SERVEUR DE PRODUCTION', description: 'Sonnez sept fois de suite dans la zone lumineuse.', controls: 'CLIC AU BON MOMENT',
    culture: {
      heading: 'LA TRADITION JAPONAISE DES SANCTUAIRES SHINTO',
      background: ["Au Japon, on visite les sanctuaires shinto pour souhaiter réussite, sécurité, santé ou bonne fortune.", "Dans certains sanctuaires, les visiteurs sonnent une cloche avant de prier. Les billets de divination omikuji peuvent annoncer Daikichi, une excellente fortune.", "Pour les ingénieurs informatiques, une mise en production peut rester stressante même après tous les tests, revues et préparatifs."],
      parody: ["Les tests sont terminés. Les revues aussi.", "Il ne reste qu’à prier pour que la production survive.", "Sonnez la cloche dans la zone de réussite sept fois de suite."], punchline: "Le dernier 1 % de fiabilité sera maintenant confié à la prière."
    },
    playing: { hud: 'COMBO DE PRIÈRE {count} / 7', waiting: 'ÉTAT : EN ATTENTE', lucky: 'ÉTAT : BON AUGURE', luckyZone: 'SONNEZ DANS LA ZONE LUMINEUSE', instruction: "SONNEZ LORSQU’ELLE BRILLE !", now: 'MAINTENANT !!!', ring: '🔔 SONNER', combo: 'COMBO DE PRIÈRE ×{count}', premature: 'PRIÈRE TROP TÔT !' },
    clearTitle: 'DAIKICHI — EXCELLENTE FORTUNE', clear: "La probabilité de réussite du déploiement n’a pas changé.", clearPunchline: "Mais vous vous sentez beaucoup mieux maintenant.", prompt: "Avant le déploiement en production, ne faites que prier dans un sanctuaire. Transformez la cloche à sonner dans la zone lumineuse en jeu de timing."
  }
});
