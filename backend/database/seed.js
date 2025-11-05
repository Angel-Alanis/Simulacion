const { getConnection, sql } = require('../src/config/database');

// 3 niveles: Basico, Intermedio, Avanzado
const levels = [
  { name: 'Basico', order: 1, minPercentage: 0, maxPercentage: 69.99, description: 'Nivel básico' },
  { name: 'Intermedio', order: 2, minPercentage: 70, maxPercentage: 84.99, description: 'Nivel intermedio' },
  { name: 'Avanzado', order: 3, minPercentage: 85, maxPercentage: 100, description: 'Nivel avanzado' }
];

// Tipos de examen: Practica (20 preguntas, 5pts c/u) y Final (40 preguntas, 2.5pts c/u)
const examTypes = [
  {
    name: 'Practice',
    totalQuestions: 20,
    maxAttempts: 5,
    pointsPerQuestion: 5.0,
    passingScore: 70.0,
    timeLimitSeconds: 60,
    description: 'Simulador de práctica - 5 intentos'
  },
  {
    name: 'Final',
    totalQuestions: 40,
    maxAttempts: 2,
    pointsPerQuestion: 2.5,
    passingScore: 70.0,
    timeLimitSeconds: 60,
    description: 'Simulador final - 2 intentos'
  }
];

