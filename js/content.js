// =====================================================================
// Contenu pédagogique : données des portes et générateurs de questions.
// Les 30 portes d'origine sont ici ; les portes supplémentaires (dont la prononciation) sont dans js/gates/.
// Pour ajouter des questions, ajoute des lignes dans les listes ci-dessous.
// Format des listes "D" :  question|bonne réponse|piège|piège…#explication
// (___ dans la question = le trou à compléter)
// =====================================================================
import { S } from "./state.js";
import { esc, shuffle, pick, norm, fillQ } from "./util.js";
import A1_MORE from "./gates/a1.js";
import A2_MORE from "./gates/a2.js";
import B1_MORE from "./gates/b1.js";
import B2_MORE from "./gates/b2.js";
import { C1 as C1_MORE, SSPLUS } from "./gates/elite.js";
import S_MORE from "./gates/s.js";
import SPEAK from "./gates/speak.js";

// ---------- Verbes irréguliers : base|prétérit|participe|traduction ----------
export const VERBS = `be|was/were|been|être
become|became|become|devenir
begin|began|begun|commencer
break|broke|broken|casser
bring|brought|brought|apporter
build|built|built|construire
buy|bought|bought|acheter
catch|caught|caught|attraper
choose|chose|chosen|choisir
come|came|come|venir
cost|cost|cost|coûter
cut|cut|cut|couper
do|did|done|faire
draw|drew|drawn|dessiner
dream|dreamt/dreamed|dreamt/dreamed|rêver
drink|drank|drunk|boire
drive|drove|driven|conduire
eat|ate|eaten|manger
fall|fell|fallen|tomber
feel|felt|felt|ressentir
fight|fought|fought|se battre
find|found|found|trouver
fly|flew|flown|voler (dans les airs)
forget|forgot|forgotten|oublier
forgive|forgave|forgiven|pardonner
freeze|froze|frozen|geler
get|got|got/gotten|obtenir
give|gave|given|donner
go|went|gone|aller
grow|grew|grown|grandir
have|had|had|avoir
hear|heard|heard|entendre
hide|hid|hidden|cacher
hit|hit|hit|frapper
hold|held|held|tenir
hurt|hurt|hurt|blesser
keep|kept|kept|garder
know|knew|known|savoir, connaître
lead|led|led|mener
learn|learnt/learned|learnt/learned|apprendre
leave|left|left|quitter, partir
lend|lent|lent|prêter
let|let|let|laisser
lose|lost|lost|perdre
make|made|made|fabriquer
mean|meant|meant|signifier
meet|met|met|rencontrer
pay|paid|paid|payer
put|put|put|mettre
read|read|read|lire
ride|rode|ridden|monter (vélo, cheval)
ring|rang|rung|sonner
rise|rose|risen|s'élever
run|ran|run|courir
say|said|said|dire
see|saw|seen|voir
sell|sold|sold|vendre
send|sent|sent|envoyer
shoot|shot|shot|tirer
show|showed|shown|montrer
sing|sang|sung|chanter
sit|sat|sat|s'asseoir
sleep|slept|slept|dormir
speak|spoke|spoken|parler
spend|spent|spent|dépenser, passer (du temps)
stand|stood|stood|être debout
steal|stole|stolen|voler (dérober)
swim|swam|swum|nager
take|took|taken|prendre
teach|taught|taught|enseigner
tell|told|told|raconter
think|thought|thought|penser
throw|threw|thrown|lancer
understand|understood|understood|comprendre
wake|woke|woken|se réveiller
wear|wore|worn|porter (un vêtement)
win|won|won|gagner
write|wrote|written|écrire`.split("\n").map(l => { const [b, p, pp, fr] = l.split("|"); return { b, p, pp, fr }; });

const VERBS_BASIC = new Set("be begin break bring buy choose come do drink drive eat fall feel find forget get give go have hear know leave lose make meet pay put read run say see sell send sit sleep speak take tell think understand write".split(" "));

// ---------- Paires français / anglais ----------
const VOCAB = [["s'entraîner", "to train"], ["une séance de sport", "a workout"], ["la force", "strength"], ["le poids", "weight"], ["un échauffement", "a warm-up"], ["la douleur", "pain"], ["un objectif", "a goal"], ["la sueur", "sweat"],
["un écran", "a screen"], ["un clavier", "a keyboard"], ["une souris", "a mouse"], ["un mot de passe", "a password"], ["télécharger", "to download"], ["un ordinateur portable", "a laptop"], ["une panne", "a breakdown"], ["un réseau", "a network"],
["un entretien d'embauche", "a job interview"], ["un stage", "an internship"], ["le salaire", "the salary"], ["un collègue", "a coworker"], ["une réunion", "a meeting"], ["embaucher", "to hire"], ["un patron", "a boss"], ["une compétence", "a skill"],
["la boulangerie", "the bakery"], ["le loyer", "the rent"], ["un voisin", "a neighbour"], ["les courses", "the groceries"], ["la facture", "the bill"], ["un rendez-vous", "an appointment"], ["un trajet", "a journey"], ["un billet", "a ticket"],
["fier", "proud"], ["fatigué", "tired"], ["en colère", "angry"], ["effrayé", "scared"], ["paresseux", "lazy"], ["courageux", "brave"], ["bruyant", "noisy"], ["sage", "wise"],
["toujours", "always"], ["parfois", "sometimes"], ["jamais", "never"], ["bientôt", "soon"], ["déjà", "already"], ["pas encore", "not yet"], ["pourtant", "however"], ["d'ailleurs", "besides"]];

const COLORS = [["rouge", "red"], ["bleu", "blue"], ["vert", "green"], ["jaune", "yellow"], ["noir", "black"], ["blanc", "white"], ["gris", "grey"], ["marron", "brown"], ["violet", "purple"], ["rose", "pink"],
["une chaise", "a chair"], ["une fenêtre", "a window"], ["une porte", "a door"], ["un lit", "a bed"], ["une clé", "a key"], ["un sac", "a bag"], ["une montre", "a watch"], ["un stylo", "a pen"], ["une tasse", "a cup"], ["une chaussure", "a shoe"], ["un arbre", "a tree"], ["un oiseau", "a bird"]];

const DAYS = [["lundi", "Monday"], ["mardi", "Tuesday"], ["mercredi", "Wednesday"], ["jeudi", "Thursday"], ["vendredi", "Friday"], ["samedi", "Saturday"], ["dimanche", "Sunday"],
["janvier", "January"], ["février", "February"], ["mars", "March"], ["avril", "April"], ["mai", "May"], ["juin", "June"], ["juillet", "July"], ["août", "August"], ["septembre", "September"], ["octobre", "October"], ["novembre", "November"], ["décembre", "December"],
["le printemps", "spring"], ["l'été", "summer"], ["l'automne", "autumn"], ["l'hiver", "winter"], ["aujourd'hui", "today"], ["demain", "tomorrow"], ["hier", "yesterday"]];

