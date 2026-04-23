import { MALLORCA_TRACKER_COURSES } from '../src/lib/mallorca-tracker-courses.js'

const failures = []

for (const course of MALLORCA_TRACKER_COURSES) {
  if (!course.holes.length) {
    failures.push(`${course.name}: no holes`)
    continue
  }

  for (const tee of course.tees) {
    const total = course.holes.reduce((sum, hole) => {
      const length = hole.tees[tee.name]?.lengthMeters

      if (!Number.isFinite(length)) {
        failures.push(`${course.name}: hole ${hole.holeNumber} missing ${tee.name} length`)
        return sum
      }

      return sum + length
    }, 0)

    if (total !== tee.totalLengthMeters) {
      failures.push(`${course.name}: ${tee.name} total ${total} does not match tee total ${tee.totalLengthMeters}`)
    }
  }

  for (const hole of course.holes) {
    if (!Number.isFinite(hole.par)) failures.push(`${course.name}: hole ${hole.holeNumber} missing par`)
    if (!Number.isFinite(hole.strokeIndex)) failures.push(`${course.name}: hole ${hole.holeNumber} missing stroke index`)
  }
}

const santaPonsaTwo = MALLORCA_TRACKER_COURSES.find((course) => course.name === 'Golf Santa Ponsa 2')
if (santaPonsaTwo?.holes[1]?.par !== 3) {
  failures.push('Golf Santa Ponsa 2: hole 2 must be par 3')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated ${MALLORCA_TRACKER_COURSES.length} course scorecards.`)
