function makeTreeLine(side, count, startY, step, baseX) {
  return Array.from({ length: count }, (_, index) => ({
    x: baseX + (side === 'left' ? (index % 2) : -(index % 2)) * 1.5,
    y: startY + index * step,
    size: 3 + (index % 3) * 0.4,
  }))
}

function makeHoleArt({
  fairwayPath,
  linePath,
  layup,
  target,
  bunkers = [],
  waterPath = null,
  leftTrees = makeTreeLine('left', 7, 28, 18, 18),
  rightTrees = makeTreeLine('right', 7, 24, 20, 82),
}) {
  return {
    fairwayPath,
    linePath,
    layup,
    target,
    bunkers,
    waterPath,
    trees: [...leftTrees, ...rightTrees],
  }
}

const DEFAULT_ART = {
  straight: makeHoleArt({
    fairwayPath:
      'M48 168 C 34 148, 32 126, 40 98 C 44 82, 41 62, 49 41 C 55 24, 62 14, 50 10 C 38 14, 45 26, 51 42 C 58 63, 56 84, 60 99 C 68 126, 66 148, 52 168 Z',
    linePath: 'M50 163 L50 48',
    layup: { x: 50, y: 96 },
    target: { x: 50, y: 46 },
    bunkers: [
      { x: 62, y: 38, rx: 4.8, ry: 2.4, rotate: -18 },
      { x: 37, y: 112, rx: 5.6, ry: 2.6, rotate: 22 },
    ],
  }),
  'soft-left': makeHoleArt({
    fairwayPath:
      'M54 168 C 42 150, 34 130, 37 107 C 39 89, 46 73, 49 53 C 52 34, 45 18, 50 10 C 59 15, 61 34, 59 53 C 56 73, 49 90, 48 107 C 46 126, 52 147, 60 168 Z',
    linePath: 'M56 163 C48 144, 44 123, 45 99 C46 76, 51 57, 55 44',
    layup: { x: 46, y: 98 },
    target: { x: 55, y: 44 },
    bunkers: [
      { x: 68, y: 54, rx: 5, ry: 2.2, rotate: -20 },
      { x: 33, y: 118, rx: 5.4, ry: 2.4, rotate: 18 },
    ],
  }),
  'soft-right': makeHoleArt({
    fairwayPath:
      'M46 168 C 58 150, 66 130, 63 107 C 61 89, 54 73, 51 53 C 48 34, 55 18, 50 10 C 41 15, 39 34, 41 53 C 44 73, 51 90, 52 107 C 54 126, 48 147, 40 168 Z',
    linePath: 'M44 163 C52 144, 56 123, 55 99 C54 76, 49 57, 45 44',
    layup: { x: 54, y: 98 },
    target: { x: 45, y: 44 },
    bunkers: [
      { x: 33, y: 52, rx: 5, ry: 2.2, rotate: 18 },
      { x: 66, y: 120, rx: 5.2, ry: 2.4, rotate: -18 },
    ],
  }),
  'dogleg-left': makeHoleArt({
    fairwayPath:
      'M56 168 C 47 150, 39 132, 42 112 C 44 98, 54 88, 62 77 C 69 66, 68 49, 59 33 C 54 23, 46 15, 50 10 C 62 14, 71 24, 75 36 C 80 52, 78 69, 70 82 C 62 95, 50 104, 49 115 C 47 133, 52 150, 60 168 Z',
    linePath: 'M55 163 C49 147, 45 129, 46 114 C47 99, 58 90, 66 80 C71 72, 72 58, 68 43',
    layup: { x: 48, y: 110 },
    target: { x: 68, y: 43 },
    bunkers: [
      { x: 73, y: 73, rx: 5, ry: 2.2, rotate: -18 },
      { x: 34, y: 118, rx: 5.4, ry: 2.5, rotate: 20 },
      { x: 60, y: 32, rx: 4.2, ry: 2.1, rotate: -8 },
    ],
  }),
  'dogleg-right': makeHoleArt({
    fairwayPath:
      'M44 168 C 53 150, 61 132, 58 112 C 56 98, 46 88, 38 77 C 31 66, 32 49, 41 33 C 46 23, 54 15, 50 10 C 38 14, 29 24, 25 36 C 20 52, 22 69, 30 82 C 38 95, 50 104, 51 115 C 53 133, 48 150, 40 168 Z',
    linePath: 'M45 163 C51 147, 55 129, 54 114 C53 99, 42 90, 34 80 C29 72, 28 58, 32 43',
    layup: { x: 52, y: 110 },
    target: { x: 32, y: 43 },
    bunkers: [
      { x: 27, y: 73, rx: 5, ry: 2.2, rotate: 18 },
      { x: 66, y: 118, rx: 5.4, ry: 2.5, rotate: -20 },
      { x: 40, y: 32, rx: 4.2, ry: 2.1, rotate: 8 },
    ],
  }),
  'double-bend': makeHoleArt({
    fairwayPath:
      'M50 168 C 38 151, 35 132, 41 114 C 47 98, 60 92, 62 74 C 63 58, 50 50, 44 36 C 40 25, 44 14, 50 10 C 57 15, 61 24, 58 36 C 55 49, 45 58, 46 74 C 48 92, 61 98, 59 114 C 57 132, 62 151, 50 168 Z',
    linePath: 'M50 163 C42 148, 41 131, 46 115 C52 99, 58 91, 55 75 C53 61, 44 53, 46 39',
    layup: { x: 47, y: 108 },
    target: { x: 46, y: 39 },
    bunkers: [
      { x: 61, y: 62, rx: 4.8, ry: 2.2, rotate: -10 },
      { x: 36, y: 102, rx: 5.1, ry: 2.4, rotate: 20 },
      { x: 58, y: 136, rx: 4.8, ry: 2.1, rotate: -12 },
    ],
  }),
}