const FAMILY = [["la mère", "mother"], ["le père", "father"], ["la sœur", "sister"], ["le frère", "brother"], ["la tante", "aunt"], ["l'oncle", "uncle"], ["la grand-mère", "grandmother"], ["le grand-père", "grandfather"],
["la fille (enfant)", "daughter"], ["le fils", "son"], ["le mari", "husband"], ["l'épouse", "wife"], ["le neveu", "nephew"], ["la nièce", "niece"], ["les petits-enfants", "grandchildren"], ["un bébé", "a baby"], ["les jumeaux", "twins"], ["le petit ami", "boyfriend"], ["les proches, la famille", "relatives"]];

const PHRASAL = [["give up", "abandonner"], ["look for", "chercher"], ["find out", "découvrir"], ["turn off", "éteindre"], ["turn on", "allumer"], ["get up", "se lever"], ["put off", "reporter, repousser"], ["look after", "s'occuper de"],
["run out of", "ne plus avoir de"], ["give back", "rendre"], ["come back", "revenir"], ["get on with", "bien s'entendre avec"], ["set up", "mettre en place"], ["work out", "s'entraîner / résoudre"], ["break down", "tomber en panne"],
["call back", "rappeler"], ["pick up", "aller chercher, ramasser"], ["show up", "arriver, se pointer"], ["carry on", "continuer"], ["fill in", "remplir (un formulaire)"], ["look forward to", "avoir hâte de"], ["take off", "décoller / enlever"]];

// mot anglais | vrai sens | piège | explication
const FALSE = [["actually", "en fait", "actuellement", "« Actuellement » se dit currently."],
["library", "bibliothèque", "librairie", "« Librairie » se dit bookshop."],
["eventually", "finalement", "éventuellement", "« Éventuellement » se dit possibly."],
["sensible", "raisonnable", "sensible", "« Sensible » se dit sensitive."],
["lecture", "cours magistral", "lecture", "« Lecture » se dit reading."],
["sympathetic", "compatissant", "sympathique", "« Sympathique » se dit nice, friendly."],
["deception", "tromperie", "déception", "« Déception » se dit disappointment."],
["journey", "voyage, trajet", "journée", "« Journée » se dit day."],
["injury", "blessure", "injure", "« Injure » se dit insult."],
["rude", "impoli", "rude", "« Rude » (dur) se dit harsh."],
["comprehensive", "complet, exhaustif", "compréhensif", "« Compréhensif » se dit understanding."],
["to demand", "exiger", "demander", "« Demander » se dit to ask."],
["to attend", "assister à", "attendre", "« Attendre » se dit to wait."],
["to assist", "aider", "assister à", "« Assister à » se dit to attend."],
["gentle", "doux", "gentil", "« Gentil » se dit kind."],
["large", "grand", "large", "« Large » se dit wide."],
["to resume", "reprendre", "résumer", "« Résumer » se dit to sum up."],
["a store", "un magasin", "un store", "« Un store » se dit a blind."],
["a cave", "une grotte", "une cave", "« Une cave » se dit a cellar."],
["a coin", "une pièce de monnaie", "un coin", "« Un coin » se dit a corner."],
["a raisin", "un raisin sec", "un raisin", "« Un raisin » se dit a grape."],
["a prune", "un pruneau", "une prune", "« Une prune » se dit a plum."],
["to pretend", "faire semblant", "prétendre", "« Prétendre » se dit to claim."],
["a location", "un emplacement", "une location", "« Une location » se dit a rental."],
["a chance", "une occasion", "la chance", "« La chance » se dit luck."]];

// phrase | ponctuation | traduction
const SENT = [["I have never been to London", ".", "Je ne suis jamais allé à Londres."],
["She is reading a book right now", ".", "Elle lit un livre en ce moment."],
["We went to the gym yesterday", ".", "Nous sommes allés à la salle hier."],
["What time does the train leave", "?", "À quelle heure part le train ?"],
["He doesn't like waking up early", ".", "Il n'aime pas se lever tôt."],
["How long have you been learning English", "?", "Depuis combien de temps apprends-tu l'anglais ?"],
["If I had more time I would travel", ".", "Si j'avais plus de temps, je voyagerais."],
["They were playing football when it started to rain", ".", "Ils jouaient au foot quand il a commencé à pleuvoir."],
["Could you help me with my homework", "?", "Pourrais-tu m'aider pour mes devoirs ?"],
["My computer is slower than yours", ".", "Mon ordinateur est plus lent que le tien."],
["I will call you as soon as I arrive", ".", "Je t'appellerai dès que j'arrive."],
["Have you already finished your work", "?", "As-tu déjà fini ton travail ?"],
["The meeting was cancelled at the last minute", ".", "La réunion a été annulée à la dernière minute."],
["You should drink more water after training", ".", "Tu devrais boire plus d'eau après l'entraînement."],
["I used to play video games every night", ".", "Avant, je jouais aux jeux vidéo tous les soirs."],
["Where did you buy this jacket", "?", "Où as-tu acheté cette veste ?"],
["She has been working here for two years", ".", "Elle travaille ici depuis deux ans."],
["It is the best film I have ever seen", ".", "C'est le meilleur film que j'aie jamais vu."],
["Don't forget to save your file", ".", "N'oublie pas d'enregistrer ton fichier."],
["We are going to visit our grandparents next week", ".", "Nous allons rendre visite à nos grands-parents la semaine prochaine."]];

const PLURALS = [["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"], ["person", "people"], ["sheep", "sheep"], ["fish", "fish"], ["knife", "knives"], ["wife", "wives"], ["leaf", "leaves"], ["half", "halves"], ["potato", "potatoes"], ["tomato", "tomatoes"], ["box", "boxes"], ["city", "cities"], ["baby", "babies"], ["bus", "buses"], ["goose", "geese"], ["life", "lives"], ["wolf", "wolves"], ["watch", "watches"], ["day", "days"]];

const COMPS = [["big", "bigger", "the biggest"], ["small", "smaller", "the smallest"], ["good", "better", "the best"], ["bad", "worse", "the worst"], ["far", "further/farther", "the furthest/the farthest"], ["happy", "happier", "the happiest"], ["expensive", "more expensive", "the most expensive"], ["easy", "easier", "the easiest"], ["hot", "hotter", "the hottest"], ["beautiful", "more beautiful", "the most beautiful"], ["fast", "faster", "the fastest"], ["thin", "thinner", "the thinnest"], ["interesting", "more interesting", "the most interesting"], ["old", "older", "the oldest"], ["funny", "funnier", "the funniest"], ["strong", "stronger", "the strongest"], ["difficult", "more difficult", "the most difficult"], ["early", "earlier", "the earliest"]];

