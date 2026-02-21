// French translations — placeholders to be translated in Sprint 3.
// Keys mirror en.ts; values are TODO placeholders until real translation.
export const fr = {
  // ─── Navigation & Header ───
  nav: {
    news: 'Actualités',
    reviews: 'Tests',
    guides: 'Guides',
    technology: 'Technologie',
    videos: 'Vidéos',
    games: 'Jeux',
    team: 'Équipe',
    allArticles: 'Tous les articles',
    writeForUs: 'Écrire pour nous',
    aboutUs: 'À propos',
    contact: 'Contact',
    login: 'Connexion',
    searchPlaceholder: 'Rechercher...',
    toggleMenu: 'Basculer le menu',
    openSearch: 'Ouvrir la recherche',
  },

  // ─── Footer ───
  footer: {
    tagline:
      'Votre destination ultime pour du contenu gaming de pointe, des tests et les dernières analyses de l\'industrie.',
    stayUpdated: 'Restez informé',
    emailPlaceholder: 'Entrez votre email',
    join: 'Rejoindre',
    quickLinks: 'Liens rapides',
    ourTeam: 'Notre équipe',
    categories: 'Catégories',
    connect: 'Connexion',
    followUs: 'Suivez-nous',
    contactLabel: 'Contact',
    copyright: '\u00a9 {year} {name}. Tous droits réservés.',
    poweredBy: 'L\'avenir du contenu gaming',
    gamingFirst: 'GAMING FIRST',
  },

  // ─── Search ───
  search: {
    placeholder: 'Rechercher des articles, guides, tests...',
    minChars: 'Entrez au moins 3 caractères pour rechercher',
    searching: 'Recherche en cours...',
    error: 'Erreur lors de la recherche. Veuillez réessayer.',
    result: 'résultat',
    results: 'résultats',
    resultsFor: '{count} {resultWord} pour « {query} »',
    viewAll: 'Voir tous les résultats',
    noResults: 'Aucun résultat trouvé pour « {query} »',
    noResultsTip: 'Essayez d\'autres mots-clés ou vérifiez l\'orthographe',
    title: 'Recherche',
    pageTitle: 'Résultats de recherche pour « {query} »',
    emptyState: 'Entrez un terme de recherche pour trouver des articles.',
    found: '{count} {resultWord} trouvé(s) pour « {query} »',
    loadMore: 'Charger plus de résultats',
  },

  // ─── Newsletter ───
  newsletter: {
    emailPlaceholder: 'Entrez votre adresse email',
    subscribe: 'S\'abonner',
    benefit1: 'Mises à jour hebdomadaires',
    benefit2: 'Contenu exclusif',
    benefit3: 'Astuces gaming pro',
    privacy: 'Pas de spam, désinscription à tout moment. Nous respectons votre vie privée.',
  },

  // ─── Lead Capture: Exit Intent ───
  leadCapture: {
    exitIntent: {
      successTitle: 'Bienvenue au Club ! \ud83c\udfae',
      successMessage:
        'Vérifiez votre email pour votre Accès Gaming Insider et du contenu exclusif !',
      heading: 'Attendez ! Ne passez pas à côté !',
      subtitle: 'Accès Gaming Insider',
      description:
        'Rejoignez 10 000+ gamers qui reçoivent du contenu exclusif introuvable ailleurs :',
      benefit1: 'Accès anticipé aux tests (24h avant la publication)',
      benefit2: 'Guides gaming exclusifs & astuces cachées',
      benefit3: 'Notifications d\'accès aux bêtas',
      privacyNote:
        'Pas de spam, désinscription à tout moment. Rejoignez l\'élite gaming ! \ud83c\udfae',
      formTitle: 'Accès instantané',
      emailPlaceholder: 'Entrez votre email gaming...',
      submitting: 'En cours...',
      submit: 'Obtenir mon accès gaming \ud83d\ude80',
      trustBadge: 'Approuvé par 10 000+ gamers dans le monde',
    },
    inline: {
      successTitle: 'Vérifiez votre email ! \ud83d\udce7',
      successMessage:
        'Votre {bonus} exclusif est en route vers votre boîte de réception.',
      bonusLabel: 'Contenu bonus exclusif :',
      emailPlaceholder: 'Entrez votre email pour un accès instantané...',
      submitting: 'Envoi en cours...',
      submit: 'Obtenir le contenu bonus',
      instantDelivery: 'Livraison instantanée',
      privacyNote: 'Pas de spam, désinscription à tout moment',
    },
    sticky: {
      hotDeals: 'BONS PLANS',
      desktopMessage:
        'Recevez des alertes instantanées pour des offres gaming jusqu\'à -90% + des clés de jeux gratuites chaque mois !',
      mobileMessage: 'Offres gaming jusqu\'à -90% + clés gratuites !',
      emailPlaceholder: 'votre@email.com',
      submitting: 'En cours...',
      submit: 'Recevoir les alertes',
      submitMobile: 'OK',
      successMessage:
        '\ud83c\udf89 C\'est parti ! Les offres gaming arrivent dans votre boîte !',
    },
  },

  // ─── Article ───
  article: {
    minRead: 'min de lecture',
    adLabel: 'Publicité',
    publishedOn: 'Publié le {date}',
    updatedOn: 'Mis à jour le {date}',
    relatedTitle: 'Articles similaires',
    relatedCategoryTitle: 'En lien avec {category}',
    youMightLike: 'Vous aimerez aussi',
    viewAll: 'Voir tout',
    contentUpgrade: {
      title: 'Envie de passer au niveau supérieur ?',
      description:
        'Accédez à des stratégies exclusives, des astuces cachées et des analyses pro que nous ne partageons pas publiquement.',
      bonus: 'Guide stratégique ultime {category} + Astuces pro hebdomadaires',
    },
    continueReading: 'Continuer la lecture',
    previousArticle: 'Article précédent',
    nextArticle: 'Article suivant',
    moreFromAuthor: 'Plus de cet auteur',
    noRelated: 'Aucun article similaire trouvé',
    noRelatedTip: 'Consultez nos derniers articles à la place',
    browseAll: 'Parcourir tous les articles',
    tableOfContents: 'Table des matières',
    share: 'Partager :',
  },

  // ─── Review ───
  review: {
    scoreFormat: '/10',
    verdict: 'Verdict',
    verdictWithScore: 'Verdict \u2014 {score}/10',
    theGood: 'Les plus',
    theBad: 'Les moins',
    title: 'Tests de jeux',
    description:
      'Tests approfondis, verdicts honnêtes et notes de l\'équipe éditoriale {name}',
    featured: 'Test à la une',
    readFull: 'Lire le test complet',
    badge: 'Test',
    byAuthor: 'par {author}',
    loadMore: 'Charger plus de tests',
  },

  // ─── Game ───
  game: {
    coverage: 'Plus sur {name}',
    facts: 'Fiche technique',
    genres: 'Genres',
    themes: 'Thèmes',
    modes: 'Modes',
    perspectives: 'Perspectives',
    franchises: 'Franchises',
    collections: 'Collections',
    companies: 'Éditeurs',
    officialLinks: 'Liens officiels',
    screenshots: 'Captures d\'écran',
    videos: 'Vidéos',
    searchMore: 'Rechercher plus de jeux',
    released: 'Sorti le : {date}',
    searchPlaceholder: 'Rechercher des jeux...',
    unknownPlatform: 'Plateforme inconnue',
    untitled: 'Jeu sans titre',
    noGamesFound: 'Aucun jeu trouvé',
    displayError: 'Erreur d\'affichage de ce jeu',
    metaCard: {
      title: 'Infos du jeu',
      viewHub: 'Voir le hub',
      platform: 'Plateforme',
      genre: 'Genre',
      release: 'Sortie',
      publisher: 'Éditeur',
    },
    browseHubs: 'Parcourir les hubs de jeux',
    platformFilter: 'Plateforme',
    genreFilter: 'Genre',
    filterAll: 'Tous',
    showingCount: 'Affichage de {filtered} sur {total} chargés',
    noCover: 'Pas de pochette disponible',
    exploreCoverage: 'Explorer la couverture et les médias',
    noMatchFilters: 'Aucun jeu ne correspond à ces filtres.',
    endOfList: 'Vous avez atteint la fin de la liste.',
  },

  // ─── Guide ───
  guide: {
    title: 'Guides de jeux',
    description:
      'Soluces, astuces et stratégies d\'experts pour maîtriser n\'importe quel jeu',
    categoryDefault: 'Guide',
    readGuide: 'Lire le guide',
    featured: 'À la une',
    readFull: 'Lire le guide complet',
    gameGuide: 'Guide de jeu',
    explore: 'Explorer les guides',
    byGame: 'Par jeu',
    allGuides: 'Tous les guides',
    loadMore: 'Charger plus de guides',
    subtitle: 'Maîtrisez chaque jeu avec nos soluces d\'experts',
  },

  // ─── Video ───
  video: {
    title: 'Vidéos',
    description:
      'Regardez du gameplay, des tests et du contenu gaming de {name}',
    loadingVideos: 'Chargement des dernières vidéos\u2026',
    loadError: 'Impossible de charger les vidéos pour le moment.',
    views: '{count} vues',
  },

  // ─── Tech ───
  tech: {
    title: 'Hub Tech',
    description:
      'Tests hardware, actualités tech et dernières innovations gaming',
    categoryDefault: 'Tech',
    access: 'Accéder',
    featured: 'À LA UNE',
    readFull: 'Lire l\'article complet',
    loadMore: 'Charger plus',
  },

  // ─── Common / Shared ───
  common: {
    readMore: 'Lire la suite',
    viewAll: 'Voir tout',
    showAll: 'Tout afficher',
    loadMore: 'Charger plus',
    loading: 'Chargement...',
    loadingMore: 'Chargement en cours...',
    tryAgain: 'Réessayer',
    sendMessage: 'Envoyer le message',
    latest: 'Derniers',
    latestArticles: 'Derniers Articles',
    yesterday: 'Hier',
    prev: 'Préc',
    next: 'Suiv',
    minsAgo: 'il y a {mins}m',
    error: {
      generic: 'Une erreur est survenue. Veuillez réessayer plus tard.',
      loadFeatured: 'Impossible de charger les articles à la une',
      noFeatured: 'Aucun article à la une disponible',
      loadLatest: 'Erreur lors du chargement des derniers articles...',
      youtubeIntegration:
        'Une erreur est survenue avec l\'intégration YouTube.',
      loadMoreGames: 'Impossible de charger plus de jeux pour le moment.',
    },
  },

  // ─── Contact Form ───
  contact: {
    heading: 'Contactez-nous',
    nameLabel: 'Nom',
    emailLabel: 'Email',
    messageLabel: 'Message',
    sendMessage: 'Envoyer le message',
    success: 'Merci pour votre message ! Nous vous répondrons bientôt.',
  },

  // ─── Breadcrumbs & Accessibility ───
  breadcrumb: {
    home: 'Accueil',
  },
  a11y: {
    backToTop: 'Retour en haut',
    breadcrumb: 'Fil d\'Ariane',
    home: 'Accueil',
    featuredSlider: 'Carrousel d\'articles à la une',
    browseAll: 'Parcourir tous les articles',
    previousSlide: 'Diapositive précédente',
    nextSlide: 'Diapositive suivante',
    slideIndicators: 'Indicateurs de diapositives',
    closeSearch: 'Fermer la recherche',
    closeNotification: 'Fermer la notification',
  },

  // ─── 404 Page ───
  notFound: {
    title: '« Flashbacks de Shenmue... »',
    subtitle: '404 - Vous semblez perdu à Yokosuka...',
    timerExpired: 'Temps écoulé !',
    scoreLabel: 'Score : ',
    returnButton: 'Retourner dans la rue Dobuita',
    gameOverTitle: 'Game Over',
    finalScore: 'Score final : ',
    tryAgain: 'Réessayer',
  },

  // ─── Page: Home ───
  pages: {
    home: {
      newsletterBadge: 'Rejoignez 10 000+ gamers',
      newsletterHeading: 'Enrichissez votre ',
      newsletterHighlight: 'Culture Gaming',
      newsletterDescription:
        'Recevez les dernières actualités gaming, des tests exclusifs, des astuces pro et du contenu insider directement dans votre boîte mail chaque semaine.',
      error: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    },

    // ─── Page: About ───
    about: {
      heading: 'À propos',
      intro1:
        ' est votre source incontournable pour les actualités gaming, les tests et les guides. Fondé en 2024, nous sommes passionnés par la création du contenu le plus précis et engageant pour la communauté gaming.',
      intro2:
        'Notre mission est de donner aux gamers les connaissances nécessaires pour prendre des décisions éclairées, que ce soit sur les dernières sorties de jeux, les avancées technologiques ou les tendances de l\'industrie.',
      teamHeading: 'Notre équipe',
      founderRole: 'Fondateur & PDG',
      editorRole: 'Rédacteur en chef',
      founderBio: 'John est le visionnaire derrière ',
      editorBio:
        'Jane s\'assure que tout le contenu respecte les plus hauts standards...',
    },

    // ─── Page: Write For Us ───
    writeForUs: {
      heading: 'Écrire pour nous',
      section1Heading:
        'Soumettez votre article tech invité à notre blog technologique',
      section1Content:
        'Soumettez un article invité à notre blog technologique. Vous voulez écrire pour nous et partager vos articles tech ? Nous acceptons le contenu d\'entreprises, de nouveaux blogueurs, d\'entreprises technologiques, de promoteurs marketing digital, et plus encore. Écrivez pour nous et gagnez en visibilité sur notre blog tech.',
      section2Heading: 'Pourquoi écrire un article tech invité pour nous ?',
      section2Content:
        '{name} est engagé dans la qualité et le contenu sélectionné. Nous sommes un nom de confiance dans l\'industrie tech et du divertissement, ayant travaillé à promouvoir des marques majeures comme EA et Ubisoft. Notre objectif est de fournir un contenu de valeur que notre audience adore. Lorsque vous soumettez un article invité à notre blog technologique, vous accédez à une plateforme qui se soucie de la qualité.',
      section3Heading: 'Sujets pour votre soumission d\'article tech invité',
      section3Intro:
        'Vous voulez écrire pour notre blog tech ? Nous sommes heureux d\'accepter du contenu pertinent pour l\'industrie tech et notre audience. Sur quoi pouvez-vous soumettre un article tech invité ?',
      topics: [
        'Tendances Tech',
        'Actualités Tech',
        'Réalité augmentée & réalité virtuelle',
        'Intelligence artificielle',
        'Tech Gaming',
        'Machine Learning',
        'Tech Divertissement',
        'Cybersécurité',
        'Nanotechnologie',
        'Tech Musique',
        'Cloud',
        'Tech Business',
        'Gadgets',
        'Smartphones',
        'Appareils connectés',
        'Ordinateurs et PC',
        'Technologie iOS',
        'Technologie Google',
        'Blockchain',
        'Web3',
      ],
      section3Outro:
        'D\'autres idées ? Lorsque vous soumettez votre pitch d\'article invité, dites-nous en plus sur ce que vous voulez écrire. Nous sommes heureux d\'écouter vos idées et de travailler avec vous.',
      section4Heading:
        'Soumettre votre article invité : ce que vous devez savoir avant d\'écrire pour nous',
      section4Intro:
        'Nous n\'acceptons pas toutes les soumissions d\'articles invités. Nous recherchons uniquement du contenu de qualité pertinent pour notre niche. Avant de soumettre votre article invité, vous devez savoir :',
      requirements: [
        'Les soumissions d\'articles tech invités doivent faire 600 mots ou plus.',
        'Les articles tech invités doivent être bien rédigés et relus avant soumission.',
        'Vous devez avoir vos idées pour votre article tech invité prêtes avant de nous contacter.',
        'Nous ne souhaitons pas être contactés par des agences cherchant à nous ajouter à leur liste marketing.',
      ],
      section4Outro1:
        'Lorsque vous êtes prêt à nous contacter pour soumettre votre article invité à notre blog tech, écrivez à ',
      section4Outro2: '. Commencez votre objet par « ARTICLE INVITÉ ».',
      section5Heading: 'En savoir plus sur la soumission d\'un article invité à {name}',
      section5Content:
        '{name} est une communauté petite mais en pleine croissance qui offre aux créateurs de contenu et aux marques émergentes une excellente opportunité d\'être publiés et de présenter leur matériel à un réseau social combiné de plus de 6000 abonnés. Nous avons un lectorat mensuel moyen de 30 000 visiteurs uniques provenant du trafic organique naturel grâce à notre site web sain et notre dévouement aux meilleures pratiques. Tous les auteurs qui écrivent pour notre blog tech recevront une attribution appropriée et des backlinks pertinents.',
      section6Heading:
        'Que contiennent les meilleurs articles tech invités ?',
      section6Content:
        'Il n\'y a rien de spécifique que nous exigeons de nos soumissions d\'articles tech invités en dehors des détails ci-dessus. Cependant, nous pouvons conseiller que les meilleurs articles tech invités incluront des analyses détaillées de la technologie expliquées sans jargon. Nous voulons que votre article tech invité soit compris par tous nos lecteurs, pas seulement les technophiles. Nous recommandons également que vos articles tech invités incluent des sources vers toutes les ressources pertinentes et incluent des statistiques ou des études lorsque c\'est possible pour donner plus d\'autorité à votre article tech invité.',
      submitButton: 'Soumettre votre article',
    },

    // ─── Page: Privacy Policy ───
    privacy: {
      heading: 'Politique de confidentialité',
      intro:
        'Chez {name}, nous prenons votre vie privée au sérieux. Cette politique de confidentialité décrit les types d\'informations personnelles que nous collectons, comment nous les utilisons et les mesures que nous prenons pour protéger vos données.',
      section1Heading: 'Collecte d\'informations',
      section1Content:
        'Nous collectons des informations personnelles telles que votre nom, adresse email et autres coordonnées lorsque vous nous les fournissez volontairement via les formulaires de notre site web, comme le formulaire de contact.',
      section2Heading: 'Utilisation des informations',
      section2Content:
        'Nous utilisons vos informations pour répondre à vos demandes, envoyer des newsletters et améliorer notre site web. Nous ne partageons pas vos informations personnelles avec des tiers sans votre consentement, sauf lorsque la loi l\'exige.',
      section3Heading: 'Cookies',
      section3Content:
        'Notre site web utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez choisir de désactiver les cookies via les paramètres de votre navigateur, mais cela peut affecter la fonctionnalité de notre site.',
      section4Heading: 'Extension Chrome',
      section4Intro:
        'L\'extension Chrome {name} Quick Game Lookup est conçue dans le respect de la vie privée :',
      extensionFeatures: [
        {
          title: 'Aucune collecte de données personnelles :',
          content:
            'L\'extension ne collecte, stocke ou transmet aucune information personnelle.',
        },
        {
          title: 'Aucun suivi ni analyse :',
          content:
            'Nous ne suivons pas votre activité de navigation ni votre historique de recherche.',
        },
        {
          title: 'Stockage local uniquement :',
          content:
            'Toute donnée temporaire (comme les recherches en attente) est stockée localement sur votre appareil et automatiquement effacée.',
        },
        {
          title: 'Requêtes API :',
          content:
            'Lorsque vous recherchez un jeu, la requête est envoyée à {url} pour récupérer les informations du jeu depuis IGDB. Aucun identifiant utilisateur n\'est attaché à ces requêtes.',
        },
      ],
      section4Outro:
        'L\'extension nécessite des permissions minimales : menus contextuels (pour la recherche par clic droit), stockage (pour les données locales temporaires) et accès à {url} (pour les requêtes API).',
      section5Heading: 'Modifications de cette politique',
      section5Content:
        'Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur notre site web.',
    },

    // ─── Page: Terms of Service ───
    terms: {
      heading: 'Conditions d\'utilisation',
      intro1: 'Bienvenue sur ',
      intro2:
        '. En utilisant notre site web, vous acceptez de vous conformer aux conditions générales suivantes.',
      section1Heading: 'Acceptation des conditions',
      section1Content:
        'En accédant ou en utilisant notre site web, vous acceptez d\'être lié par ces conditions générales. Si vous n\'acceptez pas ces conditions, vous n\'êtes pas autorisé à utiliser notre site web.',
      section2Heading: 'Propriété du contenu',
      section2Content1:
        'Tout le contenu de ce site web, y compris les textes, graphiques, logos et images, est la propriété de ',
      section2Content2:
        '. Vous ne pouvez pas reproduire, distribuer ou utiliser tout contenu sans notre autorisation écrite expresse.',
      section3Heading: 'Conduite de l\'utilisateur',
      section3Content:
        'Vous acceptez de ne pas utiliser notre site web à des fins illégales ou de vous engager dans toute conduite susceptible de nuire ou d\'interférer avec le fonctionnement de notre site web. Cela inclut le piratage, le spam ou la distribution de logiciels malveillants.',
      section4Heading: 'Modifications de ces conditions',
      section4Content:
        'Nous nous réservons le droit de mettre à jour ou de modifier ces conditions à tout moment. Tout changement sera effectif immédiatement après publication sur notre site web.',
    },

    // ─── Page: Authors ───
    authors: {
      heroHeading: 'L\'histoire de {name}',
      heroParagraph1:
        ' est né d\'une croyance simple : chaque gamer mérite un accès à une couverture honnête et approfondie des jeux qu\'il aime. Ce qui a commencé comme un projet passion est devenu une communauté florissante de passionnés de jeux, d\'auteurs et de créateurs.',
      heroParagraph2:
        'Nous ne sommes pas juste un autre site de jeux. Nous sommes des gamers avant tout \u2014 passant d\'innombrables heures à explorer des mondes virtuels, maîtriser les mécaniques de jeu et découvrir des secrets cachés. Cette expérience de première main façonne tout ce que nous écrivons, de nos guides détaillés à nos tests sans concession.',
      heroParagraph3Part1: 'Notre mission est simple : ',
      heroParagraph3Part2: 'vous aider à battre le jeu',
      heroParagraph3Part3:
        '. Que vous soyez bloqué sur un boss, à la recherche de votre prochaine aventure ou que vous vouliez rester informé des actualités de l\'industrie \u2014 on est là pour vous.',
      valuesHeading: 'Nos valeurs',
      value1Title: 'Tests honnêtes',
      value1Description:
        'Pas de notes payées, pas de biais. On dit les choses comme elles sont, même quand ce n\'est pas ce que les éditeurs veulent entendre.',
      value2Title: 'Guides experts',
      value2Description:
        'Écrits par des joueurs qui ont vraiment complété le contenu. Pas de suppositions, juste des stratégies éprouvées.',
      value3Title: 'Communauté d\'abord',
      value3Description:
        'Nous écoutons nos lecteurs. Vos retours façonnent notre contenu et nous aident à mieux vous servir.',
      teamHeading: 'Nos rédacteurs',
      teamDescription:
        'L\'équipe passionnée derrière chaque article, test et guide. Cliquez sur un rédacteur pour voir toutes ses contributions.',
      writerRole: 'Rédacteur Gaming',
      viewArticles: 'Voir les articles \u2192',
      noAuthors: 'Aucun auteur trouvé.',
      ctaHeading: 'Envie de rejoindre l\'équipe ?',
      ctaDescription:
        'Nous recherchons toujours des rédacteurs passionnés qui vivent et respirent le gaming. Si vous avez des analyses à partager et des histoires à raconter, nous voulons vous entendre.',
      ctaButton: 'Écrire pour nous',
    },
  },
} as const;
