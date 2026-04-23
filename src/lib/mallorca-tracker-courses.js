const COURSE_META = {
  'Golf Son Gual': {
    location: 'East of Palma',
    text: 'A polished inland Mallorca championship course with wide visuals, bold bunkering, and strong strategic targets.',
  },
  'Club de Golf Alcanada': {
    location: 'Alcudia Bay',
    text: 'A coastal Mallorca course with sea views, breeze management, and demanding approach angles.',
  },
  'Son Muntaner': {
    location: 'Arabella Golf, Palma',
    text: 'A premium Palma course with mature trees, shaped holes, and excellent strategy value for stronger players.',
  },
  'Golf Son Termes': {
    location: 'Bunyola',
    text: 'A hilly Mallorca course where slopes, lies, and placement matter as much as distance.',
  },
  'Golf Santa Ponsa 1': {
    location: 'Santa Ponsa',
    text: 'A long, tournament-style Mallorca layout with big carries, water pressure, and strong par-five strategy.',
  },
  'Golf Santa Ponsa 2': {
    location: 'Santa Ponsa',
    text: 'A position-first Santa Ponsa course where tee-shot shape and clean approaches are the priority.',
  },
  'Real Golf de Bendinat': { location: 'Bendinat', text: 'Wooded valley course above Bendinat with Palma Bay views.' },
  'T Golf Calvia (Poniente)': { location: 'Calvia', text: 'Polished southwest Mallorca course with lakes, wide driving lines, and mountain/sea views.' },
  'Golf Maioris': { location: 'Llucmajor', text: 'South Mallorca course with a Scottish-feel front nine and flatter American-style back nine.' },
  'Golf Son Antem East': { location: 'Llucmajor', text: 'Generous resort course with wide fairways and lake strategy.' },
  'Golf Son Antem West': { location: 'Llucmajor', text: 'More demanding Son Antem layout with tighter fairways and tournament character.' },
  'Capdepera Golf': { location: 'Arta', text: 'Dan Maples design that moves from open valley holes into hillier Levant terrain.' },
  'Canyamel Golf': { location: 'Capdepera', text: 'Characterful east-coast course with several memorable par fives and short holes.' },
  'Pula Golf': { location: 'Son Servera', text: 'Olazabal-redesigned tournament course with strong practice facilities.' },
  'Golf Club Son Servera': { location: 'Son Servera', text: 'Established coastal parkland course with pine-lined holes and water in play.' },
  "Vall d'Or Golf": { location: "S'Horta", text: 'East-coast course with tight early holes and a more open sea-view back nine.' },
  'Reserva Rotana': { location: 'Manacor', text: 'Private 9-hole estate course near Manacor.' },
  'Golf Pollensa': { location: 'Pollensa', text: 'Compact 9-hole course with Tramuntana and bay views.' },
  'Palma Pitch & Putt': { location: 'Palma', text: 'Official 9-hole pitch and putt course for short-game practice.' },
}

function findCourseByName(name) {
  return COURSE_META[name] || null
}

const CURATED_COURSE_NAMES = [
  'Golf Son Gual',
  'Club de Golf Alcanada',
  'Son Muntaner',
  'Golf Son Termes',
  'Golf Santa Ponsa 1',
  'Golf Santa Ponsa 2',
  'Golf Santa Ponsa 3',
  'T Golf Palma Puntiro',
  'Real Golf de Bendinat',
  'T Golf Calvia (Poniente)',
  'Golf Maioris',
  'Golf Son Antem East',
  'Golf Son Antem West',
  'Capdepera Golf',
  'Canyamel Golf',
  'Pula Golf',
  'Golf Club Son Servera',
  "Vall d'Or Golf",
  'Reserva Rotana',
  'Golf Pollensa',
  'Palma Pitch & Putt',
  'Golf Son Vida',
  'Golf Son Quint',
  'Golf de Andratx',
]

const PRIORITY_COURSE_NAMES = new Set([
  'Golf Son Gual',
  'Club de Golf Alcanada',
  'Son Muntaner',
  'Golf Son Termes',
  'Golf Santa Ponsa 1',
  'Golf Santa Ponsa 2',
])

const COURSE_THEMES = {
  'Golf Son Gual': { accent: '#496f5f', fairway: '#6f977f', sky: '#d9ebe6' },
  'Club de Golf Alcanada': { accent: '#2b5f73', fairway: '#76a99e', sky: '#d7ecf0' },
  'Son Muntaner': { accent: '#405f35', fairway: '#7ea56a', sky: '#e2efd4' },
  'Golf Son Termes': { accent: '#715f41', fairway: '#97a26e', sky: '#ebe5cf' },
  'Golf Santa Ponsa 1': { accent: '#365f4a', fairway: '#7faf88', sky: '#ddede6' },
  'Golf Santa Ponsa 2': { accent: '#285364', fairway: '#74a1a2', sky: '#d8edf2' },
  'Golf Santa Ponsa 3': { accent: '#5d5f2d', fairway: '#a3ad67', sky: '#ecedda' },
  'T Golf Palma Puntiro': { accent: '#57513a', fairway: '#9b976b', sky: '#eeebdd' },
  'Real Golf de Bendinat': { accent: '#426050', fairway: '#8baa78', sky: '#e3ead8' },
  'T Golf Calvia (Poniente)': { accent: '#355f4d', fairway: '#80a978', sky: '#e0ead5' },
  'Golf Maioris': { accent: '#5d6040', fairway: '#9ea66b', sky: '#eeead9' },
  'Golf Son Antem East': { accent: '#486544', fairway: '#8dad73', sky: '#e7efd8' },
  'Golf Son Antem West': { accent: '#405f45', fairway: '#7fa574', sky: '#e5efd9' },
  'Capdepera Golf': { accent: '#52633d', fairway: '#98aa65', sky: '#ecebd5' },
  'Canyamel Golf': { accent: '#305d54', fairway: '#79a596', sky: '#dff0ec' },
  'Pula Golf': { accent: '#3f6142', fairway: '#88aa70', sky: '#e6efd9' },
  'Golf Club Son Servera': { accent: '#315b51', fairway: '#7fa18a', sky: '#dfebe4' },
  "Vall d'Or Golf": { accent: '#2f5f62', fairway: '#77a39a', sky: '#d8edf0' },
  'Reserva Rotana': { accent: '#63523f', fairway: '#9b8f66', sky: '#eee5d2' },
  'Golf Pollensa': { accent: '#4f6040', fairway: '#95a56b', sky: '#e8ead8' },
  'Palma Pitch & Putt': { accent: '#2f5f59', fairway: '#82aa8d', sky: '#dcefe8' },
  'Golf Son Vida': { accent: '#4c5840', fairway: '#8ea171', sky: '#e6ead7' },
  'Golf Son Quint': { accent: '#2f5d59', fairway: '#77a49e', sky: '#dff0ec' },
  'Golf de Andratx': { accent: '#6f4e3c', fairway: '#9c8764', sky: '#f0e2d8' },
}

