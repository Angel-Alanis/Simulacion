const { getConnection, sql } = require('../src/config/database');
const bcrypt = require('bcryptjs');

// 3 niveles: Basico, Intermedio, Avanzado
const levels = [
  { name: 'Basico', order: 1, minPercentage: 0, maxPercentage: 69.99, description: 'Nivel básico de inglés' },
  { name: 'Intermedio', order: 2, minPercentage: 70, maxPercentage: 84.99, description: 'Nivel intermedio de inglés' },
  { name: 'Avanzado', order: 3, minPercentage: 85, maxPercentage: 100, description: 'Nivel avanzado de inglés' }
];

// Tipos de examen
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
    description: 'Examen final - 2 intentos'
  }
];

// Usuarios de prueba
const users = [
  { username: 'juan_perez', email: 'juan.perez@test.com', password: 'password123', fullName: 'Juan Pérez García' },
  { username: 'maria_lopez', email: 'maria.lopez@test.com', password: 'password123', fullName: 'María López Rodríguez' },
  { username: 'carlos_sanchez', email: 'carlos.sanchez@test.com', password: 'password123', fullName: 'Carlos Sánchez Martínez' },
  { username: 'ana_torres', email: 'ana.torres@test.com', password: 'password123', fullName: 'Ana Torres Fernández' },
  { username: 'luis_ramirez', email: 'luis.ramirez@test.com', password: 'password123', fullName: 'Luis Ramírez González' },
  { username: 'sofia_cruz', email: 'sofia.cruz@test.com', password: 'password123', fullName: 'Sofía Cruz Morales' },
  { username: 'pedro_diaz', email: 'pedro.diaz@test.com', password: 'password123', fullName: 'Pedro Díaz Herrera' },
  { username: 'laura_ruiz', email: 'laura.ruiz@test.com', password: 'password123', fullName: 'Laura Ruiz Castro' },
  { username: 'miguel_flores', email: 'miguel.flores@test.com', password: 'password123', fullName: 'Miguel Flores Ortiz' },
  { username: 'elena_vargas', email: 'elena.vargas@test.com', password: 'password123', fullName: 'Elena Vargas Mendoza' }
];