// ---------- Questions à choix : "question|bonne|piège…#explication" ----------
const D = {
tobe: `I ___ a student|am|is|are#I → am.
She ___ tired|is|am|are#he/she/it → is.
They ___ at home|are|is|am#we/you/they → are.
We ___ two cats|have|has|are#Posséder = have ; we → have.
He ___ a new car|has|have|is#Posséder = have ; he/she/it → has.
It ___ cold today|is|are|has#Météo : it is + adjectif (il fait froid = it is cold).
You ___ my best friend|are|is|am#you → are, au singulier comme au pluriel.
My brother ___ 20 years old|is|has|have#En anglais, on « est » un âge : he is 20.
I ___ hungry|am|have|has#J'ai faim = I am hungry.
The children ___ in the garden|are|is|am#children est un pluriel → are.
Paul and Lisa ___ a big house|have|has|are#Paul and Lisa = they → have.
___ you French?|Are|Is|Have#Nationalité → be ; en question, on inverse : Are you… ?
She ___ got blue eyes|has|have|is#have got : he/she/it → has got.
I ___ cold|am|have|has#J'ai froid = I am cold.
There ___ three apples on the table|are|is|have#Nom au pluriel → there are.`,
pron: `___ is my sister. (Marie)|She|He|It|They#Marie est une fille et le sujet de la phrase → she.
This is Tom and ___ dog.|his|her|its|their#Le possessif s'accorde avec le possesseur : Tom → his.
Lisa loves ___ cat.|her|his|its|their#Le possessif s'accorde avec le possesseur : Lisa → her.
The dog is eating ___ food.|its|it's|his|their#its = son (possessif). it's = it is.
My parents? I call ___ every day.|them|they|their|theirs#Complément au pluriel (après le verbe) → them.
Can you help ___? (moi)|me|I|my|mine#« Moi » complément, après le verbe → me.
This book is ___. (à moi)|mine|my|me|I#« À moi », sans nom derrière → mine.
We love ___ new house.|our|us|we|ours#Possessif devant un nom : we → our.
Give ___ the key. (à lui)|him|he|his|her#« Lui » complément, masculin → him.
___ are late! (vous)|You|Your|Yours|Yourself#« Vous » sujet → you.
The students and ___ teacher.|their|there|they're|them#their = leur. there = là. they're = they are.
Is this ___ phone? (ton)|your|you're|yours|you#you're = you are.`,
prep: `I was born ___ 2004|in|on|at#Année → in.
See you ___ Monday|on|in|at#Jours de la semaine → on.
The meeting is ___ 3 pm|at|in|on#Heure précise → at.
I live ___ Lyon|in|at|on#Ville ou pays → in.
My birthday is ___ May|in|on|at#Mois → in.
The keys are ___ the table|on|in|at#Sur une surface → on.
She is ___ home|at|in|on#On dit toujours at home.
We go skiing ___ winter|in|on|at#Saison → in.
My birthday is ___ 14th July|on|in|at#Date précise → on.
He's ___ the bus|on|in|at#On dit on the bus, on the train, mais in a car.
She's waiting ___ the car|in|on|at#On dit in the car (mais on the bus).
I work ___ night|at|in|on#On dit at night (mais in the morning).
It depends ___ the weather|on|of|at#depend on, jamais « depend of ».
I'm interested ___ music|in|by|on#interested in, toujours.
Listen ___ me!|to|at|for#listen to + quelqu'un ou quelque chose.
Wait ___ me!|for|to|at#wait for = attendre quelqu'un ou quelque chose.
I'm good ___ maths|at|in|on#good at = doué en.`,
simple: `She usually ___ to work by bus|goes|is going|go#usually → habitude → présent simple.
Look! It ___|is raining|rains|rain#Look! → action en cours → présent continu.
I ___ coffee every morning|drink|am drinking|drinks#every morning → habitude → présent simple.
Be quiet, the baby ___|is sleeping|sleeps|sleep#Action en train de se passer → présent continu.
Water ___ at 100 degrees|boils|is boiling|boil#Vérité générale → présent simple.
What ___ right now?|are you doing|do you do|you do#right now → présent continu.
He ___ football on Saturdays|plays|is playing|play#on Saturdays → habitude → présent simple (+ -s avec he).
I ___ you are right|think|am thinking|thinks#Verbes d'opinion (think, know, like) : rarement en -ing.
They ___ a film at the moment|are watching|watch|watches#at the moment → présent continu.
I ___ French and English|speak|am speaking|speaks#Fait permanent → présent simple.
Listen! Someone ___ at the door|is knocking|knocks|knock#Listen! → action en cours → présent continu.
She ___ chocolate|loves|is loving|love#love est un verbe d'état : pas de -ing ; she → loves.`,
questions: `___ you like pizza?|Do|Does|Did|Are#Question au présent avec I/you/we/they → do.
___ she work here?|Does|Do|Is|Did#he/she/it → does.
___ you go out last night?|Did|Do|Does|Were#last night → passé → did.
Where ___ he live?|does|do|is|did#he/she/it → does.
What time ___ the film start?|does|do|is|are#the film = it → does.
___ they play tennis yesterday?|Did|Do|Does|Were#yesterday → passé → did.
How ___ you spell your name?|do|does|are|is#you + verbe d'action au présent → do.
Why ___ you crying?|are|do|does|did#Avec -ing on utilise be : are you crying.
___ it rain a lot in London?|Does|Do|Is|Are#it + verbe d'action (rain) → does.
What ___ you do last weekend?|did|do|does|were#last weekend → passé → did.`,
quant: `I don't have ___ money|any|some|many#Négation → any.
There are ___ apples on the table|some|any|much#Phrase affirmative → some.
How ___ sugar do you want?|much|many|any#sugar est indénombrable → much.
How ___ brothers do you have?|many|much|any#brothers est dénombrable → many.
Would you like ___ tea?|some|any|many#Offre polie → some, même dans une question.
I haven't got ___ friends here|many|much|some#friends est dénombrable → many.
There isn't ___ milk left|much|many|some#milk est indénombrable → much.
Is there ___ bread?|any|some|many#Question (qui n'est pas une offre) → any.
We need ___ eggs|some|any|much#Phrase affirmative → some.
There are too ___ people here|many|much|any#people est dénombrable → too many.
I don't have ___ time|much|many|some#time est indénombrable → much.`,
spell: `nécessaire|necessary|neccessary|necesary|neccesary#Un c, deux s : ne-c-e-ss-ary.
une adresse|address|adress|addres|adresse#Deux d et deux s : a-dd-re-ss.
recevoir|receive|recieve|receeve|resieve#« i avant e, sauf après c » : rec-ei-ve.
demain|tomorrow|tommorow|tomorow|tommorrow#Un m, deux r : to-m-o-rr-ow.
les affaires (business)|business|buisness|bussiness|busness#busy + ness : busi-ness.
différent|different|diferent|diffrent|differant#Deux f, et -ent à la fin : di-ff-er-ent.
l'environnement|environment|enviroment|environement|envirenment#environ + ment : n'oublie pas le n.
le gouvernement|government|goverment|governement|governmant#govern + ment : le n reste.
bizarre|weird|wierd|weard|wird#Exception à la règle : e avant i dans w-ei-rd.
mercredi|Wednesday|Wensday|Wednsday|Wendesday#Le premier d est muet mais s'écrit : Wed-nes-day.
février|February|Febuary|Februery|Febrary#On oublie souvent le premier r : Feb-ru-ary.
un ami|friend|freind|frend|friand#fri + end : la fin du mot, c'est end.
jusqu'à|until|untill|untile|antil#Un seul l à la fin (mais till en prend deux).
beau, belle|beautiful|beatiful|beautifull|beutiful#beau + ti + ful : -ful ne prend qu'un l.
la connaissance|knowledge|knowlege|knoledge|knowladge#know + ledge : k muet et d avant ge.
probablement|probably|probabaly|probaly|propably#probab + ly : deux b.`,
perfect: `I ___ to Spain last year|went|have been|have gone#last year → moment terminé et daté → prétérit.
I ___ sushi. (jamais de ma vie)|have never eaten|never ate|didn't eat#Expérience de vie → present perfect + never.
She ___ here since 2020|has lived|lived|lives#since + durée qui continue → present perfect.
We ___ the film yesterday|saw|have seen|have saw#yesterday → moment passé et daté → prétérit.
___ to New York?|Have you ever been|Did you ever go|Were you ever#ever → expérience de vie → present perfect.
I ___ my keys! I can't find them|have lost|lost|lose#Conséquence visible maintenant → present perfect.
Shakespeare ___ many plays|wrote|has written|has wrote#Personne décédée → action terminée → prétérit.
I ___ him for ten years|have known|knew|know#for + durée qui continue → present perfect.
When ___ you arrive?|did|have|has#When → moment précis → prétérit.
He ___ the room. (vient de)|has just left|just leaves|is just left#Venir de = have/has just + participe passé.
I ___ three coffees today|have had|had|have#today n'est pas fini → present perfect.`,
modals: `You ___ wear a seatbelt. It's the law|must|might|could#Obligation forte → must.
You ___ see a doctor, you look ill|should|mustn't|can't#Conseil → should.
I ___ swim when I was five|could|can|must#Capacité dans le passé → could.
It ___ rain later, take an umbrella|might|must|should#Possibilité → might.
You ___ smoke here. It's forbidden|mustn't|don't have to|shouldn't#mustn't = interdiction.
You ___ come if you don't want to|don't have to|mustn't|can't#don't have to = pas obligé.
___ I open the window?|Can|Do|Am|Have#Demander la permission → Can I… ?
She ___ be at home, her car is outside|must|can|should#Déduction presque certaine → must.
He ___ be French, he doesn't speak a word of it|can't|mustn't|doesn't have to#Déduction négative → can't.
We ___ leave now, the train is at 6|have to|has to|must to#must n'est jamais suivi de to.`,
cond: `If it rains, I ___ at home|will stay|would stay|stayed#Condition réelle : if + présent, will + verbe.
If I ___ rich, I would buy a house|were|am|will be#Hypothèse : if + prétérit (were), would + verbe.
If you heat ice, it ___|melts|would melt|melted#Vérité générale : présent + présent.
If I had known, I ___ you|would have told|would tell|will tell#Regret : if + past perfect, would have + participe passé.
I would call her if I ___ her number|had|have|would have#would dans l'autre partie → if + prétérit.
If she ___ harder, she will pass|works|will work|would work#Jamais de will juste après if.
What would you do if you ___ the lottery?|won|win|will win#Hypothèse : if + prétérit (won), would + verbe.
If we ___ earlier, we wouldn't have missed the train|had left|left|would leave#Passé imaginaire : if + past perfect, would have + participe passé.
Unless you hurry, you ___ late|will be|would be|are#unless = if not : condition réelle → will.`,
trad: `J'ai 22 ans|I am 22 years old|I have 22 years|I have 22 years old#L'âge se dit avec be.
Je suis d'accord|I agree|I am agree|I am agreed#agree est un verbe : I agree, jamais « I am agree ».
Il fait froid|It is cold|It makes cold|He is cold#Météo : it is + adjectif, jamais « it makes ».
J'habite ici depuis 3 ans|I have lived here for 3 years|I live here since 3 years|I am living here since 3 years#depuis + durée → present perfect + for.
Ça dépend|It depends|It's depend|It depends of#It depends (on), jamais « depends of ».
Il y a deux heures|Two hours ago|There is two hours|Since two hours#« Il y a » (dans le passé) = durée + ago.
Je vais au travail en voiture|I drive to work|I go to work in car|I go at work by car#Aller en voiture = drive ; on dit go to work, jamais « at work ».
Je n'ai rien fait|I didn't do anything|I didn't do nothing|I have do nothing#Pas de double négation en anglais.
Explique-le-moi|Explain it to me|Explain me it|Explain me#explain something to someone : explain it to me.
Les informations sont utiles|The information is useful|The informations are useful|The information are useful#information est indénombrable : jamais de -s.
Je cherche un travail|I'm looking for a job|I'm searching a work|I look a job#chercher = look for ; un travail (un poste) = a job.
Il est en train de manger|He is eating|He is in train to eat|He eats now#être en train de → présent continu : he is eating.
Ça fait longtemps !|Long time no see!|It makes long time!|It's long time!#Expression figée pour des retrouvailles : Long time no see!`,
idioms: `It's a piece of cake|C'est très facile|C'est délicieux|C'est un cadeau#« Un morceau de gâteau » : aussi facile à avaler.
Break a leg!|Bonne chance !|Fais attention !|Repose-toi#Se dit aux artistes avant d'entrer en scène.
It's raining cats and dogs|Il pleut à verse|Il y a beaucoup d'animaux|Il pleut un peu#« Il pleut des chats et des chiens » : il pleut des cordes.
It costs an arm and a leg|Ça coûte les yeux de la tête|Ça fait mal|Ça ne coûte rien#Payer « un bras et une jambe » = très cher.
Once in a blue moon|Très rarement|La nuit|Chaque mois#Une « lune bleue » est rare : ça n'arrive presque jamais.
To hit the books|Réviser sérieusement|Jeter ses livres|Écrire un livre#« Frapper les livres » = s'y mettre à fond, bûcher.
To feel under the weather|Être un peu malade|Avoir froid|Être triste à cause de la pluie#« Sous la météo » = pas en forme.
Let's call it a day|Arrêtons-nous pour aujourd'hui|Téléphonons|Commençons la journée#« Appelons ça une journée » : la journée est finie.
To beat around the bush|Tourner autour du pot|Jardiner|Se battre#« Battre autour du buisson » = éviter le sujet.
The ball is in your court|C'est à toi de décider|Tu as perdu|Va chercher la balle#Image du tennis : la balle est dans ton camp.
To spill the beans|Vendre la mèche|Rater une recette|Faire une erreur#« Renverser les haricots » = révéler un secret.
To be on cloud nine|Être aux anges|Être distrait|Voyager en avion#« Sur le nuage numéro neuf » = fou de joie.
No pain, no gain|On n'a rien sans effort|N'aie pas mal|Ne force pas#Pas de douleur, pas de progrès : l'effort paie.
To get cold feet|Se dégonfler au dernier moment|Avoir froid aux pieds|Tomber malade#« Avoir les pieds froids » = avoir peur au dernier moment.
To kill two birds with one stone|Faire d'une pierre deux coups|Aller à la chasse|Être cruel#« Tuer deux oiseaux avec une pierre » : même image qu'en français.`,
passive: `The house ___ in 1990|was built|built|is building|has build#Passif au passé : was/were + participe passé.
English ___ all over the world|is spoken|speaks|is speaking|spoken#Passif au présent : is/are + participe passé.
My bike ___ yesterday|was stolen|stole|has stolen|is stolen#yesterday → passif au prétérit : was + participe passé.
The letters ___ tomorrow|will be sent|will send|are sent|sent#Passif au futur : will be + participe passé.
This song ___ by Adele|was written|wrote|is writing|has written#by + auteur → passif : was + participe passé.
The room ___ every day|is cleaned|cleans|cleaned|is cleaning#Habitude au passif : is + participe passé.
A new bridge ___ at the moment|is being built|is building|builds|is built#En cours → is being + participe passé.
Many mistakes ___ last year|were made|made|were making|have made#Sujet au pluriel, au passé → were + participe passé.
The results ___ next week|will be published|will publish|are publishing|published#Passif au futur : will be + participe passé.`,
reported: `He said: "I am tired." → He said he ___ tired|was|is|were|has been#Au discours indirect, on recule d'un temps : am → was.
She said: "I will call you." → She said she ___ call me|would|will|can|should#will → would.
He said: "I can swim." → He said he ___ swim|could|can|may|will#can → could.
She said: "I have finished." → She said she ___ finished|had|has|have|was#present perfect → past perfect.
"Where do you live?" → He asked me where I ___|lived|live|did live|do live#Pas d'inversion ni de do dans la question indirecte.
"Close the door." → She told me ___ the door|to close|close|closing|that I close#Ordre au discours indirect : tell someone to + verbe.
"Don't be late." → He told us ___ late|not to be|to not being|don't be|we not be#Ordre négatif : tell someone not to + verbe.
She said: "I saw him." → She said she ___ him|had seen|has seen|saw|sees#Au discours indirect, prétérit → past perfect.
"Are you ready?" → He asked if I ___ ready|was|am|did|were being#On recule d'un temps : are → was (avec I).`,
colloc: `___ a mistake|make|do|take#make a mistake = faire une erreur.
___ your homework|do|make|give#do pour les tâches : do your homework.
___ a decision|make|do|give#make a decision = prendre une décision.
___ the shopping|do|make|give#do pour les tâches : do the shopping.
___ a phone call|make|do|give#make a phone call = passer un appel.
___ your best|do|make|give#do your best = faire de son mieux.
___ money|make|do|give#make money = gagner de l'argent.
___ the dishes|do|make|give#do pour les tâches : do the dishes = faire la vaisselle.
___ friends|make|do|give#make friends = se faire des amis.
___ exercise|do|make|give#do pour les activités : do exercise = faire du sport.
___ a noise|make|do|give#make a noise = faire du bruit.
___ business|do|make|give#do business = faire des affaires.
___ an effort|make|do|give#make an effort = faire un effort.
___ someone a favour|do|make|give#do someone a favour = rendre service à quelqu'un.
___ progress|make|do|give#make progress = progresser.
___ a photo|take|make|do#Prendre une photo = take a photo.`,
linking: `___ it was raining, we went out|Although|Despite|However|Because#although + phrase complète.
___ the rain, we went out|Despite|Although|However|Even#despite + nom (jamais + phrase).
It was expensive. ___, I bought it|However|Although|Despite|Because#However, en début de phrase + virgule = cependant.
I stayed home ___ I was sick|because|although|however|despite#because = parce que (cause).
She studied hard; ___, she passed|therefore|however|although|despite#therefore = donc (conséquence).
I like tea, ___ my sister prefers coffee|whereas|despite|therefore|unless#whereas = alors que (contraste entre deux faits).
You won't pass ___ you study|unless|despite|whereas|although#unless = à moins que, sauf si.
___ being tired, he kept running|Despite|Although|However|Even#despite + nom ou verbe en -ing.
He's rich. ___, he's not happy|Nevertheless|Because|Unless|Despite#Nevertheless = néanmoins, en début de phrase.
Take an umbrella ___ it rains|in case|despite|whereas|however#in case = au cas où.`
};

