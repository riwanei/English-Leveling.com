// Portes de prononciation : le joueur lit la phrase à voix haute (reconnaissance vocale du navigateur).
// say : "phrase à prononcer#conseil de prononciation"
// need : part des mots qui doivent être reconnus pour réussir (de plus en plus exigeant)
export default [
{ id: "say1", cat: "A1", need: .6, name: "Écho du Chasseur", stat: "per", desc: "Parle ! Les premiers sons : th, h soufflé, voyelles longues.", sub: "Lis la phrase à voix haute", say: `Hello, how are you today?#Le h se prononce : un souffle léger, comme pour embuer une vitre.
Thank you very much#th : bout de la langue entre les dents, on souffle sans faire vibrer la voix.
This is my brother#th de this : langue entre les dents, cette fois avec la voix qui vibre.
I have three cats#three : langue entre les dents, puis r. Le h de have se souffle.
My house is near the park#house : h soufflé, puis « aou ».
What time is it?#Le t final de what est léger, mais ne l'oublie pas.
I like green apples#green : i long, comme « iii ».
She is happy#happy : h soufflé, a court, y final = « i ».
Where is the bathroom?#where : w comme dans « ouate », le h ne s'entend pas.
I am hungry#hungry : h soufflé, u proche du « a » de « gars ».
Nice to meet you#meet : i long. Le t se lie à you : « mee-tchou ».
See you tomorrow#tomorrow : l'accent est sur la 2e syllabe, to-MOR-row.` },
{ id: "say2", cat: "A2", need: .7, name: "Paires Minimales", stat: "per", desc: "Parle ! Voyelles courtes ou longues, et la terminaison -ed.", sub: "Lis la phrase à voix haute", say: `I live here, but I leave tomorrow#live : i court et sec. leave : i long.
The ship is full of sheep#ship : i court. sheep : i long. La différence change le sens !
I walked to work yesterday#walked : -ed se prononce « t » (« wokt »), jamais « walk-ed ». Le l est muet.
She wanted to stay#wanted : après t ou d, -ed se prononce « id ».
He played football all day#played : -ed se prononce « d » (« pleyd »).
Can you pull the door?#pull : ou court. Le l final est sombre, langue en arrière.
I eat pizza every week#eat et week : i long.
The cat sat on the hat#a de cat, sat, hat : entre « a » et « è », bouche bien ouverte.
It was a bad bed#bad : a très ouvert. bed : è.
I watched a film and laughed#watched « wotcht », laughed « laaft » : ici -ed = « t ».
Look at the full moon#look et full : ou court. moon : ou long.
I think this thing is thin#think, thing, thin : th sans voix, langue entre les dents.` },
{ id: "say3", cat: "B1", need: .75, name: "Accent Tonique", stat: "per", desc: "Parle ! Place l'accent sur la bonne syllabe.", sub: "Lis la phrase à voix haute", say: `I took a photograph of the photographer#PHOtograph mais phoTOGrapher : l'accent se déplace.
We need to develop a new technology#deVElop, techNOlogy : l'accent est au milieu du mot.
Can I record a record?#Verbe reCORD, nom REcord : l'accent change le sens.
The comfortable hotel is in the centre#COMfortable en 3 syllabes (« COMF-tuh-bl »). hoTEL : accent à la fin.
This vegetable soup is delicious#VEGetable en 3 syllabes (« VEJ-tuh-bl »). deLIcious.
I'm interested in economics#INterested en 3 syllabes. ecoNOMics.
She will present the present tomorrow#Verbe preSENT, nom PREsent.
The analysis was accurate#aNAlysis, ACcurate : la syllabe forte est plus longue et plus forte.
My colleague is a hotel receptionist#COLleague, recepTIONist.
It was an important event#imPORtant, eVENT.
We should increase our profit#Verbe inCREASE (le nom est INcrease). PROfit.
The answer is in the chapter#ANswer : le w est muet. CHAPter.` },
{ id: "say4", cat: "B2", need: .8, name: "Flux Naturel", stat: "per", desc: "Parle ! Enchaîner les mots comme un natif : liaisons et formes faibles.", sub: "Lis la phrase à voix haute", say: `What do you want to do this weekend?#À l'oral : « whaddya wanna do ». do you et want to se fondent.
I should have told you earlier#should have devient « shoulda » : have est faible.
Can I have a cup of tea, please?#a cup of → « a cuppa » : of se réduit à « uh ».
I'm going to get some fish and chips#going to → « gonna ». and → « n » : fish 'n' chips.
Did you eat yet?#Did you → « didja » : d + you donne « dj ».
Let me know if you need anything#Let me → « lemme ». need anything : le d se lie à la voyelle.
Not at all, it was a pleasure#Not at all : les t s'adoucissent et se lient, « no-ta-tall ».
Turn it off and on again#Tout s'enchaîne : « tur-ni-to-ffa-ndo-na-gain ».
Where are you from originally?#are et you sont faibles : « wear-uh-yuh from ».
Could you give me a hand with this?#Could you → « couldja ». give me → « gimme ».
I used to live in a small town#used to → « yoosta », avec un s et non un z.
He must have left already#must have → « musta ».` },
{ id: "say5", cat: "C1", need: .85, name: "Langue Liée", stat: "per", desc: "Parle ! Virelangues et mots que même les natifs redoutent.", sub: "Lis la phrase à voix haute", say: `She sells seashells by the seashore#Alterne s et sh sans les mélanger : s = sourire, sh = lèvres en avant.
Red lorry, yellow lorry#Le r anglais ne roule pas : langue recourbée en arrière, sans toucher le palais.
Peter Piper picked a peck of pickled peppers#Le p anglais explose avec un petit souffle d'air.
I thought a thought, but the thought I thought wasn't the thought I thought#thought : th sans voix + « ô » long. Garde la langue entre les dents.
How much wood would a woodchuck chuck#wood et would se prononcent pareil : « woud ». w = lèvres arrondies.
Comfortable, Wednesday, February#Mots piégés : « COMF-tuh-bl », « WENZ-day », « FEB-roo-ary ».
The queue at the library was particularly long#queue = « kiou ». library : deux r. particularly : 5 syllabes.
Specifically, the statistics are rural#specifically, statistics, rural : articule chaque syllabe, sans te presser.
Whether the weather is warm or whether it is cold#whether et weather se prononcent pareil : « WÈ-thuh », th voisé.
Eleven benevolent elephants#eLEVen, beNEVolent, ELephants : trois accents différents.
A proper copper coffee pot#p et k explosifs, o court et ouvert.
Three free throws through the hoop#three, throws, through : th sans voix. free : un f, pas de th !` },
{ id: "say6", cat: "S", need: .9, name: "Discours du Monarque", stat: "per", desc: "Parle ! Les phrases d'une vraie présentation en public, prononcées sans faute.", sub: "Lis la phrase à voix haute, comme devant un public", say: `Good morning, everyone, and thank you for coming#Ralentis et appuie sur les mots forts : MORning, EVeryone, THANK, COMing.
Let me walk you through the main points#walk : le l est muet (« wok »). walk you → « wo-kyou ».
As you can see on this slide, our results have improved#can se réduit à « kn ». imPROVED : -ed = « d ».
That's a really good question#Monte sur REALly, redescends à la fin de la phrase.
Could you repeat the question, please?#Could you → « couldja ». La voix monte à la fin d'une demande polie.
I'm afraid we've run out of time#I'm afraid adoucit la nouvelle. run out of → « ru-nou-tuv ».
To sum up, there are three key takeaways#three : th sans voix. KEY et TAKEaways : deux accents forts.
I'd like to thank the organisers for inviting me#I'd like → « aïd-laïk ». ORganisers, inVIting.
Bear with me for a moment while I fix this#Bear with me = « bèr-wiθ-mi ». Garde un ton calme et posé.
If there are no further questions, let's wrap up#further : th voisé. wrap : le w est muet (« rap »).
This is the most important figure in my presentation#imPORtant, FIGure, presenTAtion : trois accents forts.
Thank you all for your attention#Ralentis sur la dernière phrase : c'est celle que le public retient.` }
];