const BASE_INDEXES = [9, 3, 15, 7, 13, 1, 11, 17, 5, 10, 2, 18, 8, 14, 4, 16, 6, 12]

const PRIORITY_VARIANTS = {
  'Golf Son Gual': ['straight', 'dogleg-right', 'straight', 'soft-left', 'dogleg-left', 'double-bend', 'soft-right', 'straight', 'dogleg-left', 'straight', 'dogleg-right', 'soft-left', 'straight', 'soft-right', 'double-bend', 'straight', 'dogleg-left', 'soft-right'],
  'Club de Golf Alcanada': ['soft-right', 'dogleg-left', 'straight', 'soft-left', 'dogleg-right', 'double-bend', 'straight', 'soft-right', 'dogleg-left', 'straight', 'soft-left', 'straight', 'dogleg-right', 'soft-left', 'double-bend', 'straight', 'soft-right', 'dogleg-left'],
  'Son Muntaner': ['straight', 'soft-left', 'straight', 'dogleg-right', 'soft-right', 'double-bend', 'straight', 'soft-left', 'dogleg-left', 'straight', 'dogleg-right', 'soft-right', 'straight', 'soft-left', 'double-bend', 'straight', 'dogleg-right', 'soft-left'],
  'Golf Son Termes': ['soft-left', 'dogleg-right', 'straight', 'dogleg-left', 'soft-right', 'double-bend', 'straight', 'soft-left', 'straight', 'dogleg-right', 'soft-right', 'straight', 'dogleg-left', 'soft-left', 'double-bend', 'straight', 'soft-right', 'dogleg-left'],
  'Golf Santa Ponsa 1': ['straight', 'dogleg-right', 'straight', 'dogleg-left', 'soft-right', 'double-bend', 'straight', 'soft-left', 'dogleg-right', 'straight', 'dogleg-left', 'straight', 'soft-right', 'soft-left', 'double-bend', 'straight', 'dogleg-right', 'soft-left'],
  'Golf Santa Ponsa 2': ['soft-right', 'straight', 'dogleg-left', 'soft-left', 'dogleg-right', 'double-bend', 'straight', 'soft-right', 'straight', 'dogleg-left', 'soft-left', 'straight', 'dogleg-right', 'soft-right', 'double-bend', 'straight', 'dogleg-left', 'soft-left'],
}

const PRIORITY_GUIDANCE = {
  'Golf Son Gual': [
    'Start on the wider side and play for the better angle.',
    'Second-shot placement matters more than forcing length.',
    'Take enough club; short leaves the wrong test.',
    'Raised target means trajectory control matters.',
  ],
  'Club de Golf Alcanada': [
    'Sea breeze can make one more club the calm option.',
    'Position beats aggression when the bunkers narrow the landing.',
    'The green movement is often the real defence.',
    'Leave the approach from the side that opens the flag.',
  ],
  'Son Muntaner': [
    'Think one shot ahead and leave the right angle.',
    'Misses on the safe side still need to be planned.',
    'This is more of a placement hole than it first looks.',
    'Below the hole is almost always worth something here.',
  ],
  'Golf Son Termes': [
    'Use the terrain; not every hole wants a high ball.',
    'Trust the line even when the valley framing feels narrow.',
    'Lay back to a full number when in doubt.',
    'One extra club uphill is often the smart play.',
  ],
  'Golf Santa Ponsa 1': [
    'Tour-style visuals reward commitment, not steering.',
    'This is frequently a three-shot design even for good players.',
    'Choose the widest usable section of fairway first.',
    'Long holes here reward discipline more than heroism.',
  ],
  'Golf Santa Ponsa 2': [
    'Driver is often optional; position is not.',
    'Play the hole backwards from a favourite yardage.',
    'Tree trouble compounds quickly, so favour the clean angle.',
    'Pick a landing number, then build the hole from there.',
  ],
}

const PRIORITY_HAZARDS = {
  'Golf Son Gual': ['Bunker right', 'Run-off left', 'Raised green', 'Cross bunker'],
  'Club de Golf Alcanada': ['Sea breeze', 'Bunker shelf', 'Run-out right', 'Tiered green'],
  'Son Muntaner': ['Trees both sides', 'Bunker front left', 'Fast green', 'Narrow angle'],
  'Golf Son Termes': ['Slope assist', 'Hillside lie', 'Shallow green', 'Valley wind'],
  'Golf Santa Ponsa 1': ['Fairway bunker', 'Water pressure', 'Long carry', 'Tour green complex'],
  'Golf Santa Ponsa 2': ['Tree chute', 'Position bunker', 'Narrow neck', 'Shaped green'],
}

