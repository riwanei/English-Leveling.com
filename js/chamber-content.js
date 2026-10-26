// =====================================================================
// Contenu de la Chambre Hors du Temps : entraînements complets par niveau.
// listen : texte lu à voix haute, puis questions  [question, bonne réponse, piège, piège]
// read   : texte à lire, puis questions (même format)
// dict   : phrases à écrire sous la dictée
// write  : "phrase française|traduction acceptée|autre traduction acceptée…"
// =====================================================================

export const LEVELS = [
  { id: "A1", name: "Éveil", desc: "Phrases simples du quotidien." },
  { id: "A2", name: "Endurance", desc: "Récits courts, passé et projets." },
  { id: "B1", name: "Maîtrise", desc: "Opinions, explications, imprévus." },
  { id: "B2", name: "Dépassement", desc: "Arguments, nuances, textes longs." }
];

export const TRAIN = {
  A1: {
    listen: [
      { title: "Au café", text: "Hi, I'm Tom. I'm twenty years old and I live in London. Every morning I go to a small café near my house. I drink a coffee with milk and I eat a croissant. Then I take the bus to work.",
        qs: [["Où habite Tom ?", "À Londres", "À Paris", "À Dublin"], ["Que boit-il le matin ?", "Un café au lait", "Un thé", "Un jus d'orange"], ["Comment va-t-il au travail ?", "En bus", "À pied", "En train"]] },
      { title: "La famille de Sara", text: "My name is Sara. I have a brother and a sister. My brother is called Ben and he is ten. My sister, Lucy, is a teacher. We have a big black dog. His name is Max and he loves the park.",
        qs: [["Combien de frères et sœurs a Sara ?", "Deux", "Un", "Trois"], ["Quel est le métier de Lucy ?", "Professeure", "Médecin", "Étudiante"], ["Qu'aime faire le chien ?", "Aller au parc", "Dormir", "Manger"]] }
    ],
    read: [
      { title: "Un message", text: "Hello Anna! I'm at the supermarket now. Do we need eggs? I have bread, cheese and apples. Dinner is at seven tonight. My friend Paul is coming too. See you soon! – Kate",
        qs: [["Où est Kate ?", "Au supermarché", "À la maison", "Au restaurant"], ["À quelle heure est le dîner ?", "À sept heures", "À six heures", "À huit heures"], ["Qui vient au dîner ?", "Paul", "Anna", "Ben"]] },
      { title: "Ma chambre", text: "My bedroom is small but I like it. There is a bed, a desk and a blue chair. On the desk there is a computer and a lamp. The window is next to the bed. I can see the trees from my window.",
        qs: [["Comment est la chambre ?", "Petite", "Grande", "Sombre"], ["De quelle couleur est la chaise ?", "Bleue", "Rouge", "Verte"], ["Que voit-on par la fenêtre ?", "Des arbres", "La mer", "Une rue"]] }
    ],
    dict: ["I am happy today.", "She has a red bag.", "We live in a big house.", "My father is a doctor.", "They play football on Sunday.", "Where is the station?"],
    write: [
      "J'ai un chat.|I have a cat|I've got a cat",
      "Il est grand.|He is tall|He's tall|He is big|He's big",
      "Nous aimons la musique.|We like music|We love music",
      "Elle ne parle pas anglais.|She doesn't speak English|She does not speak English",
      "Quel âge as-tu ?|How old are you",
      "Le livre est sur la table.|The book is on the table"
    ]
  },
  A2: {
    listen: [
      { title: "Le week-end dernier", text: "Last weekend I visited my grandparents in the countryside. On Saturday we walked to the lake and had a picnic. It was sunny but a bit cold. On Sunday it rained, so we stayed inside and played cards all afternoon.",
        qs: [["Qui a-t-il rendu visite ?", "À ses grands-parents", "À ses cousins", "À un ami"], ["Qu'ont-ils fait samedi ?", "Un pique-nique au lac", "Du vélo", "Du shopping"], ["Pourquoi sont-ils restés à l'intérieur dimanche ?", "Il pleuvait", "Il faisait trop chaud", "Ils étaient fatigués"]] },
      { title: "Un nouveau travail", text: "I started a new job two weeks ago. I work in a hotel near the beach. I usually start at eight and finish at four. My colleagues are friendly, but the manager is quite strict. Next month I'm going to take English lessons to talk with the tourists.",
        qs: [["Depuis quand a-t-elle ce travail ?", "Deux semaines", "Deux mois", "Deux ans"], ["Comment est le directeur ?", "Assez strict", "Très drôle", "Jamais là"], ["Que va-t-elle faire le mois prochain ?", "Prendre des cours d'anglais", "Changer de travail", "Partir en vacances"]] }
    ],
    read: [
      { title: "Annonce", text: "LOST: small brown cat, three years old, with a white spot on her nose. She answers to the name 'Pepper'. Last seen on Green Street on Tuesday evening. If you find her, please call Mark on 0745 221 890. Reward offered!",
        qs: [["Quelle est la particularité du chat ?", "Une tache blanche sur le nez", "Une queue noire", "Un collier rouge"], ["Quand l'a-t-on vu pour la dernière fois ?", "Mardi soir", "Lundi matin", "Mercredi midi"], ["Que propose Mark ?", "Une récompense", "Un chaton", "Un rendez-vous"]] },
      { title: "Courriel de vacances", text: "Hi Jess, Greetings from Spain! The hotel is lovely and the food is amazing. Yesterday we went to the old town and bought some souvenirs. Tomorrow we're going to try surfing, which is a bit scary! We fly home on Friday. Love, Emma",
        qs: [["Comment est la nourriture ?", "Délicieuse", "Trop épicée", "Chère"], ["Qu'ont-ils fait hier ?", "Visité la vieille ville", "Nagé", "Fait du surf"], ["Quand rentrent-ils ?", "Vendredi", "Demain", "Dimanche"]] }
    ],
    dict: ["I didn't go to school yesterday.", "We are going to buy a new car.", "She was tired after the party.", "How much does this jacket cost?", "He has never been to America.", "It was colder than last week."],
    write: [
      "Je suis allé au cinéma hier.|I went to the cinema yesterday|I went to the movies yesterday|Yesterday I went to the cinema",
      "Elle va voyager l'été prochain.|She is going to travel next summer|She's going to travel next summer|She will travel next summer",
      "Il fait plus chaud qu'hier.|It is hotter than yesterday|It's hotter than yesterday|It is warmer than yesterday|It's warmer than yesterday",
      "Nous n'avons pas vu le film.|We didn't see the film|We did not see the film|We didn't see the movie|We haven't seen the film|We haven't seen the movie",
      "Peux-tu m'aider, s'il te plaît ?|Can you help me please|Could you help me please|Can you help me, please",
      "J'habite ici depuis trois ans.|I have lived here for three years|I've lived here for three years|I have been living here for three years|I've been living here for three years"
    ]
  },
  B1: {
    listen: [
      { title: "Un retard", text: "Sorry I'm late. I left home on time, but there was an accident on the motorway and the traffic didn't move for nearly an hour. I tried to call you, but my phone battery had died. Next time I'll take the train, even if it's more expensive.",
        qs: [["Why was the speaker late?", "Because of an accident on the motorway", "Because he woke up late", "Because the train was cancelled"], ["Why didn't he call?", "His phone battery was dead", "He forgot the number", "He had no signal"], ["What will he do next time?", "Take the train", "Leave earlier", "Stay at home"]] },
      { title: "Travailler de chez soi", text: "Since I started working from home, I save almost two hours a day because I don't have to commute. However, I sometimes feel lonely, and it's hard to stop working in the evening. To deal with that, I go to a co-working space twice a week and I switch off my laptop at six.",
        qs: [["What is the main advantage for the speaker?", "Saving time on commuting", "Earning more money", "Sleeping longer"], ["What problem does she mention?", "Feeling lonely", "A slow internet connection", "Noisy neighbours"], ["How does she solve it?", "She goes to a co-working space twice a week", "She changed jobs", "She works at night"]] }
    ],
    read: [
      { title: "Les réseaux sociaux", text: "Many teenagers spend more than three hours a day on social media. Some experts believe this affects their sleep and concentration, while others point out that these platforms help young people stay in touch with friends and discover new interests. Most agree, however, that the key is balance: setting limits rather than banning phones completely.",
        qs: [["What do some experts worry about?", "Sleep and concentration", "Eyesight", "School fees"], ["What positive point is mentioned?", "Staying in touch with friends", "Doing more sport", "Reading more books"], ["What do most experts recommend?", "Setting limits", "Banning phones", "Using only one app"]] },
      { title: "Un festival", text: "The city's summer festival, which has taken place every July since 1985, attracts over fifty thousand visitors. This year, organisers have decided to ban single-use plastic cups. Visitors will receive a reusable cup for a small deposit, which they can get back at the end of the day.",
        qs: [["How long has the festival existed?", "Since 1985", "Since 1995", "For five years"], ["What has been banned this year?", "Single-use plastic cups", "Cars in the city centre", "Food stalls"], ["What happens to the deposit?", "Visitors get it back", "It goes to charity", "It pays for tickets"]] }
    ],
    dict: ["If I had more time, I would learn to play the guitar.", "The museum was closed when we arrived.", "She has been waiting for the bus since ten o'clock.", "I'm not sure whether he will come tonight.", "We should have booked a table in advance.", "Although it was raining, they went for a walk."],
    write: [
      "Si j'étais toi, j'accepterais ce travail.|If I were you, I would accept this job|If I were you I would accept this job|If I were you, I'd accept this job|If I were you I'd accept this job|If I were you, I would take this job|If I were you I would take this job|If I were you, I'd take this job|If I were you I'd take this job",
      "Elle m'a dit qu'elle était fatiguée.|She told me she was tired|She told me that she was tired|She said she was tired|She said that she was tired",
      "Ça fait deux heures que j'attends.|I have been waiting for two hours|I've been waiting for two hours",
      "Le pont a été construit en 1900.|The bridge was built in 1900",
      "Tu aurais dû me prévenir.|You should have warned me|You should have told me",
      "Je ne sais pas s'il viendra.|I don't know if he will come|I don't know whether he will come|I do not know if he will come|I don't know if he'll come|I don't know whether he'll come"
    ]
  },
  B2: {
    listen: [
      { title: "Une conférence", text: "Good evening, everyone. Tonight I'd like to challenge a common belief: that multitasking makes us more productive. Research consistently shows that when we switch between tasks, we lose time refocusing, and we make more mistakes. In other words, doing two things at once usually means doing both of them badly.",
        qs: [["What belief does the speaker challenge?", "That multitasking makes us more productive", "That sleep improves memory", "That research is always reliable"], ["According to research, what happens when we switch tasks?", "We lose time and make more mistakes", "We become more creative", "We remember more"], ["What is the speaker's conclusion?", "Doing two things at once means doing both badly", "Multitasking is fine with practice", "We should work longer hours"]] },
      { title: "Un entretien", text: "I wouldn't say I've always wanted to be an architect. Actually, I studied economics first. It was only after travelling through Asia and seeing how cities had been designed around people rather than cars that I realised what I wanted to do. Had I not taken that trip, I'd probably be working in a bank now.",
        qs: [["What did the speaker study first?", "Economics", "Architecture", "Asian languages"], ["What inspired the change?", "Cities designed around people rather than cars", "A conversation with a banker", "A book about design"], ["What would have happened without the trip?", "He would probably work in a bank", "He would be an architect anyway", "He would live in Asia"]] }
    ],
    read: [
      { title: "La semaine de quatre jours", text: "A growing number of companies are experimenting with a four-day working week at the same salary. Early trials suggest that employees are not only happier but often just as productive, largely because shorter weeks force teams to cut unnecessary meetings. Critics, however, argue that the model is hard to apply in sectors such as healthcare, where services must run every day.",
        qs: [["What do the companies keep the same?", "The salary", "The number of hours", "The number of meetings"], ["Why are teams often just as productive?", "They cut unnecessary meetings", "They work at weekends", "They hire more staff"], ["What is the critics' main objection?", "It is hard to apply in sectors like healthcare", "Employees become lazy", "It costs too much"]] },
      { title: "La mémoire", text: "Contrary to popular belief, memories are not stored like files on a computer. Each time we recall an event, the brain rebuilds it, and in doing so may slightly alter it. This explains why two witnesses can sincerely describe the same scene in different ways, and why confidence in a memory is no guarantee that it is accurate.",
        qs: [["How does the text describe memory?", "The brain rebuilds memories each time", "Memories are stored like computer files", "Memories never change"], ["Why can two witnesses disagree?", "Each recalls a slightly altered version", "One of them is lying", "They saw different scenes"], ["What does confidence in a memory prove?", "Nothing about its accuracy", "That it is accurate", "That it is recent"]] }
    ],
    dict: ["Had I known about the delay, I would have taken another flight.", "The report, which was published last week, has caused a lot of controversy.", "It is high time we dealt with this problem seriously.", "Not only did she win the race, but she also broke the record.", "Despite being exhausted, he kept on working until midnight.", "I'd rather you didn't mention it to anyone."],
    write: [
      "Si j'avais su, je serais venu plus tôt.|If I had known, I would have come earlier|If I'd known, I would have come earlier|If I had known, I'd have come earlier|If I'd known, I'd have come earlier|Had I known, I would have come earlier|If I had known I would have come earlier",
      "Il est temps que nous partions.|It's time we left|It is time we left|It's high time we left|It is high time we left|It's time for us to leave|It is time for us to leave",
      "Malgré la pluie, le match a eu lieu.|Despite the rain, the match took place|Despite the rain the match took place|In spite of the rain, the match took place|In spite of the rain the match took place|Despite the rain, the game took place",
      "Je préférerais que tu ne le dises à personne.|I'd rather you didn't tell anyone|I would rather you didn't tell anyone|I would rather you did not tell anyone|I'd rather you told no one|I'd prefer you not to tell anyone|I would prefer you not to tell anyone",
      "Elle a fait réparer sa voiture.|She had her car repaired|She got her car repaired|She had her car fixed|She got her car fixed",
      "Non seulement il est en retard, mais il a aussi oublié les clés.|Not only is he late, but he has also forgotten the keys|Not only is he late but he has also forgotten the keys|Not only is he late, but he also forgot the keys|Not only is he late, he has also forgotten the keys|Not only is he late, but he's also forgotten the keys"
    ]
  }
};
