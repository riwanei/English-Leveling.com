// Portes d'élite : C1 (rang A, 2 PV) et SS+ (1 seul PV, 5 choix)
export const C1 = [
{ id: "inversion", name: "Inversion Interdite", stat: "syn", desc: "Never have I…, Not only did he… : l'inversion emphatique.", sub: "Complète la phrase", q: `Never ___ such a beautiful place|have I seen|I have seen|I saw|did I saw#Adverbe négatif en tête → inversion : have I seen.
Not only ___ late, but he also forgot the tickets|was he|he was|he is|did he be#Not only en tête → inversion de l'auxiliaire.
Rarely ___ him so angry|have we seen|we have seen|we saw|did we saw#Rarely en tête → inversion.
Hardly ___ home when it started to rain|had I got|I had got|did I get|I got#Hardly… when → had + sujet + participe passé.
No sooner ___ the phone down than it rang again|had she put|she had put|did she put|she put#No sooner… than → had + sujet + participe passé.
Under no circumstances ___ open this door|should you|you should|you must|must not you#Under no circumstances → inversion : should you.
Only later ___ what had happened|did I realise|I realised|I did realise|realised I#Only + complément de temps en tête → inversion avec did.
Little ___ that he was being watched|did he know|he knew|he did know|knew he#Little en tête (= il ne savait pas du tout) → did he know.
Seldom ___ such talent in one so young|does one find|one finds|one does find|finds one#Seldom en tête → inversion avec does.
So tired ___ that she fell asleep at her desk|was she|she was|she is|did she#So + adjectif en tête → inversion avec be.
At no time ___ the risks to us|did they explain|they explained|they did explain|explained they#At no time → inversion avec did.
Should you ___ any help, call me|need|needed|to need|needing#Should you need = If you need (inversion formelle).` },
{ id: "subjunctive", name: "Décret du Subjonctif", stat: "syn", desc: "I suggest that he be… : le subjonctif anglais.", sub: "Complète la phrase", q: `The doctor recommended that he ___ smoking|stop|stops|stopped|will stop#Subjonctif après recommend that : verbe à la base, sans -s.
It is essential that she ___ on time|be|is|was|will be#It is essential that + base (be).
They insisted that he ___ the meeting|attend|attends|attended|would attend#insist that + base.
I suggest that we ___ the decision|postpone|postponed|postpones|will postpone#suggest that + base.
It's vital that every student ___ the rules|follow|follows|followed|following#It's vital that + base, même avec un sujet singulier.
The committee demanded that the report ___ immediately|be published|is published|was published|publishes#Subjonctif passif : be + participe passé.
If I ___ you, I'd accept the offer|were|was being|am|would be#Subjonctif passé : If I were you.
She asked that nobody ___ told|be|is|was|being#ask that + be + participe passé.
It is important that he not ___ late|be|is|was|being#Négation au subjonctif : not + base, sans do.
God ___ the Queen!|save|saves|saved|will save#Formule figée au subjonctif : God save…
Far ___ it from me to criticise|be|is|was|being#Expression figée : Far be it from me to… (je ne voudrais pas…).` },
{ id: "cleft", name: "Phrases Clivées", stat: "syn", desc: "What I need is…, It was John who… : mettre en relief.", sub: "Complète la phrase", q: `___ I need is a holiday|What|That|Which|It#Mise en relief : What + sujet + verbe + is…
It was my brother ___ broke the window|who|which|what|whom#It was + personne + who.
___ was in 2010 that we met|It|What|That|There#It was + moment + that.
All I want ___ some peace and quiet|is|are|it is|be#All I want is… (verbe au singulier).
What she did ___ call the police|was|did|is to|it was#What + sujet + did + was + verbe à la base.
The reason ___ I left is simple|why|what|which|because#The reason why…
It's not the money ___ matters, it's the time|that|what|who|it#It's + nom + that.
___ surprised me most was his calm|What|That|It|Which#What + verbe = ce qui.
The person ___ I admire most is my grandmother|whom|which|what|whose#Complément de personne (formel) → whom.
It was only when I got home ___ I noticed|that|when|what|so#It was only when… that…
The thing ___ annoys me is the noise|that|what|who|it#The thing that… (what ferait doublon avec the thing).
Where I'd like to live ___ by the sea|is|it's|are|was being#Proposition sujet → verbe au singulier : is.` },
{ id: "idiomsc1", name: "Idiomes de l'Élite", stat: "per", desc: "Expressions idiomatiques de niveau C1.", sub: "Que signifie cette expression ?", q: `To be at loggerheads|Être en désaccord total|Être bûcheron|Être épuisé|Être têtu comme une mule#loggerheads = conflit ouvert entre deux personnes.
To take something with a pinch of salt|Prendre quelque chose avec des pincettes|Assaisonner un plat|Trouver ça amer|Accepter sans discuter#Ne pas croire tout ce qu'on entend.
To cut corners|Bâcler, rogner sur la qualité|Prendre un raccourci en voiture|Couper la poire en deux|Arrondir les angles#Faire au plus vite ou au moins cher, au détriment de la qualité.
The elephant in the room|Le sujet tabou évident|Une personne envahissante|Un gros problème résolu|Un invité imprévu#Problème évident dont personne n'ose parler.
To jump the gun|Agir trop tôt, prématurément|Tirer le premier|Sauter de joie|Être très rapide#Comme partir avant le coup de pistolet.
A blessing in disguise|Un mal pour un bien|Une bénédiction officielle|Un cadeau caché|Une fausse joie#Un malheur qui s'avère finalement positif.
To steal someone's thunder|Voler la vedette à quelqu'un|Effrayer quelqu'un|Plagier un livre|Gâcher la fête#S'attribuer l'attention qui revenait à un autre.
To be on the same wavelength|Être sur la même longueur d'onde|Écouter la même radio|Avoir le même âge|Être collègues#Bien se comprendre.
To add insult to injury|Pour couronner le tout (en pire)|Insulter un blessé|Faire des excuses|Exagérer une blessure#Aggraver une situation déjà mauvaise.
To have the upper hand|Avoir l'avantage|Lever la main|Être gaucher|Être chef d'entreprise#Dominer une situation.
To throw in the towel|Jeter l'éponge|Faire le ménage|Se sécher|Commencer un combat#Abandonner.
A storm in a teacup|Une tempête dans un verre d'eau|Un thé trop chaud|Une crise grave|Une dispute familiale violente#Beaucoup d'agitation pour pas grand-chose.` },
{ id: "depprep", name: "Prépositions Abyssales", stat: "syn", desc: "Les prépositions dépendantes les plus traîtres.", sub: "Choisis la bonne préposition", q: `She's very adept ___ handling difficult clients|at|in|with|for#adept at + -ing.
The decision is ___ the discretion of the manager|at|on|in|under#at someone's discretion.
He was acquitted ___ all charges|of|from|for|on#acquit someone of a crime.
The price is inclusive ___ tax|of|with|in|for#inclusive of = toutes taxes comprises.
She has a flair ___ languages|for|in|at|with#a flair for = un don pour.
This is ___ odds with what you said yesterday|at|in|on|by#at odds with = en contradiction avec.
He was oblivious ___ the danger|to|with|from|at#oblivious to (ou of) = inconscient de.
We are ___ the mercy of the weather|at|in|under|on#at the mercy of = à la merci de.
They were accused of being complicit ___ the fraud|in|with|of|to#complicit in = complice de (un acte).
The new rules will come ___ force next year|into|in|to|on#come into force = entrer en vigueur.
She is ___ no means an expert|by|in|at|with#by no means = en aucun cas.
He's prone ___ exaggeration|to|of|for|at#prone to = sujet à.` },
{ id: "paronyms", name: "Paronymes Maudits", stat: "per", desc: "Affect / effect, economic / economical… les mots presque jumeaux.", sub: "Complète la phrase", q: `The new law will ___ thousands of people|affect|effect|infect|afflict#affect = verbe (avoir un effet sur). effect = nom.
The medicine had no ___ on him|effect|affect|efficiency|affection#effect = nom (un effet).
This car is very ___, it uses little fuel|economical|economic|economist|economics#economical = qui consomme peu. economic = relatif à l'économie.
The country is in an ___ crisis|economic|economical|economy|economics#economic = de l'économie.
She was ___ by the beauty of the place|moved|removed|moving|motioned#be moved = être ému.
I'd like to ___ your attention to page 4|draw|withdraw|drag|attract to#draw someone's attention to = attirer l'attention sur.
The ___ of the story is: never give up|moral|morale|morality|mortal#moral (nom) = la morale d'une histoire. morale = le moral.
The team's ___ is very high after the win|morale|moral|morals|mortality#morale = le moral d'un groupe.
Please ___ me of the meeting tomorrow|remind|remember|recall|reminisce#remind someone of = rappeler à quelqu'un.
I can't ___ myself to do it|bring|take|carry|fetch#can't bring yourself to do = ne pas avoir le cœur de faire.
He gave me some good ___|advice|advise|advices|advises#advice = nom indénombrable. advise = verbe.
They ___ me to apply for the job|advised|adviced|advice|advise to#advise = verbe : they advised me to…` },
{ id: "connectc1", name: "Connecteurs Érudits", stat: "syn", desc: "Notwithstanding, albeit, whereby, hence…", sub: "Choisis le bon connecteur", q: `The plan worked, ___ slowly|albeit|whereas|hence|thereby#albeit = bien que (+ adjectif ou adverbe), très formel.
___ the difficulties, the project was a success|Notwithstanding|Albeit|Whereby|Hence#notwithstanding + nom = en dépit de.
It's a system ___ users can vote online|whereby|albeit|hence|whilst#whereby = par lequel.
Prices rose; ___, sales fell|consequently|whereas|albeit|whereby#consequently = par conséquent.
He has no experience. ___, he's very motivated|That said|Whereby|Hence|Albeit#That said = cela dit.
The road was icy, ___ the accident|hence|whereby|albeit|thus that#hence + nom = d'où.
___ you agree, we'll sign tomorrow|Provided|Albeit|Whereas|Hence#Provided (that) = pourvu que.
___ some critics, the film is a masterpiece|According to|Whereby|Albeit|Hence#According to + nom = selon.
She left early, ___ missing the end|thereby|whereby|albeit|hence that#thereby + -ing = ce faisant, et ainsi.
___ as it may, we have to decide|Be that|So be|Be it|That be#Be that as it may = quoi qu'il en soit.
I'll help you, ___ I can't promise anything|although|albeit|whereby|hence#although + phrase complète (albeit n'est pas suivi d'une phrase complète).
___ the fact that it rained, we had fun|Despite|Although|Albeit|Whereas#despite the fact that + phrase.` },
{ id: "mixedcond", name: "Conditionnels Croisés", stat: "syn", desc: "Mélanger passé et présent dans un même conditionnel.", sub: "Complète la phrase", q: `If I had taken the job, I ___ in London now|would be living|would have lived|will live|lived#Condition passée, conséquence présente → would + verbe.
If she weren't so shy, she ___ to the party last night|would have come|would come|had come|came#Trait présent, conséquence passée → would have + participe passé.
If I ___ breakfast, I wouldn't be hungry now|had eaten|ate|would have eaten|have eaten#Condition passée → past perfect, conséquence présente → would.
If he ___ French, he would have understood the film|spoke|had spoken|speaks|would speak#Fait général présent (il ne parle pas français) → prétérit.
If you ___ me, I would have told you|had asked|asked|would ask|ask#Condition passée → past perfect.
If we hadn't missed the flight, we ___ on the beach right now|would be lying|would have lain|will lie|lay#now → conséquence présente : would + be + -ing.
___ it not for your help, I would have failed|Had|Were|If|Should#Were it not for = sans (inversion formelle de if it were not for).
___ it not been for the rain, we would have won|Had|Were|Should|If#Had it not been for = s'il n'y avait pas eu.
If I were you, I ___ that email yesterday|wouldn't have sent|wouldn't send|didn't send|hadn't sent#À ta place (présent), conseil sur le passé → wouldn't have + participe passé.
Should you ___ any problems, contact us|have|had|having|to have#Should you have = If you have (inversion formelle).
If they were more organised, they ___ the deadline|wouldn't have missed|wouldn't miss|hadn't missed|didn't miss#Trait présent, conséquence passée → wouldn't have + participe passé.` },
{ id: "probability", name: "Certitudes et Probabilités", stat: "syn", desc: "Be bound to, be likely to, there's no way… : nuancer.", sub: "Complète la phrase", q: `Don't worry, she's bound ___ call|to|for|at|of#be bound to = être sûr de (certitude).
It's highly ___ that he'll win, he's injured|unlikely|unable|impossibly|unlike#highly unlikely = très peu probable.
They're ___ to arrive late, they always do|likely|probably|possible|likelihood#be likely to + verbe.
There's ___ chance of rain today|every|all|each|whole#There's every chance = c'est très probable.
In all ___, the meeting will be cancelled|likelihood|likely|probably|possibility#In all likelihood = selon toute vraisemblance.
He ___ well be right|may|must|should|can#may well = il se peut bien que.
There's no ___ he'll finish on time|way|chance to|mean|manner#There's no way = c'est impossible.
She's ___ to be the best candidate|said|told|spoken|talked#be said to be = on dit qu'elle est.
The concert is ___ to start at 8|due|bound for|likely for|meant for#be due to = être prévu pour.
It's a ___ conclusion, they'll win|foregone|forgotten|forgiven|foreseen#a foregone conclusion = un résultat couru d'avance.
I ___ as well go home, nothing's happening|might|must|should|would#might as well = autant (faire quelque chose).
He's ___ to have left the country|thought|thinking|think|thinks#be thought to have done = on pense qu'il a fait.` },
{ id: "phrasalc1", name: "Phrasal Verbs du Néant", stat: "lex", desc: "Les phrasal verbs les plus pointus.", sub: "Que veut dire ce phrasal verb ?", q: `to fob off|refiler, se débarrasser de quelqu'un avec une excuse|frotter|faire la fête|se calmer#fob someone off = éconduire avec une excuse.
to mull over|réfléchir longuement à|mélanger|se moquer de|chauffer du vin#mull over = ruminer, peser.
to iron out|aplanir (un problème)|repasser|exclure|faire fondre#iron out = régler les derniers détails.
to churn out|produire à la chaîne|baratter|tourner en rond|jeter#churn out = produire en masse, sans qualité.
to egg on|pousser, encourager (à mal faire)|cuisiner des œufs|se moquer|décourager#egg someone on = inciter quelqu'un.
to stave off|repousser, éviter (un danger)|couper du bois|attaquer|affamer#stave off = conjurer, retarder.
to brush up on|rafraîchir (ses connaissances)|se brosser les dents|balayer|ignorer#brush up on = réviser.
to clam up|se taire brusquement|pêcher des palourdes|se fermer à clé|transpirer#clam up = se refermer comme une huître.
to rope in|enrôler, embrigader|attacher|capturer un animal|grimper#rope someone in = persuader de participer.
to palm off|refiler (quelque chose de mauvais)|lire les lignes de la main|applaudir|cacher#palm something off on someone = refourguer.
to tide over|dépanner (en attendant)|nager contre le courant|inonder|traverser la mer#tide someone over = aider à tenir jusqu'à…
to bank on|compter sur|déposer à la banque|parier contre|construire une berge#bank on something = miser sur.` }
];