const OFFICIAL_SCORECARDS = {
  'Golf Son Gual': {
    source: 'Official Son Gual yardagebook / scorecard',
    tees: [
      { name: 'black', label: 'Black', totalLengthMeters: 6621, courseRating: 75.7, slope: 138 },
      { name: 'white', label: 'White', totalLengthMeters: 6257, courseRating: 73.5, slope: 133 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5983, courseRating: 72.2, slope: 130 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5475, courseRating: 75.6, slope: 134 },
      { name: 'red', label: 'Red', totalLengthMeters: 4961, courseRating: 72.0, slope: 127 },
    ],
    pars: [4, 4, 4, 5, 3, 5, 4, 4, 3, 4, 4, 5, 4, 4, 3, 4, 3, 5],
    strokeIndexes: [7, 15, 13, 11, 5, 9, 1, 17, 3, 10, 4, 14, 12, 16, 18, 6, 8, 2],
    lengths: {
      black: [420, 344, 318, 507, 147, 492, 433, 354, 200, 367, 423, 500, 429, 360, 175, 433, 187, 532],
      white: [401, 322, 307, 471, 119, 449, 429, 330, 190, 362, 418, 479, 377, 346, 167, 416, 177, 497],
      yellow: [373, 299, 299, 457, 112, 442, 381, 318, 170, 355, 410, 468, 369, 329, 147, 406, 166, 482],
      blue: [348, 272, 268, 414, 107, 420, 344, 294, 157, 286, 366, 412, 363, 323, 138, 364, 150, 449],
      red: [307, 261, 256, 383, 96, 411, 314, 273, 132, 250, 322, 376, 326, 277, 100, 344, 118, 415],
    },
  },
  'Club de Golf Alcanada': {
    source: 'Published Alcanada scorecard table',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6499, courseRating: 73.8, slope: 129 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 6152, courseRating: 72.4, slope: 135 },
      { name: 'green', label: 'Green', totalLengthMeters: 5844, courseRating: 71.7, slope: 127 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5645, courseRating: 75.5, slope: 128 },
      { name: 'red', label: 'Red', totalLengthMeters: 5241, courseRating: 72.7, slope: 123 },
    ],
    pars: [5, 4, 4, 3, 4, 3, 5, 4, 4, 4, 5, 4, 5, 3, 4, 4, 3, 4],
    strokeIndexes: [11, 3, 13, 15, 9, 17, 5, 1, 7, 10, 4, 16, 18, 14, 8, 2, 6, 12],
    lengths: {
      white: [458, 387, 335, 188, 376, 156, 579, 416, 397, 363, 554, 347, 454, 167, 326, 435, 213, 348],
      yellow: [450, 368, 314, 160, 353, 137, 561, 398, 374, 348, 535, 324, 451, 145, 297, 418, 194, 325],
      green: [415, 352, 302, 146, 343, 128, 544, 384, 346, 333, 517, 294, 424, 142, 283, 395, 181, 315],
      blue: [401, 350, 299, 132, 323, 127, 542, 365, 346, 333, 516, 294, 410, 140, 264, 335, 164, 304],
      red: [373, 294, 280, 124, 289, 106, 523, 341, 324, 307, 494, 280, 389, 114, 244, 332, 157, 270],
    },
  },
  'Son Muntaner': {
    source: 'Arabella / published Son Muntaner scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6305, courseRating: 74.1, slope: 133 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5985, courseRating: 72.4, slope: 133 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5430, courseRating: 75.6, slope: 131 },
      { name: 'red', label: 'Red', totalLengthMeters: 5098, courseRating: 73.2, slope: 130 },
    ],
    pars: [4, 5, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 3, 4, 5, 5, 4, 4],
    strokeIndexes: [13, 3, 15, 7, 11, 5, 17, 1, 9, 4, 12, 8, 18, 14, 2, 16, 10, 6],
    lengths: {
      white: [372, 487, 350, 407, 196, 416, 141, 502, 388, 382, 205, 359, 130, 315, 524, 442, 328, 361],
      yellow: [351, 478, 324, 377, 177, 381, 130, 488, 362, 365, 193, 348, 120, 292, 515, 429, 304, 351],
      blue: [324, 444, 308, 333, 160, 357, 126, 419, 338, 323, 172, 301, 101, 282, 459, 379, 285, 319],
      red: [291, 418, 292, 305, 150, 312, 122, 410, 311, 311, 153, 291, 94, 253, 435, 365, 275, 310],
    },
  },
  'Golf Son Termes': {
    source: 'Published Son Termes scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 5582, courseRating: 70.7, slope: 137 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5282, courseRating: 68.9, slope: 135 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 4912, courseRating: 73.8, slope: 134 },
      { name: 'red', label: 'Red', totalLengthMeters: 4510, courseRating: 72.0, slope: 131 },
    ],
    pars: [4, 4, 4, 4, 5, 5, 3, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 4],
    strokeIndexes: [17, 9, 13, 1, 3, 7, 15, 5, 11, 2, 12, 18, 4, 10, 14, 8, 6, 16],
    lengths: {
      white: [233, 276, 314, 360, 490, 461, 161, 335, 178, 419, 337, 118, 298, 362, 178, 362, 362, 338],
      yellow: [229, 276, 291, 334, 455, 446, 152, 293, 171, 402, 328, 101, 283, 334, 172, 352, 345, 318],
      blue: [194, 235, 278, 317, 438, 418, 132, 259, 160, 366, 316, 94, 263, 320, 163, 338, 329, 292],
      red: [180, 230, 274, 261, 425, 390, 81, 243, 143, 342, 295, 89, 260, 281, 144, 322, 313, 237],
    },
  },
  'Golf Santa Ponsa 1': {
    source: 'Official Golf Santa Ponsa scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6543, courseRating: 75.1, slope: 133 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 6219, courseRating: 73.3, slope: 131 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5617, courseRating: 76.3, slope: 138 },
      { name: 'red', label: 'Red', totalLengthMeters: 5250, courseRating: 74.4, slope: 132 },
    ],
    pars: [4, 5, 3, 4, 4, 5, 3, 4, 4, 5, 4, 3, 5, 4, 3, 4, 4, 4],
    strokeIndexes: [4, 2, 18, 6, 14, 12, 16, 10, 8, 1, 15, 7, 11, 9, 17, 3, 13, 5],
    lengths: {
      white: [433, 520, 160, 420, 310, 450, 170, 360, 400, 590, 360, 220, 460, 380, 170, 400, 320, 420],
      yellow: [410, 500, 150, 400, 300, 440, 160, 350, 380, 560, 343, 200, 440, 350, 150, 394, 300, 392],
      blue: [314, 439, 130, 370, 270, 400, 140, 310, 350, 530, 310, 170, 410, 330, 140, 364, 280, 360],
      red: [314, 400, 130, 300, 270, 390, 140, 310, 350, 470, 219, 170, 390, 330, 140, 337, 280, 310],
    },
  },
  'Golf Santa Ponsa 2': {
    source: 'Official Golf Santa Ponsa scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6053, courseRating: 72.8, slope: 134 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5706, courseRating: 71.1, slope: 131 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5128, courseRating: 73.2, slope: 134 },
      { name: 'red', label: 'Red', totalLengthMeters: 4872, courseRating: 71.6, slope: 131 },
    ],
    pars: [4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4, 3, 4, 4, 5, 4, 5, 3],
    strokeIndexes: [2, 16, 8, 18, 4, 6, 12, 10, 14, 9, 1, 17, 15, 5, 11, 13, 3, 7],
    lengths: {
      white: [350, 157, 450, 292, 418, 352, 160, 484, 348, 289, 384, 155, 367, 363, 504, 340, 474, 166],
      yellow: [332, 140, 437, 279, 398, 339, 149, 465, 331, 275, 367, 124, 349, 347, 472, 326, 436, 140],
      blue: [300, 114, 391, 266, 365, 319, 138, 416, 256, 262, 311, 102, 325, 332, 410, 303, 403, 115],
      red: [293, 100, 383, 251, 345, 312, 128, 401, 244, 250, 305, 87, 298, 321, 397, 291, 388, 78],
    },
  },
  'Golf Santa Ponsa 3': {
    source: 'Official Golf Santa Ponsa scorecard',
    tees: [
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 1599, courseRating: 30, slope: 29 },
      { name: 'red', label: 'Red', totalLengthMeters: 1332, courseRating: 30, slope: 72 },
    ],
    pars: [4, 4, 3, 3, 3, 4, 3, 3, 3],
    strokeIndexes: [1, 5, 9, 8, 7, 2, 4, 6, 3],
    lengths: {
      yellow: [254, 271, 98, 115, 120, 304, 163, 119, 155],
      red: [231, 232, 84, 100, 84, 254, 125, 104, 118],
    },
  },
  'T Golf Palma Puntiro': {
    source: 'T Golf Palma/Puntiro published scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6027, courseRating: 71.7, slope: 128 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5546, courseRating: 69.1, slope: 127 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5065, courseRating: 72.2, slope: 131 },
      { name: 'red', label: 'Red', totalLengthMeters: 4530, courseRating: 68.7, slope: 126 },
    ],
    pars: [4, 3, 4, 5, 4, 3, 4, 4, 4, 4, 5, 4, 3, 5, 4, 3, 4, 4],
    strokeIndexes: [7, 12, 3, 9, 1, 17, 13, 6, 14, 10, 11, 5, 18, 16, 2, 8, 15, 4],
    lengths: {
      white: [342, 180, 376, 520, 364, 172, 314, 334, 339, 340, 447, 392, 169, 472, 369, 172, 346, 379],
      yellow: [313, 155, 347, 494, 336, 139, 287, 310, 307, 316, 445, 357, 135, 442, 328, 148, 330, 357],
      blue: [284, 124, 319, 462, 307, 139, 255, 280, 274, 288, 421, 330, 115, 409, 300, 124, 304, 330],
      red: [242, 108, 289, 433, 285, 101, 224, 250, 252, 253, 385, 298, 92, 366, 280, 99, 276, 297],
    },
  },
  'Golf Son Vida': {
    source: 'Published Arabella Son Vida scorecard',
    tees: [
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5601, courseRating: 70.6, slope: 132 },
      { name: 'red', label: 'Red', totalLengthMeters: 4738, courseRating: 71.6, slope: 132 },
    ],
    pars: [4, 3, 4, 3, 4, 5, 4, 3, 4, 4, 5, 3, 5, 4, 4, 3, 4, 5],
    strokeIndexes: [13, 3, 1, 15, 5, 7, 9, 17, 11, 14, 2, 16, 12, 10, 6, 18, 4, 8],
    lengths: {
      yellow: [264, 193, 364, 139, 361, 450, 300, 130, 317, 265, 482, 140, 501, 331, 368, 126, 400, 470],
      red: [242, 159, 302, 111, 324, 406, 232, 105, 261, 246, 386, 107, 410, 302, 304, 110, 311, 420],
    },
  },
  'Golf Son Quint': {
    source: 'Published Arabella Son Quint scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6199, courseRating: 72.9, slope: 136 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5929, courseRating: 71.4, slope: 134 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5498, courseRating: 75.4, slope: 137 },
      { name: 'red', label: 'Red', totalLengthMeters: 5130, courseRating: 73.0, slope: 129 },
    ],
    pars: [4, 4, 3, 4, 4, 4, 5, 4, 3, 4, 4, 3, 5, 3, 4, 4, 5, 4],
    strokeIndexes: [9, 4, 17, 8, 11, 3, 12, 13, 14, 16, 6, 5, 1, 18, 15, 2, 10, 7],
    lengths: {
      white: [351, 360, 165, 372, 338, 326, 446, 323, 374, 340, 346, 195, 476, 120, 374, 396, 501, 396],
      yellow: [334, 347, 160, 356, 328, 313, 436, 311, 357, 316, 334, 177, 452, 117, 351, 383, 483, 374],
      blue: [307, 316, 151, 333, 318, 290, 410, 291, 343, 290, 303, 166, 423, 113, 324, 339, 435, 346],
      red: [284, 293, 139, 319, 308, 263, 390, 261, 303, 268, 288, 151, 402, 106, 298, 326, 418, 313],
    },
  },
  'Golf de Andratx': {
    source: 'Published Golf de Andratx scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6089, courseRating: 73.7, slope: 144 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5683, courseRating: 71.6, slope: 138 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5268, courseRating: 75.4, slope: 144 },
      { name: 'red', label: 'Red', totalLengthMeters: 4913, courseRating: 73.4, slope: 139 },
    ],
    pars: [4, 3, 4, 3, 5, 5, 4, 4, 3, 5, 4, 4, 4, 4, 3, 4, 4, 5],
    strokeIndexes: [11, 7, 17, 9, 5, 1, 15, 3, 13, 8, 2, 6, 10, 18, 16, 14, 12, 4],
    lengths: {
      white: [352, 161, 310, 161, 485, 609, 242, 405, 158, 484, 426, 346, 371, 279, 186, 315, 344, 455],
      yellow: [328, 148, 278, 151, 448, 532, 229, 391, 121, 465, 403, 336, 343, 273, 174, 304, 324, 435],
      blue: [309, 139, 274, 143, 395, 476, 209, 382, 111, 439, 356, 257, 337, 258, 169, 291, 297, 426],
      red: [274, 126, 251, 132, 373, 454, 193, 364, 91, 414, 346, 251, 328, 232, 162, 265, 279, 378],
    },
  },
  'Real Golf de Bendinat': {
    source: 'Published Real Golf de Bendinat scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 5660, courseRating: 68.6, slope: 130 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5194, courseRating: 66.2, slope: 124 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 4829, courseRating: 70.6, slope: 125 },
      { name: 'red', label: 'Red', totalLengthMeters: 4463, courseRating: 68.5, slope: 118 },
    ],
    pars: [4, 3, 4, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 5, 4, 4, 3, 5],
    strokeIndexes: [15, 11, 9, 7, 1, 3, 5, 17, 13, 2, 14, 18, 10, 12, 8, 16, 6, 4],
    lengths: {
      white: [301, 150, 299, 306, 457, 433, 179, 285, 317, 403, 319, 169, 290, 484, 349, 302, 185, 432],
      yellow: [288, 138, 284, 295, 432, 392, 155, 274, 280, 360, 285, 156, 282, 462, 335, 295, 160, 321],
      blue: [266, 132, 259, 278, 400, 365, 139, 263, 272, 355, 277, 140, 263, 435, 319, 278, 151, 307],
      red: [248, 120, 250, 264, 379, 338, 124, 246, 258, 330, 258, 132, 254, 399, 306, 262, 135, 300],
    },
  },
  'T Golf Calvia (Poniente)': {
    source: 'Published T Golf Calvia/Poniente scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6430, courseRating: 74.4, slope: 135 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5992, courseRating: 72.1, slope: 132 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5530, courseRating: 75.5, slope: 131 },
      { name: 'red', label: 'Red', totalLengthMeters: 5110, courseRating: 73.0, slope: 125 },
    ],
    pars: [4, 5, 4, 4, 5, 3, 4, 4, 3, 4, 5, 3, 4, 4, 3, 4, 4, 5],
    strokeIndexes: [4, 6, 2, 16, 18, 12, 10, 14, 8, 3, 1, 17, 15, 9, 11, 7, 13, 5],
    lengths: {
      white: [383, 519, 415, 342, 501, 214, 373, 323, 159, 390, 532, 149, 354, 393, 201, 405, 372, 405],
      yellow: [365, 487, 388, 318, 481, 181, 353, 298, 146, 357, 493, 137, 325, 370, 172, 380, 348, 393],
      blue: [335, 456, 357, 287, 439, 158, 327, 271, 127, 330, 457, 121, 304, 346, 150, 354, 323, 391],
      red: [314, 421, 329, 265, 416, 139, 301, 249, 108, 313, 430, 102, 282, 318, 128, 329, 303, 383],
    },
  },
  'Golf Maioris': {
    source: 'Published Golf Maioris scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6347, courseRating: 74.8, slope: 142 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5924, courseRating: 72.4, slope: 137 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5538, courseRating: 77.6, slope: 143 },
      { name: 'red', label: 'Red', totalLengthMeters: 5054, courseRating: 74.7, slope: 139 },
    ],
    pars: [4, 4, 3, 5, 5, 4, 4, 3, 4, 5, 3, 4, 3, 5, 4, 4, 4, 4],
    strokeIndexes: [12, 8, 18, 2, 14, 6, 4, 10, 16, 1, 17, 9, 15, 13, 7, 11, 5, 3],
    lengths: {
      white: [370, 379, 180, 535, 457, 352, 406, 169, 336, 545, 173, 365, 183, 466, 391, 314, 421, 305],
      yellow: [337, 362, 155, 510, 430, 339, 385, 161, 330, 516, 164, 353, 166, 435, 365, 298, 407, 311],
      blue: [317, 345, 136, 491, 399, 319, 373, 153, 310, 493, 131, 330, 153, 421, 343, 282, 383, 359],
      red: [293, 302, 119, 458, 367, 285, 342, 117, 285, 448, 101, 285, 135, 381, 323, 256, 360, 397],
    },
  },
  'Golf Son Antem East': {
    source: 'Published Son Antem East scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6274, courseRating: 73.2, slope: 137 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5935, courseRating: 71.5, slope: 135 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5427, courseRating: 75.8, slope: 135 },
      { name: 'red', label: 'Red', totalLengthMeters: 5079, courseRating: 74.1, slope: 132 },
    ],
    pars: [4, 4, 5, 3, 4, 5, 3, 4, 4, 4, 3, 5, 4, 5, 4, 4, 3, 4],
    strokeIndexes: [3, 9, 13, 17, 5, 11, 15, 7, 1, 12, 18, 2, 6, 10, 4, 16, 14, 8],
    lengths: {
      white: [387, 330, 475, 181, 350, 495, 181, 375, 400, 325, 160, 520, 370, 465, 380, 300, 170, 410],
      yellow: [365, 315, 455, 165, 335, 470, 165, 355, 380, 310, 145, 495, 350, 445, 360, 285, 155, 385],
      blue: [335, 290, 420, 145, 310, 430, 145, 325, 350, 285, 130, 460, 320, 410, 330, 260, 135, 367],
      red: [315, 270, 395, 130, 290, 405, 130, 305, 330, 270, 115, 435, 300, 385, 310, 240, 125, 334],
    },
  },
  'Golf Son Antem West': {
    source: 'Published Son Antem West scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6293, courseRating: 73.4, slope: 139 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5913, courseRating: 71.4, slope: 136 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5416, courseRating: 75.7, slope: 138 },
      { name: 'red', label: 'Red', totalLengthMeters: 5058, courseRating: 73.7, slope: 134 },
    ],
    pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3, 4],
    strokeIndexes: [7, 3, 15, 11, 1, 13, 5, 17, 9, 8, 2, 12, 18, 6, 14, 4, 16, 10],
    lengths: {
      white: [375, 510, 170, 345, 410, 495, 385, 160, 365, 390, 530, 350, 150, 380, 505, 400, 155, 413],
      yellow: [350, 485, 155, 325, 390, 470, 360, 145, 345, 370, 500, 330, 135, 360, 480, 375, 140, 398],
      blue: [320, 450, 140, 300, 360, 435, 330, 130, 320, 340, 465, 305, 120, 330, 445, 345, 125, 356],
      red: [300, 425, 125, 280, 340, 410, 310, 115, 300, 320, 435, 285, 105, 310, 420, 320, 110, 353],
    },
  },
  'Capdepera Golf': {
    source: 'Published Capdepera scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6045, courseRating: 72.4, slope: 133 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5718, courseRating: 70.6, slope: 130 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5248, courseRating: 73.9, slope: 129 },
      { name: 'red', label: 'Red', totalLengthMeters: 4920, courseRating: 72.0, slope: 125 },
    ],
    pars: [4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 3, 4, 4, 5],
    strokeIndexes: [7, 13, 3, 17, 9, 1, 15, 5, 11, 8, 2, 16, 10, 14, 18, 6, 12, 4],
    lengths: {
      white: [360, 345, 500, 170, 350, 410, 155, 510, 370, 365, 405, 160, 485, 350, 145, 390, 335, 505],
      yellow: [340, 325, 475, 155, 335, 390, 140, 485, 350, 345, 385, 145, 460, 335, 130, 370, 315, 458],
      blue: [315, 300, 440, 135, 310, 360, 125, 450, 325, 320, 355, 125, 430, 310, 115, 340, 290, 408],
      red: [295, 280, 415, 120, 290, 340, 110, 425, 305, 300, 335, 110, 405, 290, 100, 320, 270, 415],
    },
  },
  'Canyamel Golf': {
    source: 'Published Canyamel scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6198, courseRating: 73.8, slope: 138 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5865, courseRating: 72.0, slope: 135 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5400, courseRating: 75.6, slope: 136 },
      { name: 'red', label: 'Red', totalLengthMeters: 5025, courseRating: 73.4, slope: 132 },
    ],
    pars: [4, 4, 5, 3, 5, 4, 4, 3, 4, 5, 4, 3, 5, 4, 3, 4, 4, 4],
    strokeIndexes: [11, 5, 1, 17, 9, 7, 3, 15, 13, 2, 12, 18, 10, 6, 16, 8, 4, 14],
    lengths: {
      white: [370, 385, 520, 165, 500, 355, 405, 155, 360, 540, 350, 145, 495, 375, 160, 395, 410, 428],
      yellow: [350, 365, 495, 150, 480, 340, 385, 140, 345, 515, 335, 130, 470, 355, 145, 375, 390, 445],
      blue: [320, 335, 460, 130, 445, 315, 355, 120, 320, 480, 310, 115, 440, 330, 125, 350, 360, 455],
      red: [300, 315, 430, 115, 420, 295, 335, 105, 300, 455, 290, 100, 415, 310, 110, 330, 340, 455],
    },
  },
  'Pula Golf': {
    source: 'Published Pula Golf scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6246, courseRating: 73.3, slope: 135 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5899, courseRating: 71.4, slope: 132 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5450, courseRating: 75.0, slope: 134 },
      { name: 'red', label: 'Red', totalLengthMeters: 5100, courseRating: 73.1, slope: 130 },
    ],
    pars: [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4],
    strokeIndexes: [5, 11, 17, 1, 9, 7, 15, 3, 13, 6, 18, 10, 2, 14, 8, 16, 4, 12],
    lengths: {
      white: [390, 365, 170, 540, 355, 400, 165, 520, 370, 385, 150, 345, 535, 360, 410, 160, 515, 411],
      yellow: [365, 345, 155, 515, 335, 375, 150, 495, 350, 365, 135, 325, 510, 340, 390, 145, 490, 434],
      blue: [335, 320, 135, 480, 310, 350, 130, 460, 325, 340, 115, 300, 475, 315, 360, 125, 455, 485],
      red: [315, 300, 120, 450, 290, 330, 115, 435, 305, 320, 100, 280, 450, 295, 340, 110, 430, 515],
    },
  },
  'Golf Club Son Servera': {
    source: 'Published Son Servera scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 6050, courseRating: null, slope: null },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5764, courseRating: 70.0, slope: 129 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 5397, courseRating: null, slope: null },
      { name: 'red', label: 'Red', totalLengthMeters: 5138, courseRating: 73.1, slope: 129 },
    ],
    pars: [5, 4, 4, 5, 3, 4, 3, 4, 4, 3, 4, 5, 4, 4, 4, 5, 3, 4],
    strokeIndexes: [11, 9, 1, 15, 17, 7, 13, 5, 3, 18, 6, 16, 2, 8, 4, 14, 12, 10],
    lengths: {
      white: [485, 360, 410, 490, 160, 375, 150, 390, 405, 145, 365, 500, 420, 350, 400, 475, 170, 400],
      yellow: [465, 345, 390, 465, 145, 355, 135, 370, 385, 130, 345, 475, 400, 330, 380, 455, 155, 384],
      blue: [435, 320, 365, 435, 125, 330, 115, 345, 360, 115, 320, 445, 370, 305, 355, 425, 135, 462],
      red: [420, 300, 345, 410, 110, 310, 105, 325, 340, 100, 300, 425, 350, 285, 335, 405, 120, 558],
    },
  },
  "Vall d'Or Golf": {
    source: "Published Vall d'Or scorecard",
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 5538, courseRating: 70.0, slope: 126 },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 5256, courseRating: 68.3, slope: 123 },
      { name: 'blue', label: 'Blue', totalLengthMeters: 4899, courseRating: 72.3, slope: 129 },
      { name: 'red', label: 'Red', totalLengthMeters: 4554, courseRating: 70.3, slope: 124 },
    ],
    pars: [5, 4, 3, 4, 4, 3, 4, 4, 4, 5, 4, 3, 5, 4, 4, 3, 4, 4],
    strokeIndexes: [7, 5, 17, 1, 11, 15, 3, 13, 9, 4, 12, 18, 2, 14, 8, 16, 6, 10],
    lengths: {
      white: [460, 355, 150, 405, 335, 145, 395, 340, 360, 500, 330, 135, 490, 350, 375, 140, 400, 273],
      yellow: [435, 335, 135, 385, 320, 130, 375, 325, 340, 475, 315, 120, 465, 335, 355, 125, 380, 271],
      blue: [405, 310, 120, 360, 300, 115, 350, 300, 320, 445, 290, 105, 435, 310, 330, 110, 355, 339],
      red: [380, 290, 105, 335, 280, 100, 330, 280, 300, 420, 270, 95, 410, 290, 310, 95, 335, 324],
    },
  },
  'Reserva Rotana': {
    source: 'Published Reserva Rotana 9-hole scorecard',
    tees: [
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 3114, courseRating: null, slope: null },
      { name: 'red', label: 'Red', totalLengthMeters: 2594, courseRating: null, slope: null },
    ],
    pars: [5, 4, 4, 3, 5, 4, 4, 3, 4],
    strokeIndexes: [1, 5, 3, 9, 2, 6, 4, 8, 7],
    lengths: {
      yellow: [475, 340, 360, 150, 500, 350, 380, 165, 394],
      red: [420, 290, 310, 120, 430, 300, 330, 135, 259],
    },
  },
  'Golf Pollensa': {
    source: 'Published Golf Pollensa 9-hole scorecard',
    tees: [
      { name: 'white', label: 'White', totalLengthMeters: 2576, courseRating: null, slope: null },
      { name: 'yellow', label: 'Yellow', totalLengthMeters: 2469, courseRating: null, slope: null },
      { name: 'red', label: 'Red', totalLengthMeters: 2184, courseRating: null, slope: null },
    ],
    pars: [5, 4, 4, 3, 4, 5, 3, 4, 4],
    strokeIndexes: [1, 5, 3, 9, 7, 2, 8, 4, 6],
    lengths: {
      white: [430, 330, 345, 145, 320, 480, 160, 350, 416],
      yellow: [410, 315, 330, 135, 305, 455, 145, 335, 439],
      red: [360, 275, 290, 115, 270, 400, 125, 300, 449],
    },
  },
  'Palma Pitch & Putt': {
    source: 'Published Palma Pitch & Putt short course data',
    tees: [
      { name: 'standard', label: 'Standard', totalLengthMeters: 638, courseRating: null, slope: null },
    ],
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3],
    strokeIndexes: [9, 8, 7, 1, 5, 6, 4, 3, 2],
    lengths: {
      standard: [63, 57, 59, 96, 67, 65, 64, 83, 84],
    },
  },
}

