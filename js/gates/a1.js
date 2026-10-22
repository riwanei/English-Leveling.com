// Portes supplémentaires — niveau A1 (rang E)
// q : questions à choix "question|bonne|piège…#explication" · pairs : "français|anglais"
export default [
{ id: "animals", name: "Ménagerie des Bêtes", stat: "lex", desc: "Les animaux de la ferme, de la maison et de la jungle.", sub: "Traduis en anglais", pairs: `un chien|a dog
un chat|a cat
un cheval|a horse
une vache|a cow
un cochon|a pig
un mouton|a sheep
une poule|a hen
un lapin|a rabbit
un lion|a lion
un éléphant|an elephant
un singe|a monkey
un ours|a bear
un serpent|a snake
une araignée|a spider
un poisson|a fish
une grenouille|a frog` },
{ id: "body", name: "Anatomie du Chasseur", stat: "lex", desc: "Les parties du corps.", sub: "Traduis en anglais", pairs: `la tête|the head
les cheveux|the hair
les yeux|the eyes
le nez|the nose
la bouche|the mouth
les oreilles|the ears
le cou|the neck
l'épaule|the shoulder
le bras|the arm
la main|the hand
le doigt|the finger
le dos|the back
le ventre|the stomach
la jambe|the leg
le genou|the knee
le pied|the foot` },
{ id: "food", name: "Cuisine de la Guilde", stat: "lex", desc: "Aliments et repas du quotidien.", sub: "Traduis en anglais", pairs: `le pain|bread
le fromage|cheese
le beurre|butter
le poulet|chicken
le bœuf|beef
le poisson (à manger)|fish
le riz|rice
les pâtes|pasta
une pomme de terre|a potato
une pomme|an apple
une fraise|a strawberry
un œuf|an egg
le sucre|sugar
le sel|salt
le petit-déjeuner|breakfast
le déjeuner|lunch
le dîner|dinner` },
{ id: "clothes", name: "Armurerie des Vêtements", stat: "lex", desc: "Les vêtements et accessoires.", sub: "Traduis en anglais", pairs: `une chemise|a shirt
un tee-shirt|a T-shirt
un pantalon|trousers
un jean|jeans
une jupe|a skirt
une robe|a dress
une veste|a jacket
un manteau|a coat
un pull|a jumper
des chaussettes|socks
des bottes|boots
un chapeau|a hat
une écharpe|a scarf
des gants|gloves
une ceinture|a belt
des lunettes|glasses` },
{ id: "house", name: "Demeure des Pièces", stat: "lex", desc: "Les pièces et les meubles de la maison.", sub: "Traduis en anglais", pairs: `la cuisine|the kitchen
la chambre|the bedroom
la salle de bain|the bathroom
le salon|the living room
le jardin|the garden
l'escalier|the stairs
le toit|the roof
le mur|the wall
le sol|the floor
une table|a table
un canapé|a sofa
une armoire|a wardrobe
une étagère|a shelf
un miroir|a mirror
une lampe|a lamp
le réfrigérateur|the fridge` },
{ id: "school", name: "Académie des Fournitures", stat: "lex", desc: "L'école, la classe et les matières.", sub: "Traduis en anglais", pairs: `un cahier|a notebook
un crayon|a pencil
une gomme|a rubber
une règle|a ruler
un cartable|a schoolbag
le tableau|the board
un professeur|a teacher
un élève|a pupil
les devoirs|homework
un examen|an exam
la récréation|break time
l'histoire (matière)|history
la géographie|geography
les sciences|science
la musique|music
l'emploi du temps|the timetable` },
{ id: "weather", name: "Tempête du Climat", stat: "lex", desc: "La météo et le temps qu'il fait.", sub: "Traduis en anglais", pairs: `le soleil|the sun
la pluie|the rain
la neige|the snow
le vent|the wind
un nuage|a cloud
un orage|a storm
le brouillard|fog
ensoleillé|sunny
nuageux|cloudy
pluvieux|rainy
venteux|windy
chaud|hot
froid|cold
humide|wet
sec|dry
un arc-en-ciel|a rainbow` },
{ id: "jobs", name: "Hall des Métiers", stat: "lex", desc: "Les professions.", sub: "Traduis en anglais", pairs: `un médecin|a doctor
un infirmier|a nurse
un pompier|a firefighter
un policier|a police officer
un cuisinier|a cook
un serveur|a waiter
un avocat|a lawyer
un ingénieur|an engineer
un agriculteur|a farmer
un boulanger|a baker
un vendeur|a shop assistant
un chauffeur|a driver
un facteur|a postman
un dentiste|a dentist
un mécanicien|a mechanic
un écrivain|a writer` },
{ id: "transport", name: "Station des Transports", stat: "lex", desc: "Se déplacer : véhicules et trajets.", sub: "Traduis en anglais", pairs: `une voiture|a car
un vélo|a bike
une moto|a motorbike
un camion|a lorry
un avion|a plane
un bateau|a boat
le métro|the underground
une gare|a station
un aéroport|an airport
un arrêt de bus|a bus stop
un feu rouge|a traffic light
un rond-point|a roundabout
un passager|a passenger
un aller simple|a single ticket
un aller-retour|a return ticket
à pied|on foot` },
{ id: "city", name: "Rues de la Cité", stat: "lex", desc: "Les lieux de la ville.", sub: "Traduis en anglais", pairs: `une rue|a street
une place|a square
un pont|a bridge
une église|a church
un hôpital|a hospital
une banque|a bank
une pharmacie|a chemist's
une bibliothèque|a library
une librairie|a bookshop
un musée|a museum
un cinéma|a cinema
un parc|a park
un supermarché|a supermarket
la mairie|the town hall
un commissariat|a police station
un quartier|a neighbourhood` },
{ id: "greet", name: "Seuil des Salutations", stat: "per", desc: "Saluer, remercier, s'excuser.", sub: "Traduis en anglais", pairs: `Bonjour (le matin)|Good morning
Bonsoir|Good evening
Bonne nuit|Good night
Au revoir|Goodbye
À bientôt|See you soon
Merci beaucoup|Thank you very much
De rien|You're welcome
Pardon (pour passer)|Excuse me
Désolé|Sorry
Comment ça va ?|How are you?
Enchanté|Nice to meet you
S'il vous plaît|Please
Bienvenue|Welcome
Bon appétit|Enjoy your meal
Bonne chance|Good luck` },
{ id: "articles", name: "Rune A ou An", stat: "syn", desc: "A, an ou the ? Le son compte, pas la lettre.", sub: "Choisis le bon article", q: `I have ___ umbrella|an|a|the#Devant un son voyelle → an.
She is ___ teacher|a|an|the#Métier : a/an devant le nom (she is a teacher).
It's ___ hour later|an|a|the#Le h de hour est muet : son voyelle → an.
He has ___ university degree|a|an|the#university commence par le son « you » → a.
I saw ___ elephant at the zoo|an|a|the#elephant commence par un son voyelle → an.
Can you close ___ door, please?|the|a|an#On parle d'une porte précise, connue → the.
She eats ___ apple every day|an|a|the#apple commence par un son voyelle → an.
He is ___ honest man|an|a|the#Le h de honest est muet → an.
I need ___ new phone|a|an|the#new commence par un son consonne → a.
___ sun is very hot today|The|A|An#Chose unique → the.
It's ___ European city|a|an|the#European commence par le son « you » → a.` },
{ id: "thisthat", name: "Écho de This & That", stat: "syn", desc: "This, that, these, those : près ou loin, un ou plusieurs.", sub: "Complète la phrase", q: `___ book here is mine|This|These|Those#Un seul objet, près de moi → this.
Look at ___ birds over there!|those|these|this#Plusieurs choses, loin → those.
___ shoes I'm wearing are new|These|This|That#Plusieurs choses, près de moi → these.
Who is ___ man over there?|that|this|these#Une seule personne, loin → that.
___ are my friends, Tom and Ana|These|This|That#Je présente plusieurs personnes à côté de moi → these.
Is ___ your bag on that chair?|that|these|those#Un seul objet, loin de moi → that.
I love ___ cakes on this plate|these|those|this#Plusieurs choses, près de moi → these.
___ was a great film!|That|These|Those#On parle d'un fait terminé → that.
Can I try ___ jacket? (je la tiens)|this|those|these#Un seul objet, dans ma main → this.
Do you remember ___ days at school?|those|these|this#Plusieurs moments lointains (dans le passé) → those.` },
{ id: "thereis", name: "Source du There is", stat: "syn", desc: "There is, there are : il y a.", sub: "Complète la phrase", q: `___ a cat in the garden|There is|There are|It is#Un seul élément → there is.
___ two books on the desk|There are|There is|They are#Pluriel → there are.
___ any milk in the fridge?|Is there|Are there|There is#Question avec un indénombrable → Is there.
___ many people at the party?|Were there|Was there|There were#Question au passé avec un pluriel → Were there.
There ___ a problem with my car|is|are|have#Un seul problème → there is.
There ___ no chairs in this room|are|is|has#chairs est un pluriel → there are.
___ a good restaurant near here?|Is there|Are there|Has it#Question au singulier → Is there… ?
There ___ a storm last night|was|were|is#Passé + singulier → there was.
There ___ some apples on the table|are|is|be#apples est un pluriel → there are.
There ___ a lot of noise outside|is|are|have#noise est indénombrable → there is.` },
{ id: "can", name: "Talents : Can & Can't", stat: "syn", desc: "Dire ce qu'on sait faire, ou pas.", sub: "Complète la phrase", q: `I ___ swim very well|can|cans|can to#can ne prend jamais de -s ni de to.
She ___ speak Chinese|can|cans|can to#can est identique à toutes les personnes : she can.
___ you help me, please?|Can|Do|Are#Question : Can + sujet + verbe.
He can ___ the guitar|play|plays|to play#Après can : verbe à la base, sans to ni -s.
Penguins ___ fly|can't|don't can|not can#Négation : can't (cannot).
___ she drive?|Can|Does|Is#Question : Can she… ? sans do.
I can't ___ you, the music is too loud|hear|to hear|hearing#Après can't : verbe à la base.
Can you ___ this word?|spell|spelling|to spell#Après can : verbe à la base.
My little brother ___ read yet|can't|doesn't can|isn't can#Négation de can : can't, jamais avec do.
We ___ go out tonight, we have an exam tomorrow|can't|don't|aren't#Impossibilité → can't + verbe.` },
{ id: "saxon", name: "Sceau du Génitif", stat: "syn", desc: "Le 's de possession : Tom's car.", sub: "Choisis la bonne forme", en: false, q: `C'est le vélo de Tom|It's Tom's bike|It's the bike of Tom|It's Tom bike#Possession d'une personne : nom + 's.
La chambre de mes parents|My parents' room|My parent's room|My parents's room#Pluriel en -s : on ajoute seulement l'apostrophe.
Le jouet des enfants|The children's toy|The childrens' toy|The children toy#children ne finit pas par -s : on ajoute 's.
La voiture de ma sœur|My sister's car|My sisters car|The car my sister#Une sœur : sister + 's.
Le nom de mon chien|My dog's name|My dogs name|My dog name#Un chien : dog + 's.
Les livres de James|James's books|James books|The James books#Prénom en -s : on peut ajouter 's (James's).
La maison de Paul et Lisa|Paul and Lisa's house|Paul's and Lisa's house|Paul and Lisa house#Possession commune : 's seulement après le dernier nom.
Le bureau du professeur|The teacher's desk|The teachers desk|The desk teacher#Un professeur : teacher + 's.
L'anniversaire de ma mère|My mother's birthday|My mothers birthday|My mother birthday#Une mère : mother + 's.
Les vestiaires des femmes|The women's changing room|The womens' changing room|The woman changing room#women ne finit pas par -s : on ajoute 's.` },
{ id: "third", name: "Marque du -s", stat: "syn", desc: "He, she, it : n'oublie pas le -s au présent.", sub: "Complète la phrase", q: `She ___ in Paris|lives|live|living#he/she/it au présent simple → verbe + s.
He ___ his homework after dinner|does|do|dos#do → does avec he/she/it.
My father ___ to work by car|goes|go|gos#go → goes avec he/she/it.
The shop ___ at 9 o'clock|opens|open|opening#the shop = it → verbe + s.
She ___ TV every evening|watches|watchs|watch#Verbe en -ch → on ajoute -es.
He ___ a lot|studies|studys|study#Consonne + y → ies.
My cat ___ milk|loves|love|lovs#my cat = it → verbe + s.
It ___ a lot in Brittany|rains|rain|rainies#it → verbe + s.
Ana ___ three languages|speaks|speak|speakes#Ana = she → verbe + s.
He ___ a red car|has|haves|have#have → has avec he/she/it.
The children ___ football|play|plays|playes#children = they → pas de -s.` },
{ id: "place", name: "Carte des Positions", stat: "syn", desc: "Sous, derrière, entre, à côté de…", sub: "Choisis la bonne préposition", en: false, q: `Le chat est sous la table : The cat is ___ the table|under|on|behind#sous = under.
La lampe est à côté du lit : The lamp is ___ the bed|next to|between|under#à côté de = next to.
Le parc est derrière l'école : The park is ___ the school|behind|in front of|above#derrière = behind.
La banque est entre la poste et le café : The bank is ___ the post office and the café|between|next|among#entre deux choses = between.
Je t'attends devant le cinéma : I'll wait ___ the cinema|in front of|behind|between#devant = in front of.
L'avion vole au-dessus des nuages : The plane flies ___ the clouds|above|under|on#au-dessus de = above.
La pharmacie est en face de la gare : The chemist's is ___ the station|opposite|in front|next#en face de = opposite.
Le lait est dans le frigo : The milk is ___ the fridge|in|on|at#à l'intérieur de = in.
Le tableau est sur le mur : The picture is ___ the wall|on|in|at#sur une surface (même verticale) = on.
La boulangerie est près de chez moi : The bakery is ___ my house|near|next|between#près de = near.` },
{ id: "qwords", name: "Oracle des Mots Interrogatifs", stat: "syn", desc: "What, where, who, when, why, how…", sub: "Complète la question", q: `___ do you live? — In Lyon.|Where|What|When#Lieu → where.
___ is your name? — Lucas.|What|Who|How#Demander une information (le nom) → what.
___ is that man? — My uncle.|Who|What|Which#Une personne → who.
___ is your birthday? — In June.|When|Where|Who#Moment → when.
___ are you sad? — Because I lost.|Why|How|What#Raison → why.
___ are you? — I'm fine, thanks.|How|What|Who#État, manière → how.
___ old are you?|How|What|Which#L'âge : How old… ?
___ much is this T-shirt?|How|What|Which#Le prix : How much… ?
___ bag is this? — It's mine.|Whose|Who|Who's#À qui ? → whose.
___ colour do you prefer, red or blue?|Which|Who|Where#Choix entre options connues → which.
___ times a week do you train?|How many|How much|What#Nombre de fois (dénombrable) → how many.` },
{ id: "opposite", name: "Miroir des Contraires", stat: "lex", desc: "Les adjectifs et leurs contraires.", sub: "Trouve le contraire", q: `big ↔ ___|small|tall|long#big (grand) ↔ small (petit).
hot ↔ ___|cold|warm|wet#hot (chaud) ↔ cold (froid).
old (pour un objet) ↔ ___|new|young|short#Pour un objet : old ↔ new. Pour une personne : old ↔ young.
old (pour une personne) ↔ ___|young|new|little#Pour une personne : old ↔ young.
fast ↔ ___|slow|late|easy#fast (rapide) ↔ slow (lent).
cheap ↔ ___|expensive|rich|poor#cheap (pas cher) ↔ expensive (cher).
easy ↔ ___|difficult|heavy|hard-working#easy (facile) ↔ difficult (difficile).
heavy ↔ ___|light|thin|soft#heavy (lourd) ↔ light (léger).
early ↔ ___|late|soon|slow#early (tôt) ↔ late (tard).
full ↔ ___|empty|free|open#full (plein) ↔ empty (vide).
clean ↔ ___|dirty|dark|dry#clean (propre) ↔ dirty (sale).
strong ↔ ___|weak|soft|thin#strong (fort) ↔ weak (faible).` },
{ id: "ordinals", name: "Escalier des Ordinaux", stat: "mem", desc: "First, second, third… pour les dates et les classements.", sub: "Traduis en anglais", pairs: `premier|first
deuxième|second
troisième|third
quatrième|fourth
cinquième|fifth
sixième|sixth
huitième|eighth
neuvième|ninth
douzième|twelfth
vingtième|twentieth
vingt et unième|twenty-first
trentième|thirtieth
centième|hundredth
dernier|last` },
{ id: "negation", name: "Sceau du Non", stat: "syn", desc: "Don't, doesn't, isn't, aren't : dire non.", sub: "Complète la phrase", q: `I ___ like broccoli|don't|doesn't|am not#Négation au présent avec I → don't + verbe.
She ___ eat meat|doesn't|don't|isn't#he/she/it → doesn't + verbe à la base.
They ___ at home|aren't|don't|isn't#Avec be : they aren't.
He ___ tired|isn't|doesn't|don't#Avec be : he isn't.
We ___ have a car|don't|doesn't|aren't#have (posséder) au présent : we don't have.
My phone ___ work|doesn't|don't|isn't#my phone = it → doesn't + verbe.
I ___ hungry|'m not|don't|doesn't#Avec be : I'm not.
She doesn't ___ French|speak|speaks|speaking#Après doesn't, le verbe perd son -s.
You ___ listening to me!|aren't|don't|doesn't#Avec -ing on utilise be : you aren't listening.
It ___ rain much here|doesn't|isn't|don't#it + verbe d'action → doesn't.` }
];