// 80 Preguntas: Basico (1-30), Intermedio (31-60), Avanzado (61-80)
const questions = [
  // BASICO (1-30) - Preguntas básicas
  {
    level: 'Basico',
    number: 1,
    text: 'Hello, Jack. How are you?\n_____ Sophie! I\'m great, thanks.',
    options: { a: 'Hi', b: 'Bye', c: 'Goodbye', d: 'Of course' },
    correct: 'a'
  },
  {
    level: 'Basico',
    number: 2,
    text: 'Hey, do you know that girl?\nSure! ____ is the new student, Martha.',
    options: { a: 'He', b: 'They', c: 'She', d: 'We' },
    correct: 'c'
  },
  {
    level: 'Basico',
    number: 3,
    text: 'Can you see those two men over there?\nYes, why?\nThey ____ my brothers, Carl and Craig.',
    options: { a: 'is', b: 'am', c: 'be', d: 'are' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 4,
    text: 'How old is she?\nShe____ 28 years old.',
    options: { a: 'has', b: 'is', c: 'are', d: 'have' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 5,
    text: 'Sophie really likes this movie, I think it\'s _____ favorite movie because she told me she loves it!',
    options: { a: 'my', b: 'her', c: 'his', d: 'their' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 6,
    text: 'Hey, where ___ Charlie ___?\nHe is from France.',
    options: { a: 'are / to', b: 'am / from', c: 'is / for', d: 'is / from' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 7,
    text: 'I need to buy ___ umbrella, ___ bag, and ____ wallet.',
    options: { a: 'a / an / a', b: 'an / a / a', c: 'an / an / a', d: 'a / a / an' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 8,
    text: 'Hey! Laurie, can you see ______ two cars in the distance?\nNo, I can\'t. I need my glasses.',
    options: { a: 'these', b: 'that', c: 'this', d: 'those' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 9,
    text: 'There are more than ten _____ parked outside.',
    options: { a: 'bus', b: 'buses', c: 'buzes', d: 'buss' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 10,
    text: 'Can you describe your house, please?\nYes, It\'s really big. __________  a big living room. Also, __________ four bathrooms and four bedrooms.',
    options: { a: 'there are / there is', b: 'there is / there is', c: 'there is / there are', d: 'there are / there are' },
    correct: 'c'
  },

  // ELEMENTARY (11-25)
  {
    level: 'Basico',
    number: 11,
    text: 'Excuse me, ______ can you find a good mall in this city?\nThe best malls are downtown. You can take a bus right there.',
    options: { a: 'why', b: 'when', c: 'where', d: 'who' },
    correct: 'c'
  },
  {
    level: 'Basico',
    number: 12,
    text: 'What do you usually do on Monday morning, Susana?\nOh! well… I usually ______ to work and spend the day in the office.',
    options: { a: 'Goes', b: 'Went', c: 'Going', d: 'Go' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 13,
    text: '______ your sister like Pizza?\nYes, she loves it!',
    options: { a: 'Do', b: 'Does', c: 'Did', d: 'Can' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 14,
    text: 'My mother really _______ to buy a new car.',
    options: { a: 'wants', b: 'want', c: 'is wanting', d: 'wanting' },
    correct: 'a'
  },
  {
    level: 'Basico',
    number: 15,
    text: 'I usually travel by plane but today I ___________ by bus!',
    options: { a: 'are travel', b: 'am travel', c: 'am travelling', d: 'are travelling' },
    correct: 'c'
  },
  {
    level: 'Basico',
    number: 16,
    text: 'What a beautiful car!\nYes, it\'s _________. Her father gave it to her on her birthday.',
    options: { a: 'Lisas\' car', b: 'Lisa her car', c: 'Lisa\'s car', d: 'the car of Lisa' },
    correct: 'c'
  },
  {
    level: 'Basico',
    number: 17,
    text: 'There are a lot of ______ and _______ in this office but no one cares about the infestation of _______ they have. It\'s disgusting!',
    options: { a: 'mans / womans / mouses', b: 'men / Women / mouses', c: 'men / Womens / mice', d: 'men / women / mice' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 18,
    text: 'I am perfect! I never _______ mistakes!\nNo one is perfect Johanna, that\'s impossible.',
    options: { a: 'do', b: 'make', c: 'commit', d: 'take' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 19,
    text: 'This restaurant is amazing! ____ food is good and ____ service is excellent. There is ____ beautiful painting, too.',
    options: { a: 'An / a / the', b: 'The / the / the', c: 'The / a / a', d: 'The / the / a' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 20,
    text: 'Take a look at this picture of my new girlfriend. She ____ green eyes and blond hair. Also, she ____ very tall and thin.',
    options: { a: 'have / is', b: 'is / Has', c: 'has / is', d: 'has / has' },
    correct: 'c'
  },
  {
    level: 'Basico',
    number: 21,
    text: 'Let\'s go to the beach on Saturday!\nOh, I _____ swim sorry. But we could go to the French club.\nI _____ speak French George, you know that.',
    options: { a: 'can / can', b: 'don\'t know / don\'t know', c: 'can\'t / can\'t', d: 'no / Don\'t' },
    correct: 'c'
  },
  {
    level: 'Basico',
    number: 22,
    text: 'Where are you on Monday morning?\nI usually spend my mornings ____ the office.',
    options: { a: 'on', b: 'in', c: 'at', d: 'to' },
    correct: 'b'
  },
  {
    level: 'Basico',
    number: 23,
    text: 'Whose notebook is this?\nIt\'s _______.',
    options: { a: 'mine', b: 'my', c: 'her', d: 'their' },
    correct: 'a'
  },
  {
    level: 'Basico',
    number: 24,
    text: 'What are some differences between a car and a motorcycle?\nI suppose cars are _______ and _______, too!',
    options: { a: 'more fast / more expensive', b: 'faster / expensiver', c: 'more fast / expensiver', d: 'faster / more expensive' },
    correct: 'd'
  },
  {
    level: 'Basico',
    number: 25,
    text: 'I was thinking about our next anniversary.\nMe too! I would _________  it in Asia this year.',
    options: { a: 'like celebrate', b: 'like to celebrating', c: 'like to celebrate', d: 'to like celebrate' },
    correct: 'c'
  },

  // PRE-INTERMEDIATE (26-40)
  {
    level: 'Intermedio',
    number: 26,
    text: 'Hey Mark, where ____ you ____ last night?\nI went to the supermarket, why?',
    options: { a: 'did / go', b: 'did / went', c: 'do / went', d: 'do / go' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 27,
    text: 'I _____ to her yesterday but I didn\'t _____ to you! I swear!',
    options: { a: 'talk / lied', b: 'talked / lied', c: 'talked / lie', d: 'talk / lie' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 28,
    text: 'How ______ sugar do you like in your coffee?\nI like my coffee with _____ sugar, not much.',
    options: { a: 'many / any', b: 'much / some', c: 'many / some', d: 'much / any' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 29,
    text: 'I hate my legs! they are ____ fat. My hair is _____ pretty, though.',
    options: { a: 'too / Too', b: 'really / too', c: 'too / really', d: 'very / so' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 30,
    text: 'My sister has sleeping problems, can you give me some advice for her?\nShe _____ avoid using her cell phone at night and she _______ drink coffee either.',
    options: { a: 'needs / doesn\'t have to', b: 'should / shouldn\'t', c: 'can / could', d: 'must / might' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 31,
    text: 'What is all this mess? What did you do, Joe?\nI\'m sorry, mom!\n___ to your room right now! You\'re grounded!',
    options: { a: 'Went', b: 'Going', c: 'Go', d: 'Gone' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 32,
    text: 'I ____________ on the phone when my friend Carl knocked on the door.',
    options: { a: 'am talking', b: 'were talking', c: 'was talking', d: 'is talking' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 33,
    text: 'This is the _________ car in the world but I\'m afraid it\'s not ________.',
    options: { a: 'most expensive / faster', b: 'most expensive / the fastest', c: 'most expensive / the faster', d: 'expensivest / the fastest' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 34,
    text: 'She __________ stay in that hotel on her trip. She\'s already booked a room there for a week.',
    options: { a: 'is going to', b: 'will', c: 'might', d: 'is not going to' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 35,
    text: 'Sorry, I can\'t talk right now. I_________ call you back later.',
    options: { a: 'am going to', b: 'will', c: 'will to', d: 'definitely' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 36,
    text: '_____ you ever _____ Japanese food?\nYes, of course! My grandmother is Japanese.',
    options: { a: 'Had / eating', b: 'Are / eating', c: 'Have / ate', d: 'Have / eaten' },
    correct: 'd'
  },
  {
    level: 'Intermedio',
    number: 37,
    text: 'I ___________ driven a car! I hope I will get to drive one next year!',
    options: { a: 'yet haven\'t', b: 'still haven\'t', c: 'yet have', d: 'still have' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 38,
    text: 'Look at that woman on the stage! She is singing my favorite song!\nYes, she sings ________.',
    options: { a: 'beautiful', b: 'beautifully', c: 'good', d: 'perfect' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 39,
    text: 'Excuse me, do you know ___________ ?',
    options: { a: 'where is the bus station', b: 'where can I find the bus station', c: 'where the bus station is', d: 'where can be found the bus station' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 40,
    text: 'There are a lot of things to do in this house! Mark, you ____ the laundry and… Mary, you _____ breakfast while I ____ the ironing.',
    options: { a: 'make / make / do', b: 'do / do / make', c: 'do / do / do', d: 'do / make / do' },
    correct: 'd'
  },

  // INTERMEDIATE (41-60)
  {
    level: 'Intermedio',
    number: 41,
    text: '________ are going to beat ______ in the upcoming tournament, I\'m sure of that!\nYes! we are a great team!',
    options: { a: 'You and me / they', b: 'You and I / them', c: 'You and me / them', d: 'You and I / they' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 42,
    text: 'Sarah spends too much time in front of the mirror!\nYes, she really loves _______ a bit too much.',
    options: { a: 'she', b: 'herself', c: 'myself', d: 'her' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 43,
    text: 'Marie and Joseph are always arguing and insulting _______.',
    options: { a: 'them', b: 'themselves', c: 'herself', d: 'each other' },
    correct: 'd'
  },
  {
    level: 'Intermedio',
    number: 44,
    text: 'Both of them ____ very competitive!\nYes, you are right. Neither of them ______ to lose!',
    options: { a: 'are / wants', b: 'are / want', c: 'is / wants', d: 'is / want' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 45,
    text: 'When I was a kid, I _______ walk 10km to go to school everyday.',
    options: { a: 'was used to', b: 'used to', c: 'will', d: 'went to' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 46,
    text: 'She really likes playing volleyball, _________?',
    options: { a: 'doesn\'t she?', b: 'does she?', c: 'is she?', d: 'isn\'t she?' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 47,
    text: 'If you ______ your room, you ________ to the party tonight.',
    options: { a: 'cleaned / go', b: 'clean / would go', c: 'cleaned / would go', d: 'clean / will go' },
    correct: 'd'
  },
  {
    level: 'Intermedio',
    number: 48,
    text: 'I wanted to ____ together with my friends in the club tonight!',
    options: { a: 'go', b: 'be', c: 'get', d: 'have' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 49,
    text: 'The environment ___________ get better if we continue to pollute the air like we do!',
    options: { a: 'will definitely', b: 'won\'t definitely', c: 'definitely will', d: 'definitely won\'t' },
    correct: 'd'
  },
  {
    level: 'Intermedio',
    number: 50,
    text: 'I have _________ this book for weeks and I think I will never finish it! It\'s too long!',
    options: { a: 'read', b: 'been read', c: 'been reading', d: 'reading' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 51,
    text: 'My parents usually make me ________ my homework and they never let me_____ outside with the other kids!',
    options: { a: 'do / play', b: 'to do / to play', c: 'to do / play', d: 'do / to play' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 52,
    text: 'When I arrived at the restaurant Mark _________.\nReally?\nYes, he ____________ for me for more than one hour.',
    options: { a: 'has left / was waiting', b: 'had left / had been waiting', c: 'left / was waiting', d: 'had been leaving / waited' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 53,
    text: 'Joseph _______ me that he was leaving the country today.\nYes, he _______ the same thing in the meeting the other day.',
    options: { a: 'said / told', b: 'said / said', c: 'told / told', d: 'told / said' },
    correct: 'd'
  },
  {
    level: 'Intermedio',
    number: 54,
    text: 'Did you hear what the boss said yesterday?\nNo! What did he say?\nHe said that ________________',
    options: { a: 'he was going to promote Mary, the secretary.', b: 'he is going to promote Mary, the secretary.', c: 'he will promote Mary, the secretary.', d: 'he went to promote Mary, the secretary.' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 55,
    text: 'Million of books__________ everyday.',
    options: { a: 'will print', b: 'are print', c: 'printed', d: 'are printed' },
    correct: 'd'
  },
  {
    level: 'Intermedio',
    number: 56,
    text: 'My son, ______ is a lawyer, works in that big building over there!',
    options: { a: 'which', b: 'who', c: 'that', d: 'whom' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 57,
    text: 'If I ______ a lot of money, I _________ buy a big house in the hills.',
    options: { a: 'have / would', b: 'had / will', c: 'had / would', d: 'would / will' },
    correct: 'c'
  },
  {
    level: 'Intermedio',
    number: 58,
    text: 'Where _____ you go if you _____ fly?\nTo the North Pole, definitely!',
    options: { a: 'would / could', b: 'will / can', c: 'can / will', d: 'could / would' },
    correct: 'a'
  },
  {
    level: 'Intermedio',
    number: 59,
    text: 'I hate living in this small town! If only ______  somewhere else!',
    options: { a: 'I can live', b: 'I could live', c: 'I could lived', d: 'could I live' },
    correct: 'b'
  },
  {
    level: 'Intermedio',
    number: 60,
    text: 'I wish ________ in a big city!',
    options: { a: 'I lived', b: 'I am living', c: 'I can live', d: 'I would live' },
    correct: 'a'
  },

  // UPPER-INTERMEDIATE (61-70)
  {
    level: 'Avanzado',
    number: 61,
    text: 'I hate having to walk to school!\nI don\'t hate it. I ______ used to _____ it every day.',
    options: { a: 'will / do', b: 'am / doing', c: 'am / do', d: '— / doing' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 62,
    text: 'We had an incredible time at the party last night!\nOhh, if only I ________ you guys! now I regret it.',
    options: { a: 'joined', b: 'did join', c: 'had joined', d: 'have joined' },
    correct: 'c'
  },
  {
    level: 'Avanzado',
    number: 63,
    text: 'You haven\'t found your keys____, have you?\nNo, I ______ haven\'t.',
    options: { a: 'yet / already', b: 'still / yet', c: 'yet / yet', d: 'yet / still' },
    correct: 'd'
  },
  {
    level: 'Avanzado',
    number: 64,
    text: 'Why hasn\'t the teacher arrived?\nI don\'t know. He _________  in traffic.',
    options: { a: 'was caught', b: 'might have caught', c: 'might have been caught', d: 'was definitely caught' },
    correct: 'c'
  },
  {
    level: 'Avanzado',
    number: 65,
    text: 'Why do people care more about social media sites than the real life?\nThat\'s not true, it\'s mostly teenagers. ________ people or so, you know.',
    options: { a: '15-years-old', b: '15-year-old', c: '15 year old', d: '15 years old' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 66,
    text: 'Martial arts were created in _______ to fight attackers back!',
    options: { a: 'relation', b: 'consequence', c: 'intention', d: 'order' },
    correct: 'd'
  },
  {
    level: 'Avanzado',
    number: 67,
    text: 'My mother feels really bad!\nI suggest ________________ to the doctor.',
    options: { a: 'her to go', b: 'that she go', c: 'that she goes', d: 'her go' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 68,
    text: 'If I _______________ to that party, I __________ a great time! Too bad I didn\'t go.',
    options: { a: 'had gone / would have had', b: 'had gone / would have', c: 'went / would have had', d: 'go / would' },
    correct: 'a'
  },
  {
    level: 'Avanzado',
    number: 69,
    text: 'When you wake up tomorrow morning, I ________ driving my car 100 km away from here.',
    options: { a: 'be', b: 'will be', c: 'will', d: 'would be' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 70,
    text: 'We need that report by Monday morning urgently!\nI will ________ the report by tomorrow morning for sure.',
    options: { a: 'have written', b: 'write', c: 'have had written', d: 'writing' },
    correct: 'a'
  },

  // ADVANCED (71-80) - 75 originales + 5 nuevas
  {
    level: 'Avanzado',
    number: 71,
    text: 'You are _______ a good person. You are always helping others and that\'s ___ amazing!',
    options: { a: 'so / so', b: 'such / so', c: 'such / such', d: 'so / such' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 72,
    text: 'I am selling a ______________ table from the 18th century, are you interested?\nThanks but no, thanks. I prefer modern things.',
    options: { a: 'beautiful, wooden, round', b: 'round, wooden, beautiful', c: 'beautiful, round, wooden', d: 'wooden, beautiful, round' },
    correct: 'c'
  },
  {
    level: 'Avanzado',
    number: 73,
    text: 'This product is amazing! Not only________ clean and dry with it, but you can also use it as a tablecloth!',
    options: { a: 'you can', b: 'can you', c: 'can', d: 'you' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 74,
    text: 'Nobody knew it at that time but he ______ one of the most successful pop artist ten years later!',
    options: { a: 'will become', b: 'would become', c: 'became', d: 'would have become' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 75,
    text: 'I have a big collection of cars, ___________ are Ferrari!',
    options: { a: 'from three', b: 'three of which', c: 'three of whom', d: 'from which three' },
    correct: 'b'
  },
  // 5 PREGUNTAS ADICIONALES PARA COMPLETAR 80
  {
    level: 'Avanzado',
    number: 76,
    text: 'Had I known about the meeting, I ________ attended it without hesitation.',
    options: { a: 'would', b: 'will have', c: 'would have', d: 'will' },
    correct: 'c'
  },
  {
    level: 'Avanzado',
    number: 77,
    text: 'The committee decided to postpone the event, ________ was a wise decision given the circumstances.',
    options: { a: 'what', b: 'which', c: 'that', d: 'who' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 78,
    text: 'By the time you arrive, I ________ the project for three hours.',
    options: { a: 'will have been working on', b: 'will work on', c: 'have worked on', d: 'am working on' },
    correct: 'a'
  },
  {
    level: 'Avanzado',
    number: 79,
    text: 'Scarcely ________ the door when the phone started ringing.',
    options: { a: 'I had opened', b: 'had I opened', c: 'I opened', d: 'did I open' },
    correct: 'b'
  },
  {
    level: 'Avanzado',
    number: 80,
    text: 'The teacher insisted that every student ________ the assignment on time.',
    options: { a: 'submits', b: 'submitted', c: 'submit', d: 'will submit' },
    correct: 'c'
  }
];

async function seedDatabase() {
  try {
    const pool = await getConnection();
    
    console.log('🌱 Iniciando seed de la base de datos...');

    // 1. Insertar niveles
    console.log('\n📊 Insertando niveles...');
    for (const level of levels) {
      await pool.request()
        .input('name', sql.VarChar(50), level.name)
        .input('order', sql.Int, level.order)
        .input('minPercentage', sql.Decimal(5, 2), level.minPercentage)
        .input('maxPercentage', sql.Decimal(5, 2), level.maxPercentage)
        .input('description', sql.VarChar(255), level.description)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Levels WHERE level_name = @name)
          INSERT INTO Levels (level_name, level_order, min_percentage, max_percentage, description)
          VALUES (@name, @order, @minPercentage, @maxPercentage, @description)
        `);
      console.log(`  ✓ Nivel ${level.name} insertado`);
    }

    // 2. Insertar tipos de examen
    console.log('\n📝 Insertando tipos de examen...');
    for (const examType of examTypes) {
      await pool.request()
        .input('name', sql.VarChar(50), examType.name)
        .input('totalQuestions', sql.Int, examType.totalQuestions)
        .input('maxAttempts', sql.Int, examType.maxAttempts)
        .input('pointsPerQuestion', sql.Decimal(5, 2), examType.pointsPerQuestion)
        .input('passingScore', sql.Decimal(5, 2), examType.passingScore)
        .input('timeLimitSeconds', sql.Int, examType.timeLimitSeconds)
        .input('description', sql.VarChar(255), examType.description)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM ExamTypes WHERE type_name = @name)
          INSERT INTO ExamTypes (type_name, total_questions, max_attempts, points_per_question, passing_score, time_limit_seconds, description)
          VALUES (@name, @totalQuestions, @maxAttempts, @pointsPerQuestion, @passingScore, @timeLimitSeconds, @description)
        `);
      console.log(`  ✓ Tipo de examen ${examType.name} insertado`);
    }

    // 3. Insertar preguntas
    console.log('\n❓ Insertando 80 preguntas...');
    for (const question of questions) {
      // Obtener level_id
      const levelResult = await pool.request()
        .input('levelName', sql.VarChar(50), question.level)
        .query('SELECT level_id FROM Levels WHERE level_name = @levelName');
      
      const levelId = levelResult.recordset[0].level_id;

      await pool.request()
        .input('levelId', sql.Int, levelId)
        .input('questionNumber', sql.Int, question.number)
        .input('questionText', sql.NVarChar(sql.MAX), question.text)
        .input('optionA', sql.NVarChar(500), question.options.a)
        .input('optionB', sql.NVarChar(500), question.options.b)
        .input('optionC', sql.NVarChar(500), question.options.c)
        .input('optionD', sql.NVarChar(500), question.options.d)
        .input('correctAnswer', sql.Char(1), question.correct)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Questions WHERE level_id = @levelId AND question_number = @questionNumber)
          INSERT INTO Questions (level_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer)
          VALUES (@levelId, @questionNumber, @questionText, @optionA, @optionB, @optionC, @optionD, @correctAnswer)
        `);
      
      if (question.number % 10 === 0) {
        console.log(`  ✓ ${question.number} preguntas insertadas...`);
      }
    }
    console.log('  ✓ 80 preguntas insertadas completamente');

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📈 Resumen:');
    console.log(`   - ${levels.length} niveles`);
    console.log(`   - ${examTypes.length} tipos de examen`);
    console.log(`   - ${questions.length} preguntas`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

// Ejecutar seed
seedDatabase()
  .then(() => {
    console.log('\n🎉 Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