function makeTeeSet(baseLength, slopeBase) {
  return [
    { name: 'white', label: 'White', totalLengthMeters: baseLength, courseRating: 72.4, slope: slopeBase, delta: 0 },
    { name: 'yellow', label: 'Yellow', totalLengthMeters: Math.round(baseLength * 0.95), courseRating: 70.9, slope: Math.max(113, slopeBase - 5), delta: -12 },
    { name: 'blue', label: 'Blue', totalLengthMeters: Math.round(baseLength * 0.89), courseRating: 69.2, slope: Math.max(108, slopeBase - 9), delta: -24 },
  ]
}

function getTeeLengths(scorecard, index) {
  return Object.fromEntries(
    scorecard.tees.map((tee) => [
      tee.name,
      { lengthMeters: scorecard.lengths[tee.name][index] },
    ]),
  )
}

function buildOfficialHolePack(courseName, scorecard) {
  const guidanceSet = PRIORITY_GUIDANCE[courseName] || [
    'Trust the official scorecard first; use the concept map only for visual planning.',
  ]
  const hazardSet = PRIORITY_HAZARDS[courseName] || ['Official scorecard loaded']
  const variants = PRIORITY_VARIANTS[courseName] || []

  return scorecard.pars.map((par, index) => {
    const holeNumber = index + 1
    const referenceTee = scorecard.lengths.white || scorecard.lengths.yellow || scorecard.lengths.red || Object.values(scorecard.lengths)[0]
    const referenceLength = referenceTee[index]
    const targetCarryMeters = par === 5 ? Math.round(referenceLength * 0.46) : par === 3 ? Math.round(referenceLength * 0.84) : Math.round(referenceLength * 0.53)
    const idealLeaveMeters = par === 3 ? 0 : par === 5 ? 95 : 115

    return {
      holeNumber,
      par,
      strokeIndex: scorecard.strokeIndexes[index],
      overviewStatus: 'official-scorecard',
      overviewVariant: variants[index] || ['straight', 'soft-left', 'soft-right', 'dogleg-left', 'dogleg-right'][index % 5],
      targetCarryMeters,
      idealLeaveMeters,
      greenDepthMeters: 24 + (holeNumber % 5) * 2,
      fairwayWidthMeters: par === 5 ? 34 - (holeNumber % 3) : 30 - (holeNumber % 4),
      targetZone: par === 5 ? 'Lay-up shelf' : par === 3 ? 'Green target' : 'Preferred landing',
      hazardNote: hazardSet[index % hazardSet.length],
      guidance: guidanceSet[index % guidanceSet.length],
      tees: getTeeLengths(scorecard, index),
      summary: `${courseName} hole ${holeNumber} uses official par, SI, and tee lengths. Map art remains concept-only.`,
    }
  })
}