// 80 preguntas distribuidas en 3 niveles
const questions = [
  // NIVEL BÁSICO - 30 preguntas (1-30)
  {
    level: 'Basico',
    questionNumber: 1,
    text: 'What _____ your name?',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 2,
    text: 'She _____ from Mexico.',
    optionA: 'am',
    optionB: 'is',
    optionC: 'are',
    optionD: 'be',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 3,
    text: 'They _____ students.',
    optionA: 'is',
    optionB: 'am',
    optionC: 'are',
    optionD: 'be',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 4,
    text: 'I _____ happy today.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 5,
    text: 'This is _____ book.',
    optionA: 'a',
    optionB: 'an',
    optionC: 'the',
    optionD: 'some',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 6,
    text: 'Those are _____ apples.',
    optionA: 'a',
    optionB: 'an',
    optionC: 'the',
    optionD: 'any',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 7,
    text: 'He _____ to school every day.',
    optionA: 'go',
    optionB: 'goes',
    optionC: 'going',
    optionD: 'gone',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 8,
    text: 'We _____ English now.',
    optionA: 'study',
    optionB: 'studies',
    optionC: 'studying',
    optionD: 'are studying',
    correctAnswer: 'd'
  },
  {
    level: 'Basico',
    questionNumber: 9,
    text: '_____ you like pizza?',
    optionA: 'Do',
    optionB: 'Does',
    optionC: 'Are',
    optionD: 'Is',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 10,
    text: 'She _____ have a car.',
    optionA: "don't",
    optionB: "doesn't",
    optionC: "isn't",
    optionD: "aren't",
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 11,
    text: 'My brother _____ in London.',
    optionA: 'live',
    optionB: 'lives',
    optionC: 'living',
    optionD: 'is live',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 12,
    text: 'There _____ a cat in the garden.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 13,
    text: 'There _____ many people at the party.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'was',
    optionD: 'am',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 14,
    text: 'I _____ to the cinema yesterday.',
    optionA: 'go',
    optionB: 'goes',
    optionC: 'went',
    optionD: 'going',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 15,
    text: 'She _____ her homework last night.',
    optionA: 'do',
    optionB: 'does',
    optionC: 'did',
    optionD: 'doing',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 16,
    text: 'We _____ at home now.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 17,
    text: '_____ is your favorite color?',
    optionA: 'What',
    optionB: 'Where',
    optionC: 'When',
    optionD: 'Who',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 18,
    text: '_____ do you live?',
    optionA: 'What',
    optionB: 'Where',
    optionC: 'When',
    optionD: 'Who',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 19,
    text: 'How _____ are you?',
    optionA: 'old',
    optionB: 'age',
    optionC: 'years',
    optionD: 'much',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 20,
    text: 'This is _____ house.',
    optionA: 'my',
    optionB: 'mine',
    optionC: 'me',
    optionD: 'I',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 21,
    text: 'That pen is _____.',
    optionA: 'her',
    optionB: 'hers',
    optionC: 'she',
    optionD: 'his',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 22,
    text: 'I can _____ English.',
    optionA: 'speak',
    optionB: 'speaks',
    optionC: 'speaking',
    optionD: 'spoke',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 23,
    text: 'She _____ swim very well.',
    optionA: 'can',
    optionB: 'cans',
    optionC: 'is can',
    optionD: 'to can',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 24,
    text: 'Would you like _____ coffee?',
    optionA: 'a',
    optionB: 'an',
    optionC: 'some',
    optionD: 'any',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 25,
    text: 'Excuse me, _____ can you find a good mall in this city? The best malls are downtown. You can take a bus right there.',
    optionA: 'why',
    optionB: 'when',
    optionC: 'where',
    optionD: 'who',
    correctAnswer: 'c'
  },
  {
    level: 'Basico',
    questionNumber: 26,
    text: 'I _____ breakfast at 8 AM.',
    optionA: 'eat',
    optionB: 'eats',
    optionC: 'eating',
    optionD: 'ate',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 27,
    text: 'They _____ watching TV.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'b'
  },
  {
    level: 'Basico',
    questionNumber: 28,
    text: 'My sister _____ beautiful.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 29,
    text: 'The weather _____ nice today.',
    optionA: 'is',
    optionB: 'are',
    optionC: 'am',
    optionD: 'be',
    correctAnswer: 'a'
  },
  {
    level: 'Basico',
    questionNumber: 30,
    text: 'I need _____ new phone.',
    optionA: 'a',
    optionB: 'an',
    optionC: 'the',
    optionD: 'some',
    correctAnswer: 'a'
  },

  // NIVEL INTERMEDIO - 30 preguntas (31-60)
  {
    level: 'Intermedio',
    questionNumber: 31,
    text: 'I have _____ here before.',
    optionA: 'be',
    optionB: 'been',
    optionC: 'being',
    optionD: 'was',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 32,
    text: 'She _____ studying for three hours.',
    optionA: 'has been',
    optionB: 'have been',
    optionC: 'is been',
    optionD: 'was been',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 33,
    text: 'If I _____ you, I would study harder.',
    optionA: 'am',
    optionB: 'was',
    optionC: 'were',
    optionD: 'be',
    correctAnswer: 'c'
  },
  {
    level: 'Intermedio',
    questionNumber: 34,
    text: 'This is the _____ book I have ever read.',
    optionA: 'good',
    optionB: 'better',
    optionC: 'best',
    optionD: 'well',
    correctAnswer: 'c'
  },
  {
    level: 'Intermedio',
    questionNumber: 35,
    text: 'He asked me _____ I was going.',
    optionA: 'where',
    optionB: 'what',
    optionC: 'that',
    optionD: 'which',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 36,
    text: 'The movie _____ we saw was amazing.',
    optionA: 'who',
    optionB: 'which',
    optionC: 'where',
    optionD: 'when',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 37,
    text: 'She has lived here _____ 2010.',
    optionA: 'since',
    optionB: 'for',
    optionC: 'from',
    optionD: 'during',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 38,
    text: 'I have been waiting _____ two hours.',
    optionA: 'since',
    optionB: 'for',
    optionC: 'from',
    optionD: 'during',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 39,
    text: 'The house _____ by a famous architect.',
    optionA: 'designed',
    optionB: 'was designed',
    optionC: 'is designing',
    optionD: 'designs',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 40,
    text: 'The letter _____ yesterday.',
    optionA: 'sent',
    optionB: 'was sent',
    optionC: 'is sent',
    optionD: 'sends',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 41,
    text: 'I wish I _____ speak French.',
    optionA: 'can',
    optionB: 'could',
    optionC: 'will',
    optionD: 'would',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 42,
    text: 'She suggested _____ to the beach.',
    optionA: 'go',
    optionB: 'to go',
    optionC: 'going',
    optionD: 'went',
    correctAnswer: 'c'
  },
  {
    level: 'Intermedio',
    questionNumber: 43,
    text: 'He denied _____ the money.',
    optionA: 'take',
    optionB: 'to take',
    optionC: 'taking',
    optionD: 'took',
    correctAnswer: 'c'
  },
  {
    level: 'Intermedio',
    questionNumber: 44,
    text: 'I am looking forward to _____ you.',
    optionA: 'see',
    optionB: 'seeing',
    optionC: 'saw',
    optionD: 'seen',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 45,
    text: 'She would rather _____ at home.',
    optionA: 'stay',
    optionB: 'to stay',
    optionC: 'staying',
    optionD: 'stayed',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 46,
    text: 'Neither John _____ Mary came to the party.',
    optionA: 'or',
    optionB: 'nor',
    optionC: 'and',
    optionD: 'but',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 47,
    text: 'He is not only smart _____ also hardworking.',
    optionA: 'and',
    optionB: 'but',
    optionC: 'or',
    optionD: 'yet',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 48,
    text: 'The more you practice, _____ you become.',
    optionA: 'the better',
    optionB: 'better',
    optionC: 'the best',
    optionD: 'best',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 49,
    text: 'By the time you arrive, I _____ finished.',
    optionA: 'will',
    optionB: 'will have',
    optionC: 'would',
    optionD: 'would have',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 50,
    text: 'She _____ be at home now.',
    optionA: 'must',
    optionB: 'can',
    optionC: 'may',
    optionD: 'might',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 51,
    text: 'You _____ smoke in here.',
    optionA: "don't have to",
    optionB: "mustn't",
    optionC: "needn't",
    optionD: "shouldn't",
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 52,
    text: 'I _____ go to the doctor if I were you.',
    optionA: 'will',
    optionB: 'would',
    optionC: 'should',
    optionD: 'must',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 53,
    text: 'The man _____ lives next door is a teacher.',
    optionA: 'who',
    optionB: 'which',
    optionC: 'whose',
    optionD: 'whom',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 54,
    text: 'This is the car _____ I bought last week.',
    optionA: 'who',
    optionB: 'which',
    optionC: 'whose',
    optionD: 'whom',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 55,
    text: 'The woman _____ son won the prize is my neighbor.',
    optionA: 'who',
    optionB: 'which',
    optionC: 'whose',
    optionD: 'whom',
    correctAnswer: 'c'
  },
  {
    level: 'Intermedio',
    questionNumber: 56,
    text: 'Despite _____ tired, she went to work.',
    optionA: 'be',
    optionB: 'being',
    optionC: 'been',
    optionD: 'is',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 57,
    text: 'Unless you _____, you will fail.',
    optionA: 'study',
    optionB: 'studied',
    optionC: 'will study',
    optionD: 'would study',
    correctAnswer: 'a'
  },
  {
    level: 'Intermedio',
    questionNumber: 58,
    text: 'I would have helped you if I _____ known.',
    optionA: 'have',
    optionB: 'had',
    optionC: 'has',
    optionD: 'having',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 59,
    text: 'Hardly _____ arrived when it started raining.',
    optionA: 'I had',
    optionB: 'had I',
    optionC: 'I have',
    optionD: 'have I',
    correctAnswer: 'b'
  },
  {
    level: 'Intermedio',
    questionNumber: 60,
    text: 'Not only _____ smart, but also kind.',
    optionA: 'she is',
    optionB: 'is she',
    optionC: 'she was',
    optionD: 'was she',
    correctAnswer: 'b'
  },

  // NIVEL AVANZADO - 20 preguntas (61-80)
  {
    level: 'Avanzado',
    questionNumber: 61,
    text: 'Had I known about the meeting, I _____ attended.',
    optionA: 'would have',
    optionB: 'would',
    optionC: 'will have',
    optionD: 'will',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 62,
    text: 'Seldom _____ such a beautiful sunset.',
    optionA: 'have I seen',
    optionB: 'I have seen',
    optionC: 'I saw',
    optionD: 'did I saw',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 63,
    text: 'The report, _____ was due yesterday, has not been submitted.',
    optionA: 'that',
    optionB: 'which',
    optionC: 'who',
    optionD: 'what',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 64,
    text: 'Were it not for your help, I _____ succeeded.',
    optionA: "wouldn't have",
    optionB: "won't have",
    optionC: "didn't",
    optionD: "don't",
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 65,
    text: 'The phenomenon _____ by scientists for decades.',
    optionA: 'has been studying',
    optionB: 'has been studied',
    optionC: 'have been studied',
    optionD: 'is studying',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 66,
    text: 'Not until yesterday _____ the truth.',
    optionA: 'I discovered',
    optionB: 'did I discover',
    optionC: 'I did discover',
    optionD: 'discovered I',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 67,
    text: 'The committee recommended that the proposal _____ approved.',
    optionA: 'is',
    optionB: 'be',
    optionC: 'was',
    optionD: 'were',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 68,
    text: 'Scarcely _____ when the phone rang.',
    optionA: 'had I arrived',
    optionB: 'I had arrived',
    optionC: 'I arrived',
    optionD: 'did I arrive',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 69,
    text: 'The issue is far more complex than it _____ appears.',
    optionA: 'initial',
    optionB: 'initially',
    optionC: 'initials',
    optionD: 'initiate',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 70,
    text: 'It is imperative that he _____ on time.',
    optionA: 'arrives',
    optionB: 'arrive',
    optionC: 'arrived',
    optionD: 'arriving',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 71,
    text: 'The regulations _____ all employees without exception.',
    optionA: 'apply to',
    optionB: 'apply for',
    optionC: 'apply in',
    optionD: 'apply on',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 72,
    text: 'Never before _____ such dedication.',
    optionA: 'I have witnessed',
    optionB: 'have I witnessed',
    optionC: 'I witnessed',
    optionD: 'did I witness',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 73,
    text: 'Should you require assistance, please _____ hesitate to contact us.',
    optionA: 'not',
    optionB: 'don\'t',
    optionC: 'no',
    optionD: 'never',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 74,
    text: 'The hypothesis, _____ validity is questionable, requires further research.',
    optionA: 'that',
    optionB: 'which',
    optionC: 'whose',
    optionD: 'who',
    correctAnswer: 'c'
  },
  {
    level: 'Avanzado',
    questionNumber: 75,
    text: 'Little _____ that the decision would have such consequences.',
    optionA: 'did they know',
    optionB: 'they knew',
    optionC: 'they did know',
    optionD: 'knew they',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 76,
    text: 'The findings _____ a significant correlation between the variables.',
    optionA: 'indicate',
    optionB: 'indicates',
    optionC: 'indicating',
    optionD: 'indicated',
    correctAnswer: 'a'
  },
  {
    level: 'Avanzado',
    questionNumber: 77,
    text: 'No sooner _____ than it began to rain.',
    optionA: 'we left',
    optionB: 'had we left',
    optionC: 'did we leave',
    optionD: 'we had left',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 78,
    text: 'The manuscript, _____ author remains anonymous, has gained widespread acclaim.',
    optionA: 'that',
    optionB: 'which',
    optionC: 'whose',
    optionD: 'who',
    correctAnswer: 'c'
  },
  {
    level: 'Avanzado',
    questionNumber: 79,
    text: 'It is essential that the guidelines _____ strictly followed.',
    optionA: 'are',
    optionB: 'be',
    optionC: 'is',
    optionD: 'were',
    correctAnswer: 'b'
  },
  {
    level: 'Avanzado',
    questionNumber: 80,
    text: 'Under no circumstances _____ this information be disclosed.',
    optionA: 'should',
    optionB: 'would',
    optionC: 'could',
    optionD: 'might',
    correctAnswer: 'a'
  }
];

