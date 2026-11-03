# TOTK Wism — faisabilité d'un catalogue FinalBoss

Audit du 3 novembre 2026. Périmètre : inspection publique, inventaire des URL et extraction de trois fiches représentatives. Aucun changement applicatif ni déploiement.

## Conclusion

Le catalogue est techniquement récupérable par ses pages publiques. Le sitemap anglais contient exactement **1 215 URL de builds uniques**. Les titres, descriptions, tags, images QR et plusieurs indicateurs sont disponibles dans le HTML initial. Un navigateur automatisé n'est pas nécessaire pour l'import.

Ce constat valide la méthode, pas l'accessibilité de chaque image ni le fonctionnement de chaque QR dans le jeu. L'audit n'a pas téléchargé les 1 215 fiches ou leurs images.

## Architecture observée

- Réponses HTML rendues côté serveur ; en-tête `X-Powered-By: PHP/8.5.12`.
- Index : [all-schema.html](https://totk.wism.fr/all-schema.html), pagination `?p=2`, jusqu'à `?p=51` lors de l'audit. La première page contient 24 builds et deux cartes commerciales ; il faut sélectionner les liens de builds plutôt que compter toutes les cartes.
- Fiche : `/show-{id}.html`. Les identifiants ne doivent pas être supposés contigus.
- [Sitemap principal](https://totk.wism.fr/sitemap.xml) : neuf sous-sitemaps linguistiques. Le [sitemap anglais](https://totk.wism.fr/sitemap.xml?lang=en) suffit à découvrir les 1 215 identifiants sans multiplier les langues.
- [JavaScript commun](https://totk.wism.fr/js/site.js?v=56) : interactions et chargement infini. Son endpoint de liste renvoie du HTML, pas un export structuré des builds.
- [robots.txt](https://totk.wism.fr/robots.txt) exclut `/jq/` et les pages de modification. Aucun appel à ces endpoints n'a été effectué ; l'extraction envisagée utilise les fiches et sitemaps publics.
- Aucun export public documenté ou API de syndication identifié dans les éléments consultés. Cela ne prouve pas leur absence.

## Données récupérables

| Champ | Emplacement / limite |
| --- | --- |
| Identifiant source, URL | Sitemap et URL de fiche |
| Titre | `.build-info h1` |
| Description | `.build-desc` ; texte libre, parfois très court |
| Tags | `.build-tags .chip` ; normaliser la casse et dédupliquer |
| Image contenant l'aperçu et le QR | `a[download]` ; fichier WebP, JPG/JPEG ou PNG accessible directement |
| Coût en Zonaite | Tableau `.facts` ; champ parfois absent, conserver `null` |
| Type | Tableau `.facts` ; classification affichée par le site |
| Auteur / profil | `.build-by a` lorsqu'il existe ; non systématique |
| Sources originales / vidéo | Liens ou URL en texte libre dans certaines descriptions ; aucun champ uniforme observé |
| Score / votes | `.vote-score` de la fiche ; indicateur de Wism, pas une note FinalBoss |
| Vues | Tableau `.facts` ; compteur externe daté |
| Retour de fonctionnement | Badge visible et `.works-stats` ; avis communautaire externe |
| Dates | Mois dans `.facts`, date `lastmod` dans le sitemap ; garder leur provenance et ne pas assimiler `lastmod` à la publication |

Les fiches contiennent aussi du JSON-LD `HowTo`, utile comme extraction de secours pour le titre, la description, l'image et parfois le coût. Les étapes y sont génériques : ce ne sont pas des tutoriels propres à chaque montage.

Attention au HTML caché : une phrase avertissant d'un build non fonctionnel est présente avec l'attribut `hidden`, même sur une fiche « Tested OK ». Un extracteur qui prend tout le texte pourrait afficher un faux avertissement.

## Échantillon vérifié

- [Perfect Hoverbike, ID 1312](https://totk.wism.fr/show-1312.html) : image téléchargée et inspectée, coût de 9 Zonaite, badge positif fondé sur cinq retours, aucun auteur indiqué. L'image est une carte Zelda Notes avec aperçu et QR, pas une galerie de captures séparées.
- [Hover Ship, ID 1340](https://totk.wism.fr/show-1340.html) : auteur Reddit crédité, description indiquant l'accord du créateur pour ce partage, coût absent et statut non testé. Le lien de profil ne fournit pas à lui seul l'URL du post d'origine.
- [AST Phantom, ID 1363](https://totk.wism.fr/show-1363.html) : coût de 63 Zonaite et liste de 21 pièces dans la description ; aucun auteur affiché.

Pas de modèle 3D ni de nomenclature structurée des pièces identifié. Le contenu interne des QR et leur import en jeu n'ont pas été validés. Le décodage local essayé avec Apple Vision n'a pas abouti dans cet environnement.

## Compatibilité et provenance

[Nintendo confirme](https://www.nintendo.com/en-gb/Support/Purchases-Subscriptions/How-to-Use-ZELDA-NOTES-in-the-Nintendo-Switch-App-2926626.html) que le partage Autobuild par QR nécessite Zelda Notes et **Tears of the Kingdom — Nintendo Switch 2 Edition**. L'abonnement Nintendo Switch Online n'est pas nécessaire. Une interface FinalBoss doit expliciter cette compatibilité.

Le site reçoit des contributions directes : ce n'est donc pas uniquement un agrégateur de publications externes. Le [formulaire](https://totk.wism.fr/add-schema.html) demande un accord pour publication sur ce site ; la [politique de confidentialité](https://totk.wism.fr/privacy.html) décrit ces contributions comme publiques. Aucune licence générale de republication sur un autre site identifiée dans ces pages. L'accroche de l'accueil évoquant un partage libre ne détaille pas de conditions de syndication.

Avant la reprise intégrale des textes et images, clarifier la réutilisation auprès de l'exploitant et des créateurs concernés. Un export autorisé serait aussi plus stable qu'un extracteur HTML. Un simple crédit ne documente pas à lui seul une autorisation de réutilisation. Aucun contact n'a été envoyé.

## Proposition pour FinalBoss

Le dépôt possède déjà des hubs de jeux, des fiches imbriquées, des métadonnées et des catalogues de données. La configuration actuelle cible Cloudflare Workers/OpenNext avec R2 pour le cache ; la mention de Vercel dans AGENTS.md ne suffit pas à décrire cette configuration.

1. Créer une collection typée de builds avec identifiant source, provenance, état de réutilisation, date de collecte et champs manquants explicites. Conserver l'import brut séparément des contenus publiés.
2. Ajouter un catalogue sous `/game/<slug-canonique>/builds`, puis une fiche par build avec aperçu, QR original, coût, créateur, sources et compatibilité. Le slug Zelda existant doit être vérifié avant de fixer l'URL.
3. Proposer recherche et filtres : vol, combat, transport, bateau, coût, statut de test externe. Ajouter des descriptions et sélections éditoriales FinalBoss, ainsi que les vidéos originales lorsqu'elles sont identifiées.
4. Servir les données enregistrées et les médias autorisés depuis notre stockage. Ne pas faire dépendre chaque visite FinalBoss d'une requête à Wism. Conserver les originaux QR sans recadrage destructif ni recompression avec perte.
5. Importer une première sélection pour vérifier l'expérience, puis étendre à tout le catalogue. Pour les mises à jour, relire le sitemap, ajouter les nouveaux identifiants et contrôler périodiquement changements et retraits. `lastmod` seul ne garantit pas la détection de tous les changements.

Le mécanisme actuel de pages d'entités ne possède pas de type `build` : il faut ajouter cette surface explicitement. Le travail porte surtout sur l'import, la provenance et l'affichage, sans nécessité de changer de framework.

## Livrables de l'audit

- `totk-wism-build-urls-2026-11-03.json` : 1 215 URL, identifiants et dates `lastmod` issus du sitemap anglais.
- `totk-wism-sample-2026-11-03.json` : extraction des métadonnées de trois fiches ; les descriptions complètes ne sont pas reproduites dans cet échantillon.

L'inventaire des URL est complet selon le sitemap consulté. L'import complet des fiches, la copie des médias, la vérification en jeu et la publication sur FinalBoss restent à réaliser.
