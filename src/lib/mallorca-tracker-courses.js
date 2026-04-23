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
    const referenceTee = scorecard.lengths.white || scorecard.lengths.yellow || scorecard.lengths.red
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
  const tees = officialScorecard?.tees || makeTeeSet(config.baseLength, config.slopeBase)
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
  buildCourse('Club de Golf Alcanada', { baseLength: 6490, slopeBase: 136, par3Base: 152, par4Base: 344, par5Base: 458, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Son Muntaner', { baseLength: 6320, slopeBase: 134, par3Base: 150, par4Base: 340, par5Base: 452, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Son Termes', { baseLength: 5790, slopeBase: 129, par3Base: 146, par4Base: 326, par5Base: 438, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Santa Ponsa 1', { baseLength: 6880, slopeBase: 139, par3Base: 160, par4Base: 358, par5Base: 475, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Santa Ponsa 2', { baseLength: 6150, slopeBase: 136, par3Base: 149, par4Base: 338, par5Base: 447, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Santa Ponsa 3', { baseLength: 2840, slopeBase: 118, par3Base: 118, par4Base: 282, par5Base: 382, pars: [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 4, 3, 4, 3, 4, 3, 4, 3] }),
  buildCourse('T Golf Palma Puntiro', { baseLength: 6240, slopeBase: 131, par3Base: 149, par4Base: 341, par5Base: 451, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Son Vida', { baseLength: 6010, slopeBase: 129, par3Base: 147, par4Base: 334, par5Base: 442, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf Son Quint', { baseLength: 6210, slopeBase: 127, par3Base: 145, par4Base: 339, par5Base: 445, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
  buildCourse('Golf de Andratx', { baseLength: 6210, slopeBase: 137, par3Base: 153, par4Base: 345, par5Base: 462, pars: [4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4] }),
]

export function getTrackerCourseById(id) {
  return MALLORCA_TRACKER_COURSES.find((course) => course.id === id) || MALLORCA_TRACKER_COURSES[0]
}