// =====================================================================
// Générateurs : chacun renvoie une question
// { type: "choice" | "verb" | "input" | "order", prompt, sub, ... }
// =====================================================================
const parse = t => t.trim().split("\n").map(l => {
  const [m, x] = l.split("#"); const p = m.split("|");
  return { q: p[0], a: p[1], d: p.slice(2), x: x || "" };
});

function choiceGen(key, sub, en = true) {
  const items = parse(D[key]);
  return () => {
    const it = pick(items);
    return {
      type: "choice", prompt: it.q, sub, en, opts: shuffle([it.a, ...it.d]), ans: it.a,
      fix: `<b>${esc(fillQ(it.q, it.a))}</b>${it.x ? "<br>" + esc(it.x) : ""}`, label: fillQ(it.q, it.a),
      why: it.x || `La bonne réponse est « ${it.a} ».`
    };
  };
}

function pairGen(pool, sub, reverse = false) {
  return () => {
    const p = pick(pool); const [q, a] = reverse ? [p[1], p[0]] : [p[0], p[1]];
    const ds = shuffle(pool.filter(x => x !== p)).slice(0, 3).map(x => reverse ? x[0] : x[1]);
    return { type: "choice", prompt: q, sub, en: reverse, opts: shuffle([a, ...ds]), ans: a, fix: `<b>${esc(q)}</b> = ${esc(a)}`, label: `${q} = ${a}`, why: `« ${a} » est la traduction de « ${q} ». Vocabulaire à mémoriser.`, speakText: reverse ? q : a };
  };
}