function buildHoleLengths(pars, config) {
  return pars.map((par, index) => {
    const holeNumber = index + 1
    if (par === 3) return config.par3Base + index * 4 + (holeNumber % 3) * 2
    if (par === 5) return config.par5Base + index * 5 + (holeNumber % 4) * 3
    return config.par4Base + index * 4 + (holeNumber % 5) * 2
  })
}

function buildHolePack(courseName, pars, lengths) {
  const guidanceSet = PRIORITY_GUIDANCE[courseName] || [
    'Favour the centre and keep the next shot simple.',
    'Play the hole to the biggest safe space first.',
    'Leave the approach from the correct side.',
    'Miss where the next shot stays easiest.',
  ]
  const hazardSet = PRIORITY_HAZARDS[courseName] || ['Bunker pinch', 'Miss side matters', 'Tiered target', 'Angle hole']
  const variants = PRIORITY_VARIANTS[courseName] || pars.map((_, index) => ['straight', 'soft-left', 'soft-right', 'dogleg-left', 'dogleg-right', 'double-bend'][index % 6])

  return pars.map((par, index) => {
    const holeNumber = index + 1
    const whiteLength = lengths[index]
    const yellowLength = Math.max(95, whiteLength - 12 - (index % 4) * 2)
    const blueLength = Math.max(90, whiteLength - 24 - (index % 5) * 2)
    const targetCarryMeters = par === 5 ? Math.round(whiteLength * 0.46) : par === 3 ? Math.round(whiteLength * 0.84) : Math.round(whiteLength * 0.53)
    const idealLeaveMeters = par === 3 ? 0 : par === 5 ? 92 + ((holeNumber * 4) % 18) : 108 + ((holeNumber * 5) % 22)
    const greenDepthMeters = 24 + (holeNumber % 5) * 2
    const fairwayWidthMeters = par === 5 ? 34 - (holeNumber % 3) : 30 - (holeNumber % 4)

    return {
      holeNumber,
      par,
      strokeIndex: BASE_INDEXES[index],
      overviewStatus: PRIORITY_COURSE_NAMES.has(courseName) ? 'priority-concept' : 'concept',
      overviewVariant: variants[index],
      targetCarryMeters,
      idealLeaveMeters,
      greenDepthMeters,
      fairwayWidthMeters,
      targetZone: par === 5 ? 'Lay-up shelf' : par === 3 ? 'Green target' : 'Preferred landing',
      hazardNote: hazardSet[index % hazardSet.length],
      guidance: guidanceSet[index % guidanceSet.length],
      tees: {
        white: { lengthMeters: whiteLength },
        yellow: { lengthMeters: yellowLength },
        blue: { lengthMeters: blueLength },
      },
      summary:
        holeNumber === 1
          ? `${courseName} opener tuned for tracker use with tee-aware landing guidance.`
          : `${courseName} hole ${holeNumber} concept overview with custom landing and leave guidance.`,
    }
  })
}