export const SSPLUS = [
{ id: "throne", name: "Trône du Monarque", stat: "syn", desc: "Grammaire absolue. Une seule erreur et tu tombes.", sub: "Complète la phrase", q: `Not until the 19th century ___ widely used|was the telephone|the telephone was|did the telephone|had the telephone|the telephone has been#Not until… en tête → inversion : was the telephone (passif).
Scarcely ___ when the alarm went off|had we sat down|we had sat down|did we sit down|we sat down|have we sat down#Scarcely… when → had + sujet + participe passé.
I'd sooner you ___ anyone about this|didn't tell|don't tell|won't tell|not tell|hadn't told#would sooner + autre sujet + prétérit (présent ou futur).
Were he ___ the truth, he would be devastated|to discover|discovering|discovered|discover|to have discover#Were + sujet + to + verbe = If he discovered (hypothèse formelle).
The proposal, ___ was rejected, had taken months to prepare|which|that|what|it|whom#Entre virgules, pour une chose → which, jamais that.
She is said ___ a fortune in the 1990s|to have made|to make|having made|that she made|to be made#Action passée avec be said → to have + participe passé.
Hardly anyone came, ___?|did they|didn't they|did he|didn't he|came they#hardly anyone est négatif → tag affirmatif, avec they.
It's high time the government ___ action|took|takes|take|has taken|will take#It's high time + sujet + prétérit.
The more you practise, ___ you become|the better|better|the best|more better|the more better#The more…, the + comparatif.
Little ___ that the house was haunted|did they suspect|they suspected|they did suspect|suspected they|had they suspect#Little en tête → inversion avec did.
I'd rather ___ the truth yesterday|you had told me|you told me|you tell me|you would tell me|you have told me#would rather + autre sujet + past perfect pour un regret passé.
No matter how hard ___, he couldn't open it|he tried|did he try|he was trying it|tried he|he has tried#Après no matter how + adjectif : ordre normal sujet + verbe.
Such ___ his anger that nobody dared speak|was|is|were|did|had#Such + be + nom + that : inversion (Such was his anger).
Rarely, if ever, ___ such a mistake|has he made|he has made|he made|did he made|he makes#Rarely, if ever en tête → inversion.
He denied ___ the documents|having seen|to have seen|to see|that he seen|having see#deny + having + participe passé (action antérieure).` },
{ id: "traps", name: "Abysse des Pièges Natifs", stat: "per", desc: "Cinq phrases presque identiques. Une seule est juste.", sub: "Quelle phrase est correcte ?", en: false, q: `Phrase correcte ?|I look forward to hearing from you|I look forward to hear from you|I am looking forward to hear from you|I look forward hearing from you|I look forward for hearing from you#look forward to : to est une préposition → + -ing.
Phrase correcte ?|She's been living here for five years|She lives here since five years|She is living here for five years|She has lived here since five years|She's living here since five years#Durée jusqu'à maintenant → present perfect + for.
Phrase correcte ?|Neither of them has arrived|Neither of them have not arrived|Neither of them hasn't arrived|None of them haven't arrived|Neither of them are arrived#neither est déjà négatif, verbe au singulier (formel).
Phrase correcte ?|I wish I had known earlier|I wish I knew earlier|I wish I would know earlier|I wish I have known earlier|I wish I had knew earlier#Regret passé → wish + past perfect.
Phrase correcte ?|The information you gave me was useful|The informations you gave me were useful|The information you gave me were useful|An information you gave me was useful|The informations you gave me was useful#information est indénombrable : singulier, sans -s.
Phrase correcte ?|Hardly had I arrived when the phone rang|Hardly I had arrived when the phone rang|Hardly had I arrived than the phone rang|Hardly did I arrived when the phone rang|Hardly I arrived when the phone rang#Hardly en tête → inversion, suivi de when.
Phrase correcte ?|He suggested that we leave early|He suggested us to leave early|He suggested that we leaving early|He suggested us leaving early to|He suggested to us to leave early#suggest that + sujet + base. Jamais « suggest someone to ».
Phrase correcte ?|Despite being tired, she finished the race|Despite she was tired, she finished the race|Despite of being tired, she finished the race|In spite being tired, she finished the race|Although being tired she finished, the race#despite + -ing ou nom. Jamais « despite of ».
Phrase correcte ?|It's the first time I've been here|It's the first time I'm here|It's the first time I was here|It's the first time I come here|It's the first time I am coming here#It's the first time + present perfect.
Phrase correcte ?|Had I known, I would have come|If I would have known, I would have come|Had I knew, I would have come|If I had known, I would come yesterday|Had I known, I had come#Inversion formelle : Had I known = If I had known.
Phrase correcte ?|Not only is he smart, but he is also kind|Not only he is smart, but he is also kind|Not only is he smart, but also he is kind too|Not only smart is he, but also kind|Not only he smart is, but kind also#Not only en tête → inversion de l'auxiliaire.
Phrase correcte ?|I'm used to working late|I'm used to work late|I used to working late|I'm use to working late|I'm used working late#be used to + -ing = être habitué à.
Phrase correcte ?|The police are investigating the case|The police is investigating the case|The polices are investigating the case|A police is investigating the case|The police investigates on the case#police est toujours pluriel : the police are.
Phrase correcte ?|Whom did you speak to?|Whom did you speak?|To who did you spoke?|Whom you spoke to?|To whom you did speak?#Préposition en fin de phrase (ou To whom did you speak ?), avec did + base.
Phrase correcte ?|By this time next year, I'll have graduated|By this time next year, I'll graduate already|By this time next year, I graduated|By this time next year, I'll have graduate|By this time next year, I'm graduating already#by + moment futur → futur antérieur : will have + participe passé.` },
{ id: "lexicon", name: "Le Dernier Lexique", stat: "lex", desc: "Le vocabulaire rare des natifs cultivés (C2).", sub: "Que signifie ce mot ?", q: `ubiquitous|omniprésent|ambigu|unique|bruyant|ancien#ubiquitous = présent partout.
ephemeral|éphémère, de courte durée|éternel|enfantin|électrique|fragile#ephemeral = qui ne dure pas.
to procrastinate|remettre à plus tard|anticiper|prolonger|proclamer|travailler dur#procrastinate = tout repousser au lendemain.
meticulous|méticuleux, minutieux|méfiant|médiocre|minuscule|maladroit#meticulous = attentif au moindre détail.
serendipity|une heureuse découverte par hasard|la sérénité|la nostalgie|la paresse|une coïncidence malheureuse#serendipity = trouver par chance ce qu'on ne cherchait pas.
to scrutinise|examiner minutieusement|griffonner|voter|ignorer|critiquer violemment#scrutinise = passer au crible.
cumbersome|encombrant, lourd|concombre|confortable|compliqué à comprendre|inutile#cumbersome = peu pratique, encombrant.
to galvanise|stimuler, pousser à agir|décourager|recouvrir de métal seulement|électrocuter|fatiguer#galvanise = électriser, motiver un groupe.
resilient|résilient, qui se remet vite|réticent|résigné|rebelle|résident#resilient = qui rebondit après les difficultés.
a conundrum|une énigme, un casse-tête|un tambour|une conspiration|un dilemme moral résolu|un conflit#conundrum = problème difficile à résoudre.
to exacerbate|aggraver|exagérer|exaspérer|exécuter|calmer#exacerbate = rendre pire (un problème).
candid|franc, sincère|candide, naïf|brillant|sucré|prudent#candid = honnête et direct. Faux ami : candide = naive.
to relish|savourer|relâcher|répéter|refuser|rejeter#relish = apprécier pleinement.
a plethora|une pléthore, une surabondance|une plainte|une maladie|un manque|une prière#a plethora of = énormément de.
to quell|réprimer, étouffer|questionner|tuer|écrire|crier#quell a rebellion = écraser une révolte.` }
];