// Les verbes ratés reviennent plus souvent
function verbGen(filter) {
  return () => {
    const pool = VERBS.filter(filter).flatMap(v => Array(1 + Math.min(S.missed[v.b] || 0, 4)).fill(v));
    const v = pick(pool);
    return {
      type: "verb", prompt: v.b, sub: v.fr, en: true, key: v.b, hint: [v.p.split("/")[0], v.pp.split("/")[0]],
      check: (a, b) => v.p.split("/").includes(norm(a)) && v.pp.split("/").includes(norm(b)),
      fix: `<b>${v.b}</b> → ${v.p.replace("/", " / ")} → ${v.pp.replace("/", " / ")}`, label: `${v.b} – ${v.p} – ${v.pp}`,
      why: v.p.endsWith("ed") ? `« ${v.b} » est régulier : on ajoute -ed au prétérit et au participe passé.` : `« ${v.b} » (${v.fr}) est irrégulier : pas de -ed. Prétérit « ${v.p.replace("/", " » ou « ")} », participe passé « ${v.pp.replace("/", " » ou « ")} ». À apprendre par cœur.`
    };
  };
}

function inputQ(prompt, sub, answers, fixText, en = true) {
  const list = answers.split("/");
  return { type: "input", prompt, sub, en, hint: list[0], check: v => list.some(a => norm(a) === norm(v)), fix: `<b>${esc(fixText)}</b>`, label: fixText };
}