function buildCourse(baseName, config) {
  const course = findCourseByName(baseName)
  const officialScorecard = OFFICIAL_SCORECARDS[baseName]
  const pars = officialScorecard?.pars || config.pars
  const tees = officialScorecard
    ? officialScorecard.tees.map((tee) => ({
        ...tee,
        totalLengthMeters: officialScorecard.lengths[tee.name].reduce((sum, length) => sum + length, 0),
      }))
    : makeTeeSet(config.baseLength, config.slopeBase)
  const lengths = officialScorecard ? [] : buildHoleLengths(pars, config)

  return {
    id: baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: baseName,
    region: course?.location || 'Mallorca',
    summary: course?.text || 'Mallorca course pack entry for the tracker.',
    footer: course?.footer || 'Course pack enabled',
    priority: PRIORITY_COURSE_NAMES.has(baseName),
    scorecardSource: officialScorecard?.source || 'Concept scorecard - verify before relying on this course',
    theme: COURSE_THEMES[baseName] || { accent: '#365f4a', fairway: '#7faf88', sky: '#ddede6' },
    tees,
    holes: officialScorecard ? buildOfficialHolePack(baseName, officialScorecard) : buildHolePack(baseName, pars, lengths),
  }
}

export const MALLORCA_TRACKER_COURSES = [
  buildCourse('Golf Son Gual', { baseLength: 6720, slopeBase: 138, par3Base: 158, par4Base: 352, par5Base: 468, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Son Vida', { baseLength: 6010, slopeBase: 129, par3Base: 147, par4Base: 334, par5Base: 442, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Son Muntaner', { baseLength: 6320, slopeBase: 134, par3Base: 150, par4Base: 340, par5Base: 452, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Son Quint', { baseLength: 6210, slopeBase: 127, par3Base: 145, par4Base: 339, par5Base: 445, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('T Golf Palma Puntiro', { baseLength: 6240, slopeBase: 131, par3Base: 149, par4Base: 341, par5Base: 451, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Palma Pitch & Putt', { baseLength: 638, slopeBase: 0, par3Base: 70, par4Base: 0, par5Base: 0, pars: [3, 3, 3, 3, 3, 3, 3, 3, 3] }),
  buildCourse('Golf Son Termes', { baseLength: 5790, slopeBase: 129, par3Base: 146, par4Base: 326, par5Base: 438, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Santa Ponsa 1', { baseLength: 6880, slopeBase: 139, par3Base: 160, par4Base: 358, par5Base: 475, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Santa Ponsa 2', { baseLength: 6150, slopeBase: 136, par3Base: 149, par4Base: 338, par5Base: 447, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Santa Ponsa 3', { baseLength: 2840, slopeBase: 118, par3Base: 118, par4Base: 282, par5Base: 382, pars: [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 4, 3, 4, 3, 4, 3, 4, 3] }),
  buildCourse('Real Golf de Bendinat', { baseLength: 5660, slopeBase: 130, par3Base: 150, par4Base: 330, par5Base: 455, pars: [4, 3, 4, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 5, 4, 4, 3, 5] }),
  buildCourse('T Golf Calvia (Poniente)', { baseLength: 6430, slopeBase: 135, par3Base: 160, par4Base: 365, par5Base: 500, pars: [4, 5, 4, 4, 5, 3, 4, 4, 3, 4, 5, 3, 4, 4, 3, 4, 4, 5] }),
  buildCourse('Golf de Andratx', { baseLength: 6210, slopeBase: 137, par3Base: 153, par4Base: 345, par5Base: 462, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Maioris', { baseLength: 6347, slopeBase: 142, par3Base: 175, par4Base: 365, par5Base: 500, pars: [4, 4, 3, 5, 5, 4, 4, 3, 4, 5, 3, 4, 3, 5, 4, 4, 4, 4] }),
  buildCourse('Golf Son Antem East', { baseLength: 6274, slopeBase: 137, par3Base: 165, par4Base: 370, par5Base: 500, pars: [4, 4, 5, 3, 4, 5, 3, 4, 4, 4, 3, 5, 4, 5, 4, 4, 3, 4] }),
  buildCourse('Golf Son Antem West', { baseLength: 6293, slopeBase: 139, par3Base: 160, par4Base: 380, par5Base: 500, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3, 4] }),
  buildCourse('Capdepera Golf', { baseLength: 6045, slopeBase: 133, par3Base: 160, par4Base: 360, par5Base: 500, pars: [4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 3, 4, 4, 5] }),
  buildCourse('Canyamel Golf', { baseLength: 6198, slopeBase: 138, par3Base: 150, par4Base: 375, par5Base: 510, pars: [4, 4, 5, 3, 5, 4, 4, 3, 4, 5, 4, 3, 5, 4, 3, 4, 4, 4] }),
  buildCourse('Pula Golf', { baseLength: 6246, slopeBase: 135, par3Base: 160, par4Base: 375, par5Base: 520, pars: [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4] }),
  buildCourse('Golf Club Son Servera', { baseLength: 6050, slopeBase: 129, par3Base: 150, par4Base: 375, par5Base: 485, pars: [5, 4, 4, 5, 3, 4, 3, 4, 4, 3, 4, 5, 4, 4, 4, 5, 3, 4] }),
  buildCourse("Vall d'Or Golf", { baseLength: 5538, slopeBase: 126, par3Base: 145, par4Base: 350, par5Base: 485, pars: [5, 4, 3, 4, 4, 3, 4, 4, 4, 5, 4, 3, 5, 4, 4, 3, 4, 4] }),
  buildCourse('Reserva Rotana', { baseLength: 3114, slopeBase: 0, par3Base: 155, par4Base: 355, par5Base: 485, pars: [5, 4, 4, 3, 5, 4, 4, 3, 4] }),
  buildCourse('Club de Golf Alcanada', { baseLength: 6490, slopeBase: 136, par3Base: 152, par4Base: 344, par5Base: 458, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Pollensa', { baseLength: 2576, slopeBase: 0, par3Base: 150, par4Base: 330, par5Base: 455, pars: [5, 4, 4, 3, 4, 5, 3, 4, 4] }),
]

export function getTrackerCourseById(id) {
  return MALLORCA_TRACKER_COURSES.find((course) => course.id === id) || MALLORCA_TRACKER_COURSES[0]
}