function withOverrides(baseKey, overrides) {
  return {
    ...DEFAULT_ART[baseKey],
    ...overrides,
    bunkers: overrides.bunkers || DEFAULT_ART[baseKey].bunkers,
    trees: overrides.trees || DEFAULT_ART[baseKey].trees,
  }
}

export const PRIORITY_COURSE_ART = {
  'Golf Son Gual': [
    withOverrides('straight', { waterPath: 'M22 126 C16 118, 16 104, 24 98 C33 92, 42 96, 43 106 C44 116, 35 126, 22 126 Z' }),
    withOverrides('dogleg-right', { bunkers: [...DEFAULT_ART['dogleg-right'].bunkers, { x: 25, y: 135, rx: 4.6, ry: 2.1, rotate: 24 }] }),
    withOverrides('straight', { bunkers: [{ x: 48, y: 28, rx: 6.2, ry: 2.5, rotate: 0 }] }),
    withOverrides('soft-left', { waterPath: 'M71 116 C80 110, 81 96, 73 90 C65 84, 54 88, 52 99 C50 109, 59 120, 71 116 Z' }),
    withOverrides('dogleg-left', { bunkers: [...DEFAULT_ART['dogleg-left'].bunkers, { x: 76, y: 118, rx: 4.2, ry: 2.0, rotate: -14 }] }),
    withOverrides('double-bend', {}),
    withOverrides('soft-right', {}),
    withOverrides('straight', { waterPath: 'M61 62 C68 58, 76 61, 78 68 C80 76, 72 84, 61 82 C53 80, 51 68, 61 62 Z' }),
    withOverrides('dogleg-left', {}),
    withOverrides('straight', {}),
    withOverrides('dogleg-right', {}),
    withOverrides('soft-left', { bunkers: [...DEFAULT_ART['soft-left'].bunkers, { x: 58, y: 24, rx: 4.4, ry: 2.0, rotate: -6 }] }),
    withOverrides('straight', {}),
    withOverrides('soft-right', {}),
    withOverrides('double-bend', { waterPath: 'M28 70 C18 64, 18 50, 29 44 C40 38, 49 46, 48 58 C47 67, 38 74, 28 70 Z' }),
    withOverrides('straight', {}),
    withOverrides('dogleg-left', {}),
    withOverrides('soft-right', {}),
  ],
  'Club de Golf Alcanada': [
    withOverrides('soft-right', { waterPath: 'M82 144 C90 138, 91 126, 86 118 C80 110, 70 110, 66 118 C61 127, 67 142, 82 144 Z' }),
    withOverrides('dogleg-left', {}),
    withOverrides('straight', {}),
    withOverrides('soft-left', { trees: [...makeTreeLine('left', 8, 22, 18, 17), ...makeTreeLine('right', 5, 38, 23, 82)] }),
    withOverrides('dogleg-right', {}),
    withOverrides('double-bend', { waterPath: 'M21 108 C14 102, 14 90, 22 84 C29 79, 40 83, 41 93 C42 103, 33 111, 21 108 Z' }),
    withOverrides('straight', {}),
    withOverrides('soft-right', {}),
    withOverrides('dogleg-left', {}),
    withOverrides('straight', { bunkers: [...DEFAULT_ART.straight.bunkers, { x: 69, y: 130, rx: 4.8, ry: 2.1, rotate: -20 }] }),
    withOverrides('soft-left', {}),
    withOverrides('straight', {}),
    withOverrides('dogleg-right', {}),
    withOverrides('soft-left', {}),
    withOverrides('double-bend', {}),
    withOverrides('straight', { waterPath: 'M63 58 C70 52, 78 54, 80 62 C82 71, 74 78, 64 77 C55 75, 54 64, 63 58 Z' }),
    withOverrides('soft-right', {}),
    withOverrides('dogleg-left', {}),
  ],
  'Son Muntaner': Array.from({ length: 18 }, (_, index) =>
    withOverrides(['straight', 'soft-left', 'straight', 'dogleg-right', 'soft-right', 'double-bend', 'straight', 'soft-left', 'dogleg-left', 'straight', 'dogleg-right', 'soft-right', 'straight', 'soft-left', 'double-bend', 'straight', 'dogleg-right', 'soft-left'][index], {
      trees: [
        ...makeTreeLine('left', 9, 24, 16, 19),
        ...makeTreeLine('right', 9, 24, 16, 81),
      ],
    }),
  ),
  'Golf Son Termes': Array.from({ length: 18 }, (_, index) =>
    withOverrides(['soft-left', 'dogleg-right', 'straight', 'dogleg-left', 'soft-right', 'double-bend', 'straight', 'soft-left', 'straight', 'dogleg-right', 'soft-right', 'straight', 'dogleg-left', 'soft-left', 'double-bend', 'straight', 'soft-right', 'dogleg-left'][index], {
      trees: [
        ...makeTreeLine('left', 8, 20, 18, 15),
        ...makeTreeLine('right', 8, 20, 18, 85),
      ],
    }),
  ),
  'Golf Santa Ponsa 1': [
    withOverrides('straight', {}),
    withOverrides('dogleg-right', { waterPath: 'M17 130 C12 124, 12 112, 18 106 C25 100, 35 101, 39 110 C42 118, 34 130, 17 130 Z' }),
    withOverrides('straight', {}),
    withOverrides('dogleg-left', {}),
    withOverrides('soft-right', {}),
    withOverrides('double-bend', { waterPath: 'M77 112 C86 106, 87 93, 80 86 C73 80, 62 82, 58 91 C54 101, 62 113, 77 112 Z' }),
    withOverrides('straight', {}),
    withOverrides('soft-left', {}),
    withOverrides('dogleg-right', {}),
    withOverrides('straight', {}),
    withOverrides('dogleg-left', {}),
    withOverrides('straight', {}),
    withOverrides('soft-right', {}),
    withOverrides('soft-left', {}),
    withOverrides('double-bend', {}),
    withOverrides('straight', {}),
    withOverrides('dogleg-right', {}),
    withOverrides('soft-left', {}),
  ],
  'Golf Santa Ponsa 2': Array.from({ length: 18 }, (_, index) =>
    withOverrides(['soft-right', 'straight', 'dogleg-left', 'soft-left', 'dogleg-right', 'double-bend', 'straight', 'soft-right', 'straight', 'dogleg-left', 'soft-left', 'straight', 'dogleg-right', 'soft-right', 'double-bend', 'straight', 'dogleg-left', 'soft-left'][index], {
      trees: [
        ...makeTreeLine('left', 9, 24, 16, 17),
        ...makeTreeLine('right', 9, 24, 16, 83),
      ],
      bunkers: [
        ...DEFAULT_ART[['soft-right', 'straight', 'dogleg-left', 'soft-left', 'dogleg-right', 'double-bend'][index % 6]].bunkers,
        { x: 52 + ((index % 3) - 1) * 8, y: 128 - (index % 4) * 8, rx: 4.4, ry: 2.0, rotate: (index % 2 ? 18 : -18) },
      ],
    }),
  ),
}

export function getCourseArt(courseName, holeIndex, variant) {
  const coursePack = PRIORITY_COURSE_ART[courseName]
  if (coursePack?.[holeIndex]) return coursePack[holeIndex]
  return DEFAULT_ART[variant] || DEFAULT_ART.straight
}