// Nombres en lettres
const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = ",,twenty,thirty,forty,fifty,sixty,seventy,eighty,ninety".split(",");
export function words(n, and = true) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[n / 10 | 0] + (n % 10 ? "-" + ONES[n % 10] : "");
  const r = n % 100;
  return ONES[n / 100 | 0] + " hundred" + (r ? (and ? " and " : " ") + words(r, and) : "");
}
function genNumber() {
  const r = Math.random();
  const n = r < .3 ? (Math.random() * 20 | 0) : r < .75 ? 20 + (Math.random() * 80 | 0) : 100 + (Math.random() * 900 | 0);
  const a = words(n), b = words(n, false);
  const q = inputQ(String(n), "Écris ce nombre en lettres anglaises", a, a);
  const flat = s => s.replace(/-/g, " ");
  q.check = v => { const x = flat(norm(v)); return x === flat(a) || x === flat(b); };
  q.speakText = a;
  q.why = n >= 100 ? "Hundred ne prend jamais de s (two hundred). Le and après hundred est britannique : facultatif."
    : n >= 20 && n % 10 ? "Entre la dizaine et l'unité, on met un trait d'union : twenty-one, forty-five."
    : n >= 13 && n < 20 ? "De 13 à 19, les nombres finissent par -teen (thirteen, fifteen). Attention : forty s'écrit sans u."
    : "Nombre de base, à connaître par cœur.";
  return q;
}

// Dire l'heure
export function timeWords(h, m) {
  const H = x => words(((x - 1 + 12) % 12) + 1);
  if (m === 0) return `${H(h)} o'clock`;
  if (m === 15) return `a quarter past ${H(h)}`;
  if (m === 30) return `half past ${H(h)}`;
  if (m === 45) return `a quarter to ${H(h + 1)}`;
  return m < 30 ? `${words(m)} past ${H(h)}` : `${words(60 - m)} to ${H(h + 1)}`;
}
function genTime() {
  const h = 1 + (Math.random() * 12 | 0), m = (Math.random() * 12 | 0) * 5;
  const ans = timeWords(h, m); const set = new Set([ans]);
  const cands = [[h, (60 - m) % 60], [h + 1, m], [h - 1, m], [h, (m + 30) % 60], [h, (m + 15) % 60], [h, (m + 5) % 60]];
  for (const [hh, mm] of shuffle(cands)) { if (set.size >= 4) break; set.add(timeWords(hh, mm)); }
  const shown = `${h}:${String(m).padStart(2, "0")}`;
  return {
    type: "choice", prompt: shown, sub: "What time is it? Choisis la bonne façon de le dire", en: false, opts: shuffle([...set]), ans,
    fix: `<b>${shown}</b> = It's ${esc(ans)}`, label: `${shown} = ${ans}`, speakText: "It's " + ans,
    why: m === 0 ? "Heure pile : on dit l'heure suivie de o'clock."
      : m === 30 ? "30 minutes = half past + l'heure (la demie après l'heure)."
      : m === 15 ? "15 minutes = a quarter past + l'heure."
      : m === 45 ? "45 minutes = a quarter to + l'heure suivante (il manque un quart d'heure)."
      : m < 30 ? "Jusqu'à la demie, on compte les minutes après l'heure : minutes + past + heure."
      : "Après la demie, on compte les minutes qui restent avant l'heure suivante : minutes + to + heure suivante."
  };
}

function pluralWhy(s, p) {
  if (s === p) return `« ${s} » ne change pas au pluriel.`;
  if (/(f|fe)$/.test(s) && p.endsWith("ves")) return "Les mots en -f ou -fe font leur pluriel en -ves.";
  if (/[^aeiou]y$/.test(s) && p.endsWith("ies")) return "Consonne + y : le y devient i, puis on ajoute -es.";
  if (p === s + "es") return "Après -s, -x, -ch, -sh ou -o, on ajoute -es.";
  if (p === s + "s") return "Pluriel régulier : on ajoute simplement -s.";
  return "Pluriel irrégulier : il ne suit aucune règle, à apprendre par cœur.";
}
function genPlural() { const [s, p] = pick(PLURALS); const q = inputQ(s, "Donne le pluriel", p, `${s} → ${p}`); q.why = pluralWhy(s, p); return q; }

function genComp() {
  const c = pick(COMPS); const sup = Math.random() < .5;
  const q = inputQ(c[0], sup ? "Superlatif (avec the) : le plus…" : "Comparatif : plus…", sup ? c[2] : c[1],
    `${c[0]} → ${c[1].replace("/", " / ")} → ${c[2].replace("/", " / ")}`);
  const a = c[0], b = c[1];
  q.why = b.startsWith("more") ? "Adjectif long (deux syllabes ou plus) : more… pour le comparatif, the most… pour le superlatif, sans -er."
    : !b.startsWith(a.slice(0, 2)) || a === "far" ? "Comparatif irrégulier : à apprendre par cœur."
    : /y$/.test(a) ? "Adjectif en -y : le y devient i, puis -er / the -iest."
    : b === a + a.slice(-1) + "er" ? "Voyelle courte + consonne finale : on double la consonne avant -er / -est."
    : "Adjectif court : on ajoute -er pour le comparatif, the + -est pour le superlatif.";
  return q;
}