async function seedDatabase() {
  try {
    const pool = await getConnection();
    console.log('Iniciando proceso de seed...');

    // Limpiar tablas
    console.log('Limpiando tablas...');
    await pool.request().query('DELETE FROM UserAnswers');
    await pool.request().query('DELETE FROM ExamQuestions');
    await pool.request().query('DELETE FROM Exams');
    await pool.request().query('DELETE FROM UserStatistics');
    await pool.request().query('DELETE FROM Questions');
    await pool.request().query('DELETE FROM Users');
    await pool.request().query('DELETE FROM ExamTypes');
    await pool.request().query('DELETE FROM Levels');

    // Insertar niveles
    console.log('Insertando niveles...');
    for (const level of levels) {
      await pool.request()
        .input('name', sql.VarChar(50), level.name)
        .input('order', sql.Int, level.order)
        .input('minPercentage', sql.Decimal(5, 2), level.minPercentage)
        .input('maxPercentage', sql.Decimal(5, 2), level.maxPercentage)
        .input('description', sql.VarChar(255), level.description)
        .query(`
          INSERT INTO Levels (level_name, level_order, min_percentage, max_percentage, description)
          VALUES (@name, @order, @minPercentage, @maxPercentage, @description)
        `);
    }
    console.log(`${levels.length} niveles insertados`);

    // Insertar tipos de examen
    console.log('Insertando tipos de examen...');
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
          INSERT INTO ExamTypes (type_name, total_questions, max_attempts, points_per_question, passing_score, time_limit_seconds, description)
          VALUES (@name, @totalQuestions, @maxAttempts, @pointsPerQuestion, @passingScore, @timeLimitSeconds, @description)
        `);
    }
    console.log(`${examTypes.length} tipos de examen insertados`);

    // Obtener IDs de niveles
    const levelIds = {};
    const levelResults = await pool.request().query('SELECT level_id, level_name FROM Levels');
    levelResults.recordset.forEach(row => {
      levelIds[row.level_name] = row.level_id;
    });

    // Insertar preguntas
    console.log('Insertando preguntas...');
    for (const question of questions) {
      const levelId = levelIds[question.level];
      await pool.request()
        .input('levelId', sql.Int, levelId)
        .input('questionNumber', sql.Int, question.questionNumber)
        .input('questionText', sql.NVarChar(sql.MAX), question.text)
        .input('optionA', sql.NVarChar(500), question.optionA)
        .input('optionB', sql.NVarChar(500), question.optionB)
        .input('optionC', sql.NVarChar(500), question.optionC)
        .input('optionD', sql.NVarChar(500), question.optionD)
        .input('correctAnswer', sql.Char(1), question.correctAnswer)
        .query(`
          INSERT INTO Questions (level_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer)
          VALUES (@levelId, @questionNumber, @questionText, @optionA, @optionB, @optionC, @optionD, @correctAnswer)
        `);
    }
    console.log(`${questions.length} preguntas insertadas`);

    // Insertar usuarios
    console.log('Insertando usuarios...');
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.request()
        .input('username', sql.VarChar(100), user.username)
        .input('email', sql.VarChar(150), user.email)
        .input('passwordHash', sql.VarChar(255), hashedPassword)
        .input('fullName', sql.NVarChar(200), user.fullName)
        .query(`
          INSERT INTO Users (username, email, password_hash, full_name)
          VALUES (@username, @email, @passwordHash, @fullName)
        `);
    }
    console.log(`${users.length} usuarios insertados`);

    console.log('Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

seedDatabase();