function genFalse() {
  const f = pick(FALSE);
  const others = shuffle(FALSE.filter(x => x !== f && x[1] !== f[2] && x[1] !== f[1])).slice(0, 2).map(x => x[1]);
  return { type: "choice", prompt: f[0], sub: "Que signifie vraiment ce mot ?", en: true, opts: shuffle([f[1], f[2], ...others]), ans: f[1], fix: `<b>${f[0]}</b> = ${f[1]}. ${f[3]}`, label: `${f[0]} = ${f[1]}`, why: `Faux ami : « ${f[0]} » veut dire « ${f[1]} », pas « ${f[2]} ». ${f[3]}` };
}

function genOrder() {
  const s = pick(SENT); const w = s[0].split(" "); let sh;
  do { sh = shuffle(w); } while (sh.join(" ") === s[0]);
  return { type: "order", prompt: s[2], sub: "Reconstruis la phrase en anglais", en: false, words: sh, ans: s[0], fix: `<b>${s[0]}${s[1]}</b>`, label: s[0] + s[1], speakText: s[0],
    why: (s[1] === "?" ? "Question : le mot interrogatif, puis l'auxiliaire (do, does, is, have…) avant le sujet." : "Ordre de base : sujet + verbe + complément ; les mots de temps (yesterday, now) vont en fin de phrase.") + ` Sens : « ${s[2]} »` };
}

// =====================================================================
// Catégories (niveaux CECR) et les 30 portes
// =====================================================================
export const CATS = [
  { id: "A1", name: "Débutant", rank: "E", desc: "Les bases pour comprendre et te présenter." },
  { id: "A2", name: "Élémentaire", rank: "D", desc: "Le quotidien, les premières règles de grammaire." },
  { id: "B1", name: "Intermédiaire", rank: "C", desc: "Raconter, nuancer, éviter les pièges classiques." },
  { id: "B2", name: "Avancé", rank: "B", desc: "Parler comme un natif : expressions et structures fines." },
  { id: "C1", name: "Élite", rank: "A", desc: "Très difficile : 2 PV seulement, XP doublée." },
  { id: "S", name: "Porte rouge", rank: "S", desc: "Parler en public en anglais (2 PV, XP ×2,5), et le Raid contre la montre." },
  { id: "SS+", name: "Monarque", rank: "SS+", desc: "Le sommet : 1 seul PV, 5 ou 6 choix piégés, XP triplée. Hors du Raid." }
];

export const GAMES = [
  { id: "numbers", cat: "A1", name: "Grotte des Nombres", stat: "mem", desc: "Écris les nombres en lettres (de 0 à 999).", gen: genNumber },
  { id: "colors", cat: "A1", name: "Couloir des Couleurs", stat: "lex", desc: "Couleurs et objets du quotidien.", gen: pairGen(COLORS, "Traduis en anglais") },
  { id: "days", cat: "A1", name: "Horloge du Calendrier", stat: "lex", desc: "Jours, mois et saisons.", gen: pairGen(DAYS, "Traduis en anglais") },
  { id: "family", cat: "A1", name: "Arbre des Ancêtres", stat: "lex", desc: "Les membres de la famille.", gen: pairGen(FAMILY, "Traduis en anglais") },
  { id: "tobe", cat: "A1", name: "Fondations : Be & Have", stat: "syn", desc: "Am, is, are, has, have… et les pièges « j'ai faim ».", gen: choiceGen("tobe", "Complète la phrase") },
  { id: "plurals", cat: "A1", name: "Nid des Pluriels", stat: "mem", desc: "Child → children, foot → feet…", gen: genPlural },
  { id: "pron", cat: "A1", name: "Miroir des Pronoms", stat: "syn", desc: "He, his, him, their, there…", gen: choiceGen("pron", "Complète la phrase") },
  { id: "time", cat: "A1", name: "Tour de l'Horloge", stat: "per", desc: "Dire l'heure : half past, a quarter to…", gen: genTime },
  { id: "verbs1", cat: "A2", name: "Verbes Maudits I", stat: "mem", desc: "Les 40 verbes irréguliers les plus utiles.", gen: verbGen(v => VERBS_BASIC.has(v.b)) },
  { id: "prep", cat: "A2", name: "Piège In · On · At", stat: "syn", desc: "Les prépositions de temps et de lieu.", gen: choiceGen("prep", "Choisis la bonne préposition") },
  { id: "comp", cat: "A2", name: "Arène des Comparatifs", stat: "mem", desc: "Bigger, the best, more expensive…", gen: genComp },
  { id: "simple", cat: "A2", name: "Présent : Simple ou -ing ?", stat: "syn", desc: "Habitude ou action en cours ?", gen: choiceGen("simple", "Choisis le bon présent") },
  { id: "vocab", cat: "A2", name: "Crypte du Lexique", stat: "lex", desc: "Sport, informatique, travail, émotions.", gen: pairGen(VOCAB, "Traduis en anglais") },
  { id: "questions", cat: "A2", name: "Sanctuaire des Questions", stat: "syn", desc: "Do, does, did, are… pour poser une question.", gen: choiceGen("questions", "Complète la question") },
  { id: "quant", cat: "A2", name: "Mesure du Some & Any", stat: "syn", desc: "Some, any, much, many.", gen: choiceGen("quant", "Complète la phrase") },
  { id: "spell", cat: "A2", name: "Runes de l'Orthographe", stat: "per", desc: "Repère la bonne orthographe parmi les pièges.", gen: choiceGen("spell", "Quelle orthographe est correcte ?", false) },
  { id: "verbs2", cat: "B1", name: "Verbes Maudits II", stat: "mem", desc: "Les 77 verbes irréguliers, sans pitié.", gen: verbGen(() => true) },
  { id: "false", cat: "B1", name: "Labyrinthe des Faux Amis", stat: "per", desc: "Le mot ressemble au français… mais c'est un piège.", gen: genFalse },
  { id: "order", cat: "B1", name: "Tour des Phrases Brisées", stat: "syn", desc: "Remets les mots dans l'ordre.", gen: genOrder },
  { id: "perfect", cat: "B1", name: "Duel des Passés", stat: "syn", desc: "Present perfect ou prétérit ?", gen: choiceGen("perfect", "Choisis le bon temps") },
  { id: "phrasal", cat: "B1", name: "Gouffre des Phrasal Verbs", stat: "lex", desc: "Give up, look after, run out of…", gen: pairGen(PHRASAL, "Que veut dire ce phrasal verb ?") },
  { id: "modals", cat: "B1", name: "Salle des Modaux", stat: "syn", desc: "Must, should, might, can't, don't have to.", gen: choiceGen("modals", "Choisis le bon modal") },
  { id: "cond", cat: "B1", name: "Portail des Conditions", stat: "syn", desc: "If… : réel, hypothèse, regret.", gen: choiceGen("cond", "Complète la phrase") },
  { id: "trad", cat: "B1", name: "Traduction Éclair", stat: "per", desc: "Trouve la bonne traduction parmi les erreurs de francophones.", gen: choiceGen("trad", "Quelle est la bonne traduction ?", false) },
  { id: "idioms", cat: "B2", name: "Bibliothèque des Idiomes", stat: "per", desc: "It's a piece of cake, break a leg…", gen: choiceGen("idioms", "Que signifie cette expression ?") },
  { id: "passive", cat: "B2", name: "Ombre Passive", stat: "syn", desc: "Was built, is being built, will be sent.", gen: choiceGen("passive", "Mets à la voix passive") },
  { id: "reported", cat: "B2", name: "Échos du Discours Indirect", stat: "syn", desc: "Rapporter ce que quelqu'un a dit.", gen: choiceGen("reported", "Complète le discours indirect") },
  { id: "colloc", cat: "B2", name: "Forge Make & Do", stat: "lex", desc: "Make a mistake, do your homework…", gen: choiceGen("colloc", "Quel verbe va avec ?") },
  { id: "linking", cat: "B2", name: "Pont des Connecteurs", stat: "syn", desc: "Although, despite, however, unless…", gen: choiceGen("linking", "Choisis le bon connecteur") },
  { id: "boss", cat: "S", name: "Raid du Monarque", stat: "agi", desc: "75 secondes. Toutes les épreuves mélangées (sauf SS+). Pas de PV, que la vitesse.", boss: true, gen: null }
];

// ---------- Prononciation : comparer ce que le navigateur a entendu à la phrase attendue ----------
const CONTRACTIONS = [[/\bcan't\b/g, "can not"], [/\bwon't\b/g, "will not"], [/n't\b/g, " not"], [/'m\b/g, " am"], [/'re\b/g, " are"],
  [/'ve\b/g, " have"], [/'ll\b/g, " will"], [/'d\b/g, " would"], [/\blet's\b/g, "let us"], [/'s\b/g, " is"]];
// Orthographe britannique / américaine : on ramène tout à une seule forme
const fold = w => w.replace(/isation/, "ization").replace(/is(e|ed|es|er|ers|ing)$/, "iz$1").replace(/our$/, "or").replace(/tre$/, "ter");
export function speechWords(s) {
  let t = String(s).toLowerCase().replace(/[’`]/g, "'");
  CONTRACTIONS.forEach(([re, by]) => { t = t.replace(re, by); });
  t = t.replace(/\d+/g, n => +n < 1000 ? words(+n, false) : n);
  return t.replace(/[^a-z' ]+/g, " ").replace(/'/g, "").split(/\s+/).filter(Boolean).map(fold);
}
// Part des mots attendus retrouvés dans l'ordre (plus longue sous-suite commune)
export function speechScore(target, heard) {
  const a = speechWords(target), b = speechWords(heard);
  if (!a.length) return 0;
  const row = Array(b.length + 1).fill(0);
  for (const w of a) { let prev = 0; for (let j = 1; j <= b.length; j++) { const tmp = row[j]; row[j] = w === b[j - 1] ? prev + 1 : Math.max(row[j], row[j - 1]); prev = tmp; } }
  return row[b.length] / a.length;
}
function speakGen(text, need, sub) {
  const items = parse(text);
  return () => {
    const it = pick(items);
    return {
      type: "speak", prompt: it.q, sub, en: true, speakText: it.q, need, tip: it.x, tries: 0,
      score: heard => speechScore(it.q, heard),
      fix: `<b>${esc(it.q)}</b><br>${esc(it.x)}`, label: it.q, why: it.x
    };
  };
}

// Portes supplémentaires (js/gates/) : q = questions à choix, pairs = paires "français|anglais", say = phrases à prononcer
const TIERS = { C1: { hp: 2, xp: 2 }, S: { hp: 2, xp: 2.5 }, "SS+": { hp: 1, xp: 3 } };
const moreGate = cat => m => {
  if (m.say) return { id: m.id, cat, name: m.name, stat: m.stat, desc: m.desc, speak: true, ...TIERS[cat], hp: 3, gen: speakGen(m.say, m.need, m.sub) };
  if (m.q) D[m.id] = m.q;
  const gen = m.q ? choiceGen(m.id, m.sub, m.en ?? true) : pairGen(m.pairs.trim().split("\n").map(l => l.split("|")), m.sub);
  return { id: m.id, cat, name: m.name, stat: m.stat, desc: m.desc, gen, ...TIERS[cat] };
};
GAMES.splice(GAMES.findIndex(g => g.boss), 0,
  ...A1_MORE.map(moreGate("A1")), ...A2_MORE.map(moreGate("A2")), ...B1_MORE.map(moreGate("B1")),
  ...B2_MORE.map(moreGate("B2")), ...C1_MORE.map(moreGate("C1")), ...SSPLUS.map(moreGate("SS+")));
GAMES.push(...S_MORE.map(moreGate("S")), ...SPEAK.map(m => moreGate(m.cat)(m)));

export const G = Object.fromEntries(GAMES.map(g => [g.id, g]));
G.boss.gen = () => { const g = pick(GAMES.filter(x => !x.boss && !x.speak && x.cat !== "SS+")); const q = g.gen(); q.from = g.name; return q; };

export const STATNAMES = { mem: "Mémoire", lex: "Lexique", per: "Perception", syn: "Syntaxe", agi: "Agilité" };

export const QUESTS = [
  { id: "runs", t: "Terminer 2 donjons", goal: 2, xp: 80 },
  { id: "correct", t: "Obtenir 30 bonnes réponses", goal: 30, xp: 100 },
  { id: "boss", t: "Affronter le Raid du Monarque", goal: 1, xp: 120 },
  { id: "powers", t: "Utiliser 2 pouvoirs", goal: 2, xp: 60 }
];

export const POWERS = [
  { id: "eye", name: "Œil du Système", lv: 1, cost: 20, desc: "Élimine 2 mauvaises réponses, ou révèle le début de la réponse." },
  { id: "shield", name: "Bouclier d'Ombre", lv: 3, cost: 25, desc: "La prochaine erreur ne coûte ni PV ni combo." },
  { id: "heal", name: "Régénération", lv: 6, cost: 30, desc: "Rend 1 PV. Inutilisable pendant le Raid." },
  { id: "dom", name: "Domination", lv: 10, cost: 35, desc: "Les 3 prochaines bonnes réponses rapportent ×2 XP." },
  { id: "haste", name: "Accélération", lv: 15, cost: 30, desc: "Passe la question sans pénalité. Pendant le Raid : +15 secondes." },
  { id: "arise", name: "Extraction d'Ombre", lv: 20, cost: 0, passive: true, desc: "Passif. Une fois par donjon, tu te relèves avec 1 PV au lieu de tomber." }
];
