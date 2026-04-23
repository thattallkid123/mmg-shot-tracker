'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './shot-tracker.module.css'
import {
  MALLORCA_TRACKER_COURSES,
  getTrackerCourseById,
} from '../../lib/mallorca-tracker-courses.js'

const STORAGE_KEY = 'mmg-shot-tracker-prototype-v4'
const YARDS_PER_METER = 1.09361
const QUICK_NOTES = ['Good strike', 'Pulled left', 'Blocked right', 'Downwind', 'Into wind', 'From rough']

function toRadians(value) {
  return (value * Math.PI) / 180
}

function haversineDistanceMeters(start, end) {
  const earthRadius = 6371000
  const deltaLat = toRadians(end.latitude - start.latitude)
  const deltaLng = toRadians(end.longitude - start.longitude)
  const startLat = toRadians(start.latitude)
  const endLat = toRadians(end.latitude)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startLat) *
      Math.cos(endLat) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2)

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function formatDistance(distanceMeters, unit) {
  if (!Number.isFinite(distanceMeters)) return '--'
  const value = unit === 'yards' ? distanceMeters * YARDS_PER_METER : distanceMeters
  return `${Math.round(value)} ${unit === 'yards' ? 'yd' : 'm'}`
}

function formatSignedNumber(value) {
  if (!Number.isFinite(value)) return '--'
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}`
}

function formatRating(value) {
  return Number.isFinite(value) ? value.toFixed(1) : '--'
}

function formatPlainNumber(value) {
  return Number.isFinite(value) ? value : '--'
}

function getGeolocationPosition() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not available on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    })
  })
}

function normalisePosition(position) {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    capturedAt: Date.now(),
  }
}

function computeHandicapDifferential(score, courseRating, slopeRating) {
  if (!Number.isFinite(score) || !Number.isFinite(courseRating) || !Number.isFinite(slopeRating) || slopeRating <= 0) {
    return null
  }

  return (score - courseRating) * (113 / slopeRating)
}

function computeHandicapIndex(rounds) {
  const differentials = rounds
    .map((round) => round.differential)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b)
    .slice(0, 8)

  if (differentials.length === 0) return null

  return differentials.reduce((sum, value) => sum + value, 0) / differentials.length
}

function buildEmptyScorecard(course, teeName) {
  return course.holes.map((hole) => ({
    holeNumber: hole.holeNumber,
    par: hole.par,
    teeLengthMeters: getHoleLength(hole, teeName),
    score: '',
    putts: '',
    penalties: '',
    fairwayHit: false,
    gir: false,
  }))
}

function getHoleLength(hole, teeName) {
  return hole.tees[teeName]?.lengthMeters || Object.values(hole.tees)[0]?.lengthMeters || 0
}

function expectedStrokesFromTee(lengthMeters, par) {
  if (par === 3) return 2.95 + Math.max(0, (lengthMeters - 150) / 140)
  if (par === 5) return 4.65 + Math.max(0, (lengthMeters - 470) / 130)
  return 3.95 + Math.max(0, (lengthMeters - 350) / 150)
}

function scoreQuality(scoreToPar) {
  if (scoreToPar <= -1) return 0.55
  if (scoreToPar === 0) return 0.15
  if (scoreToPar === 1) return -0.35
  if (scoreToPar === 2) return -0.8
  return -1.2 - (scoreToPar - 2) * 0.35
}

function calculatePerformanceSnapshot({ scorecard, course, teeName, shots }) {
  const holesPlayed = scorecard.filter((hole) => hole.score !== '').length
  const grossScore = scorecard.reduce((sum, hole) => sum + (Number(hole.score) || 0), 0)
  const totalPutts = scorecard.reduce((sum, hole) => sum + (Number(hole.putts) || 0), 0)
  const totalPenalties = scorecard.reduce((sum, hole) => sum + (Number(hole.penalties) || 0), 0)
  const fairwaysHit = scorecard.filter((hole) => hole.fairwayHit).length
  const girHit = scorecard.filter((hole) => hole.gir).length

  const playedHoleModels = course.holes.slice(0, holesPlayed || course.holes.length)
  const parPlayed = playedHoleModels.reduce((sum, hole) => sum + hole.par, 0)
  const expectedFromTeeTotal = playedHoleModels.reduce(
    (sum, hole) => sum + expectedStrokesFromTee(getHoleLength(hole, teeName), hole.par),
    0,
  )

  const scoringDelta = holesPlayed ? grossScore - parPlayed : 0
  const averageDistance = shots.length
    ? shots.reduce((sum, shot) => sum + (shot.distanceMeters || 0), 0) / shots.length
    : 0

  const offTee = fairwaysHit * 0.24 - totalPenalties * 0.4 + Math.min(0.45, averageDistance / 520)
  const approach = girHit * 0.2 - Math.max(0, holesPlayed - girHit) * 0.05
  const shortGame = Math.max(-1.7, (holesPlayed - girHit) * -0.04 + totalPenalties * -0.08)
  const putting = Math.max(-2.5, (holesPlayed * 1.95 - totalPutts) * 0.16)

  const holeLevelAdjustment = scorecard
    .filter((hole) => hole.score !== '')
    .reduce((sum, hole, index) => {
      const model = course.holes[index]
      return sum + scoreQuality(Number(hole.score) - model.par)
    }, 0)

  const total = offTee + approach + shortGame + putting + holeLevelAdjustment * 0.35

  return {
    holesPlayed,
    grossScore,
    totalPutts,
    totalPenalties,
    fairwaysHit,
    girHit,
    parPlayed,
    expectedFromTeeTotal,
    scoringDelta,
    strokesGained: {
      offTee,
      approach,
      shortGame,
      putting,
      total,
    },
  }
}

function getShotTone(notes) {
  const note = notes.toLowerCase()
  if (note.includes('good') || note.includes('pure') || note.includes('flush')) return 'clean'
  if (note.includes('left') || note.includes('pull')) return 'left'
  if (note.includes('right') || note.includes('block')) return 'right'
  if (note.includes('rough') || note.includes('bunker')) return 'trouble'
  return 'neutral'
}

function getHoleProgress(scorecard) {
  const completed = scorecard.filter((hole) => hole.score !== '').length
  return Math.round((completed / scorecard.length) * 100)
}

function getHoleShotDistance(shots, holeNumber) {
  return shots
    .filter((shot) => shot.holeNumber === holeNumber)
    .reduce((sum, shot) => sum + (shot.distanceMeters || 0), 0)
}

function getGreenDistances(remainingMeters, greenDepthMeters) {
  const halfDepth = greenDepthMeters / 2

  return {
    front: Math.max(0, remainingMeters - halfDepth),
    middle: Math.max(0, remainingMeters),
    back: Math.max(0, remainingMeters + halfDepth),
  }
}

function getTargetDistances(hole, selectedHoleLength, trackedHoleDistance) {
  const toCarry = Math.max(0, hole.targetCarryMeters - trackedHoleDistance)
  const toLayup = hole.idealLeaveMeters > 0
    ? Math.max(0, selectedHoleLength - trackedHoleDistance - hole.idealLeaveMeters)
    : 0

  return {
    toCarry,
    toLayup,
  }
}

function getGoogleMapsUrl(course) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${course.name} Mallorca golf course`)}`
}

function HoleOverview({
  course,
  hole,
  latestShot,
  unit,
  teeName,
  remainingMeters,
  trackedHoleDistance,
}) {
  const selectedHoleLength = getHoleLength(hole, teeName)
  const greenDistances = getGreenDistances(remainingMeters, hole.greenDepthMeters)
  const targetDistances = getTargetDistances(hole, selectedHoleLength, trackedHoleDistance)
  const distanceLabel = latestShot?.distanceMeters
    ? formatDistance(latestShot.distanceMeters, unit)
    : formatDistance(selectedHoleLength, unit)
  const googleMapsUrl = getGoogleMapsUrl(course)

  return (
    <div
      className={styles.overviewCard}
      style={{
        '--accent': course.theme.accent,
        '--fairway': course.theme.fairway,
        '--sky': course.theme.sky,
      }}
    >
      <div className={styles.overviewMeta}>
        <div>
          <span className={styles.metaLabel}>Course</span>
          <strong>{course.name}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Hole</span>
          <strong>{hole.holeNumber}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Par / SI</span>
          <strong>{hole.par} / {hole.strokeIndex}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Length</span>
          <strong>{distanceLabel}</strong>
        </div>
      </div>

      <div className={styles.yardageCard}>
        <div>
          <span className={styles.metaLabel}>This is a yardage card</span>
          <strong>Not an accurate hole image</strong>
          <p>
            The scorecard and distances are loaded from published scorecards. The old concept sketch is hidden because it could mislead you on holes like Santa Ponsa 2 hole 3.
          </p>
        </div>
        <a className={styles.mapLinkButton} href={googleMapsUrl} target="_blank" rel="noreferrer">
          Open course in Google Maps
        </a>
      </div>

      <div className={styles.greenMapStrip}>
        <div>
          <span className={styles.metaLabel}>Front</span>
          <strong>{formatDistance(greenDistances.front, unit)}</strong>
        </div>
        <div className={styles.greenMini}>
          <span className={styles.pinFlag}>Pin</span>
          <i />
        </div>
        <div>
          <span className={styles.metaLabel}>Back</span>
          <strong>{formatDistance(greenDistances.back, unit)}</strong>
        </div>
      </div>

      <div className={styles.overviewStats}>
        <div>
          <span className={styles.metaLabel}>Carry</span>
          <strong>{formatDistance(hole.targetCarryMeters, unit)}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Ideal leave</span>
          <strong>{hole.idealLeaveMeters > 0 ? formatDistance(hole.idealLeaveMeters, unit) : 'N/A'}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Width / depth</span>
          <strong>{formatDistance(hole.fairwayWidthMeters, unit)} / {formatDistance(hole.greenDepthMeters, unit)}</strong>
        </div>
      </div>

      <div className={styles.playbookRow}>
        <article className={styles.playbookCard}>
          <span className={styles.metaLabel}>Playbook</span>
          <strong>{hole.targetZone}</strong>
          <p>{hole.guidance}</p>
        </article>
        <article className={styles.playbookCard}>
          <span className={styles.metaLabel}>Threat</span>
          <strong>{hole.hazardNote}</strong>
          <p>{hole.summary}</p>
        </article>
      </div>

      <div className={styles.mapFeatureGrid}>
        <div>
          <span className={styles.metaLabel}>Hole image</span>
          <strong>Hidden</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>GPS mode</span>
          <strong>{latestShot ? 'Shot measured' : 'Ready'}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Tracked</span>
          <strong>{formatDistance(trackedHoleDistance, unit)}</strong>
        </div>
      </div>

      <p className={styles.overviewNote}>
        Google Maps can be opened for a real satellite overview. To embed Google satellite maps inside this app later, we need a Google Maps API key with billing enabled.
      </p>
    </div>
  )
}

export default function ShotTrackerPrototype() {
  const [courseId, setCourseId] = useState(MALLORCA_TRACKER_COURSES[0].id)
  const [teeName, setTeeName] = useState(MALLORCA_TRACKER_COURSES[0].tees[0].name)
  const [holeNumber, setHoleNumber] = useState(1)
  const [unit, setUnit] = useState('meters')
  const [club, setClub] = useState('')
  const [notes, setNotes] = useState('')
  const [trackingStart, setTrackingStart] = useState(null)
  const [latestPosition, setLatestPosition] = useState(null)
  const [shots, setShots] = useState([])
  const [savedRounds, setSavedRounds] = useState([])
  const [roundDate, setRoundDate] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState('Ready to track the next shot.')
  const [error, setError] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [currentRoundId, setCurrentRoundId] = useState(() => `${Date.now()}`)

  const selectedCourse = useMemo(() => getTrackerCourseById(courseId), [courseId])
  const selectedTee = useMemo(
    () => selectedCourse.tees.find((tee) => tee.name === teeName) || selectedCourse.tees[0],
    [selectedCourse, teeName],
  )
  const [scorecard, setScorecard] = useState(() => buildEmptyScorecard(selectedCourse, teeName))

  useEffect(() => {
    if (!selectedCourse.tees.some((tee) => tee.name === teeName)) {
      setTeeName(selectedCourse.tees[0].name)
    }
  }, [selectedCourse, teeName])

  function resetRoundState(nextCourse = selectedCourse, nextTeeName = teeName) {
    setScorecard(buildEmptyScorecard(nextCourse, nextTeeName))
    setShots([])
    setTrackingStart(null)
    setLatestPosition(null)
    setClub('')
    setNotes('')
    setHoleNumber(1)
    setCurrentRoundId(`${Date.now()}`)
  }

  useEffect(() => {
    setScorecard((current) => {
      const next = buildEmptyScorecard(selectedCourse, teeName)
      if (!Array.isArray(current) || current.length !== next.length) return next

      return next.map((hole, index) => ({
        ...hole,
        score: current[index]?.score ?? '',
        putts: current[index]?.putts ?? '',
        penalties: current[index]?.penalties ?? '',
        fairwayHit: current[index]?.fairwayHit ?? false,
        gir: current[index]?.gir ?? false,
      }))
    })
  }, [selectedCourse, teeName])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      if (parsed.courseId) setCourseId(parsed.courseId)
      if (parsed.teeName) setTeeName(parsed.teeName)
      if (parsed.holeNumber) setHoleNumber(parsed.holeNumber)
      if (parsed.unit) setUnit(parsed.unit)
      if (parsed.roundDate) setRoundDate(parsed.roundDate)
      if (parsed.currentRoundId) setCurrentRoundId(parsed.currentRoundId)
      if (parsed.trackingStart) setTrackingStart(parsed.trackingStart)
      if (parsed.latestPosition) setLatestPosition(parsed.latestPosition)
      if (Array.isArray(parsed.shots)) setShots(parsed.shots)
      if (Array.isArray(parsed.savedRounds)) setSavedRounds(parsed.savedRounds)
      if (Array.isArray(parsed.scorecard)) setScorecard(parsed.scorecard)
    } catch {
      // Ignore bad local state and continue.
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentRoundId,
        courseId,
        teeName,
        holeNumber,
        unit,
        roundDate,
        scorecard,
        shots,
        savedRounds,
        trackingStart,
        latestPosition,
      }),
    )
  }, [currentRoundId, courseId, teeName, holeNumber, unit, roundDate, scorecard, shots, savedRounds, trackingStart, latestPosition])

  async function captureCurrentLocation(mode) {
    setIsLocating(true)
    setError('')

    try {
      const rawPosition = await getGeolocationPosition()
      const nextPosition = normalisePosition(rawPosition)
      setLatestPosition(nextPosition)

      if (mode === 'start') {
        setTrackingStart(nextPosition)
        setStatus('Start point captured. Walk to the ball and end the shot.')
      } else if (mode === 'end' && trackingStart) {
        const distanceMeters = haversineDistanceMeters(trackingStart, nextPosition)
        const shot = {
          id: `${Date.now()}`,
          roundId: currentRoundId,
          courseId,
          courseName: selectedCourse.name,
          holeNumber,
          club: club.trim(),
          notes: notes.trim(),
          start: trackingStart,
          end: nextPosition,
          distanceMeters,
          capturedAt: Date.now(),
        }

        setShots((current) => [shot, ...current])
        setTrackingStart(null)
        setClub('')
        setNotes('')
        setStatus(`Shot saved: ${formatDistance(distanceMeters, unit)}.`)
      } else {
        setStatus('Current position refreshed.')
      }
    } catch (captureError) {
      setError(captureError?.message || 'Unable to get GPS location.')
      setStatus('Location request failed.')
    } finally {
      setIsLocating(false)
    }
  }

  function updateHole(index, field, value) {
    setScorecard((current) =>
      current.map((hole, holeIndex) => (holeIndex === index ? { ...hole, [field]: value } : hole)),
    )
  }

  function updateCurrentHole(field, value) {
    updateHole(holeNumber - 1, field, value)
  }

  function setCurrentHoleScore(scoreToPar) {
    const score = Math.max(1, selectedHole.par + scoreToPar)
    updateCurrentHole('score', `${score}`)
  }

  function updateShot(shotId, field, value) {
    setShots((current) =>
      current.map((shot) => (shot.id === shotId ? { ...shot, [field]: value } : shot)),
    )
  }

  function deleteShot(shotId) {
    setShots((current) => current.filter((shot) => shot.id !== shotId))
    setStatus('Shot removed from this round.')
  }

  function saveRound() {
    const snapshot = calculatePerformanceSnapshot({
      scorecard,
      course: selectedCourse,
      teeName,
      shots: shots.filter((shot) => shot.roundId === currentRoundId),
    })

    const nextRound = {
      id: `${Date.now()}`,
      roundId: currentRoundId,
      courseId,
      courseName: selectedCourse.name,
      teeName: selectedTee.label,
      date: roundDate,
      grossScore: snapshot.grossScore,
      totalPutts: snapshot.totalPutts,
      totalPenalties: snapshot.totalPenalties,
      fairwaysHit: snapshot.fairwaysHit,
      girHit: snapshot.girHit,
      differential: computeHandicapDifferential(snapshot.grossScore, selectedTee.courseRating, selectedTee.slope),
      strokesGainedTotal: snapshot.strokesGained.total,
    }

    setSavedRounds((current) => [nextRound, ...current.filter((round) => round.roundId !== currentRoundId)].slice(0, 20))
    setStatus('Round saved into local handicap history.')
  }

  function endRoundAndSave() {
    saveRound()
    resetRoundState(selectedCourse, teeName)
    setStatus('Round saved and ended. Fresh round ready.')
  }

  function endRoundAndDelete() {
    if (typeof window !== 'undefined' && !window.confirm('End this round and delete the unsaved round data from this device?')) {
      return
    }

    resetRoundState(selectedCourse, teeName)
    setStatus('Round ended without saving.')
  }

  function startFreshRound() {
    resetRoundState(selectedCourse, teeName)
    setStatus('Fresh round started.')
  }

  function goToNextHole() {
    setHoleNumber((current) => Math.min(selectedCourse.holes.length, current + 1))
  }

  function goToPreviousHole() {
    setHoleNumber((current) => Math.max(1, current - 1))
  }

  function applyQuickNote(nextNote) {
    setNotes((current) => (current ? `${current}, ${nextNote}` : nextNote))
  }

  function exportTrackerData() {
    if (typeof window === 'undefined') return

    const payload = {
      exportedAt: new Date().toISOString(),
      currentRoundId,
      courseId,
      teeName,
      holeNumber,
      unit,
      roundDate,
      scorecard,
      shots,
      savedRounds,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mmg-tracker-backup-${roundDate}.json`
    link.click()
    window.URL.revokeObjectURL(url)
    setStatus('Tracker backup exported.')
  }

  const selectedHole = selectedCourse.holes[holeNumber - 1]
  const currentRoundShots = shots.filter((shot) => shot.roundId === currentRoundId)
  const currentHoleShots = currentRoundShots.filter((shot) => shot.holeNumber === holeNumber)
  const latestShot = currentHoleShots[0] || null
  const trackedHoleDistance = getHoleShotDistance(currentRoundShots, holeNumber)
  const selectedHoleLength = getHoleLength(selectedHole, teeName)
  const remainingMeters = Math.max(0, selectedHoleLength - trackedHoleDistance)
  const gpsAccuracy = latestPosition?.accuracy || latestShot?.end?.accuracy || null
  const handicapIndex = computeHandicapIndex(savedRounds)
  const snapshot = calculatePerformanceSnapshot({
    scorecard,
    course: selectedCourse,
    teeName,
    shots: currentRoundShots,
  })
  const roundProgress = getHoleProgress(scorecard)

  const clubAverages = useMemo(() => {
    const grouped = new Map()

    for (const shot of currentRoundShots) {
      if (!shot.club || !Number.isFinite(shot.distanceMeters)) continue
      const current = grouped.get(shot.club) || { total: 0, count: 0 }
      current.total += shot.distanceMeters
      current.count += 1
      grouped.set(shot.club, current)
    }

    return [...grouped.entries()]
      .map(([name, stats]) => ({
        name,
        averageMeters: stats.total / stats.count,
        count: stats.count,
      }))
      .sort((a, b) => b.averageMeters - a.averageMeters)
      .slice(0, 6)
  }, [currentRoundShots])

  const priorityCourses = MALLORCA_TRACKER_COURSES.filter((course) => course.priority)
  const otherCourses = MALLORCA_TRACKER_COURSES.filter((course) => !course.priority)

  return (
    <section className={styles.page}>
      <header className={styles.appHeader}>
        <div className={styles.cornerBrand}>
          <img
            className={styles.heroLogo}
            src="/MMG_Logo_Green_Transparent.png"
            alt="Mr Mallorca Golf"
          />
        </div>
        <div>
          <p className={styles.eyebrow}>Mr Mallorca Golf</p>
          <h1 className={styles.appTitle}>Shot Tracker</h1>
        </div>
        <div className={styles.headerStat}>
          <span className={styles.metaLabel}>Handicap index</span>
          <strong>{Number.isFinite(handicapIndex) ? handicapIndex.toFixed(1) : '--'}</strong>
        </div>
      </header>

      <div className={styles.focusBar}>
        <div>
          <span className={styles.metaLabel}>Next action</span>
          <strong>{trackingStart ? 'Walk to the ball, then end tracking.' : 'Pick club, start tracking, then hit.'}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>Current hole</span>
          <strong>{selectedCourse.name} · Hole {holeNumber} · Par {selectedHole.par}</strong>
        </div>
        <div>
          <span className={styles.metaLabel}>GPS</span>
          <strong>{Number.isFinite(gpsAccuracy) ? `±${Math.round(gpsAccuracy)}m` : 'Tap Refresh GPS'}</strong>
        </div>
      </div>

      <div className={styles.roundHud}>
        <div className={styles.hudMain}>
          <div>
            <span className={styles.metaLabel}>Live round</span>
            <strong className={styles.hudHeadline}>{selectedCourse.name}</strong>
            <p className={styles.hudSubline}>{selectedTee.label} tee · Hole {holeNumber} · {roundDate}</p>
          </div>
          <div className={styles.hudNumbers}>
            <div>
              <span className={styles.metaLabel}>Remaining</span>
              <strong>{formatDistance(remainingMeters, unit)}</strong>
            </div>
            <div>
              <span className={styles.metaLabel}>Round SG</span>
              <strong className={snapshot.strokesGained.total >= 0 ? styles.positive : styles.negative}>
                {formatSignedNumber(snapshot.strokesGained.total)}
              </strong>
            </div>
          </div>
        </div>
        <div className={styles.hudRail}>
          <div className={styles.hudChip}>
            <span className={styles.metaLabel}>Progress</span>
            <strong>{roundProgress}%</strong>
          </div>
          <div className={styles.hudChip}>
            <span className={styles.metaLabel}>Shots</span>
            <strong>{currentRoundShots.length}</strong>
          </div>
          <div className={styles.hudChip}>
            <span className={styles.metaLabel}>Score to par</span>
            <strong>{snapshot.holesPlayed ? `${snapshot.scoringDelta > 0 ? '+' : ''}${snapshot.scoringDelta}` : '--'}</strong>
          </div>
          <div className={styles.hudChip}>
            <span className={styles.metaLabel}>Latest</span>
            <strong>{latestShot ? formatDistance(latestShot.distanceMeters, unit) : '--'}</strong>
          </div>
        </div>
        <div className={styles.endRoundBar}>
          <button className={styles.secondaryButton} onClick={endRoundAndSave}>End + save round</button>
          <button className={styles.dangerButton} onClick={endRoundAndDelete}>End + delete round</button>
          <button className={styles.ghostButtonDark} onClick={exportTrackerData}>Export backup</button>
        </div>
      </div>

      <div className={styles.mobileCaddieBar}>
        <button className={styles.primaryButton} onClick={() => captureCurrentLocation('start')} disabled={isLocating}>
          Start
        </button>
        <button className={styles.secondaryButton} onClick={() => captureCurrentLocation('end')} disabled={isLocating || !trackingStart}>
          End
        </button>
        <button className={styles.ghostButton} onClick={goToNextHole}>
          Next hole
        </button>
      </div>

      <div className={styles.quickScoreBar}>
        <button type="button" onClick={() => setCurrentHoleScore(-1)}>Birdie</button>
        <button type="button" onClick={() => setCurrentHoleScore(0)}>Par</button>
        <button type="button" onClick={() => setCurrentHoleScore(1)}>Bogey</button>
        <button type="button" onClick={() => setCurrentHoleScore(2)}>Double</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.column}>
          <details className={styles.panel} open>
            <summary className={styles.sectionSummary}>
              <span>1</span>
              <strong>Course setup</strong>
              <small>{selectedCourse.name} · {selectedTee.label}</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Course setup</h2>
              <p>Select the course, tee, and current hole.</p>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Course</span>
                <select value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                  <optgroup label={`Priority courses (${priorityCourses.length})`}>
                    {priorityCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All other Mallorca courses">
                    {otherCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              <label className={styles.field}>
                <span>Tee</span>
                <select value={teeName} onChange={(event) => setTeeName(event.target.value)}>
                  {selectedCourse.tees.map((tee) => (
                    <option key={tee.name} value={tee.name}>
                      {tee.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.holeFlowBar}>
              <button type="button" className={styles.holeNavButton} onClick={goToPreviousHole}>Prev hole</button>
              <div className={styles.holeFlowCurrent}>
                <span className={styles.metaLabel}>Now tracking</span>
                <strong>Hole {holeNumber}</strong>
              </div>
              <button type="button" className={styles.holeNavButton} onClick={goToNextHole}>Next hole</button>
            </div>

            <div className={styles.holeScroller} aria-label="Hole selector">
              {selectedCourse.holes.map((hole) => {
                const isActive = hole.holeNumber === holeNumber
                const isComplete = scorecard[hole.holeNumber - 1]?.score !== ''

                return (
                  <button
                    key={hole.holeNumber}
                    type="button"
                    className={`${styles.holeChip}${isActive ? ` ${styles.holeChipActive}` : ''}${isComplete ? ` ${styles.holeChipComplete}` : ''}`}
                    onClick={() => setHoleNumber(hole.holeNumber)}
                  >
                    <span>{hole.holeNumber}</span>
                    <small>Par {hole.par}</small>
                  </button>
                )
              })}
            </div>

            <div className={styles.teeMetaGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Tee total</span>
                <strong className={styles.summaryValue}>{formatDistance(selectedTee.totalLengthMeters, unit)}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Course rating</span>
                <strong className={styles.summaryValue}>{formatRating(selectedTee.courseRating)}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Slope</span>
                <strong className={styles.summaryValue}>{formatPlainNumber(selectedTee.slope)}</strong>
              </div>
            </div>

            <p className={styles.courseSummary}>{selectedCourse.summary}</p>
            <p className={styles.priorityNote}>
              Scorecard status: {selectedCourse.scorecardSource}.
            </p>
            <p className={styles.priorityNote}>
              Priority courses are grouped at the top of the course dropdown.
            </p>
          </details>

          <details className={styles.panel} open>
            <summary className={styles.sectionSummary}>
              <span>2</span>
              <strong>Track shot</strong>
              <small>{latestShot ? `Latest ${formatDistance(latestShot.distanceMeters, unit)}` : status}</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Track shot</h2>
              <p>{status}</p>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Club</span>
                <input value={club} onChange={(event) => setClub(event.target.value)} placeholder="Driver, 7 iron, 54 wedge..." />
              </label>

              <label className={styles.field}>
                <span>Units</span>
                <select value={unit} onChange={(event) => setUnit(event.target.value)}>
                  <option value="meters">Meters</option>
                  <option value="yards">Yards</option>
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Shot note</span>
              <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Good strike, slight pull, downwind..." />
            </label>

            <div className={styles.quickNoteRow}>
              {QUICK_NOTES.map((quickNote) => (
                <button
                  key={quickNote}
                  type="button"
                  className={styles.quickNoteChip}
                  onClick={() => applyQuickNote(quickNote)}
                >
                  {quickNote}
                </button>
              ))}
            </div>

            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} onClick={() => captureCurrentLocation('start')} disabled={isLocating}>
                {isLocating && !trackingStart ? 'Locating...' : 'Start tracking'}
              </button>
              <button className={styles.secondaryButton} onClick={() => captureCurrentLocation('end')} disabled={isLocating || !trackingStart}>
                {isLocating && trackingStart ? 'Locating...' : 'End tracking'}
              </button>
              <button className={styles.ghostButton} onClick={() => captureCurrentLocation('refresh')} disabled={isLocating}>
                Refresh GPS
              </button>
            </div>

            <div className={styles.quickActionGrid}>
              <article className={styles.quickActionCard}>
                <span className={styles.metaLabel}>To green</span>
                <strong>{formatDistance(remainingMeters, unit)}</strong>
              </article>
              <article className={styles.quickActionCard}>
                <span className={styles.metaLabel}>To lay-up</span>
                <strong>{Math.max(0, remainingMeters - selectedHole.idealLeaveMeters) > 0 ? formatDistance(Math.max(0, remainingMeters - selectedHole.idealLeaveMeters), unit) : 'N/A'}</strong>
              </article>
              <article className={styles.quickActionCard}>
                <span className={styles.metaLabel}>Green depth</span>
                <strong>{formatDistance(selectedHole.greenDepthMeters, unit)}</strong>
              </article>
              <article className={styles.quickActionCard}>
                <span className={styles.metaLabel}>GPS accuracy</span>
                <strong>{Number.isFinite(gpsAccuracy) ? `±${Math.round(gpsAccuracy)}m` : '--'}</strong>
              </article>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Latest shot</span>
                <strong className={styles.summaryValue}>
                  {latestShot ? formatDistance(latestShot.distanceMeters, unit) : '--'}
                </strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Hole length</span>
                <strong className={styles.summaryValue}>{formatDistance(selectedHole.tees[teeName]?.lengthMeters, unit)}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Target carry</span>
                <strong className={styles.summaryValue}>{formatDistance(selectedHole.targetCarryMeters, unit)}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Tracked on hole</span>
                <strong className={styles.summaryValue}>{formatDistance(trackedHoleDistance, unit)}</strong>
              </div>
            </div>

            <div className={styles.currentHoleEntry}>
              <div className={styles.panelHeader}>
                <h2>Current hole quick entry</h2>
                <p>Fast buttons for the hole you are playing now.</p>
              </div>
              <div className={styles.quickScoreGrid}>
                {[-1, 0, 1, 2].map((scoreToPar) => (
                  <button key={scoreToPar} type="button" onClick={() => setCurrentHoleScore(scoreToPar)}>
                    {scoreToPar === -1 ? 'Birdie' : scoreToPar === 0 ? 'Par' : scoreToPar === 1 ? 'Bogey' : 'Double'}
                  </button>
                ))}
              </div>
              <div className={styles.quickToggleGrid}>
                <button
                  type="button"
                  className={scorecard[holeNumber - 1]?.fairwayHit ? styles.toggleActive : ''}
                  onClick={() => updateCurrentHole('fairwayHit', !scorecard[holeNumber - 1]?.fairwayHit)}
                >
                  Fairway
                </button>
                <button
                  type="button"
                  className={scorecard[holeNumber - 1]?.gir ? styles.toggleActive : ''}
                  onClick={() => updateCurrentHole('gir', !scorecard[holeNumber - 1]?.gir)}
                >
                  GIR
                </button>
                <button type="button" onClick={() => updateCurrentHole('putts', `${Number(scorecard[holeNumber - 1]?.putts || 0) + 1}`)}>
                  + Putt
                </button>
                <button type="button" onClick={() => updateCurrentHole('penalties', `${Number(scorecard[holeNumber - 1]?.penalties || 0) + 1}`)}>
                  + Penalty
                </button>
              </div>
            </div>
          </details>

          <details className={styles.panel}>
            <summary className={styles.sectionSummary}>
              <span>3</span>
              <strong>Scorecard</strong>
              <small>{snapshot.holesPlayed} holes entered · {snapshot.grossScore || '--'} total</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Round scoring</h2>
              <p>Resume, edit, and save the current round.</p>
            </div>

            <div className={styles.scorecardTable}>
              <div className={`${styles.scorecardRow} ${styles.scorecardHead}`}>
                <span>Hole</span>
                <span>Par</span>
                <span>Yds/m</span>
                <span>Score</span>
                <span>Putts</span>
                <span>Pens</span>
                <span>FW</span>
                <span>GIR</span>
              </div>
              {scorecard.map((hole, index) => (
                <div key={hole.holeNumber} className={`${styles.scorecardRowWide}${hole.holeNumber === holeNumber ? ` ${styles.scorecardRowActive}` : ''}`}>
                  <span>{hole.holeNumber}</span>
                  <span>{hole.par}</span>
                  <span>{formatDistance(hole.teeLengthMeters, unit)}</span>
                  <input value={hole.score} onChange={(event) => updateHole(index, 'score', event.target.value)} inputMode="numeric" />
                  <input value={hole.putts} onChange={(event) => updateHole(index, 'putts', event.target.value)} inputMode="numeric" />
                  <input value={hole.penalties} onChange={(event) => updateHole(index, 'penalties', event.target.value)} inputMode="numeric" />
                  <label className={styles.checkWrap}>
                    <input type="checkbox" checked={hole.fairwayHit} onChange={(event) => updateHole(index, 'fairwayHit', event.target.checked)} />
                  </label>
                  <label className={styles.checkWrap}>
                    <input type="checkbox" checked={hole.gir} onChange={(event) => updateHole(index, 'gir', event.target.checked)} />
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Round date</span>
                <input type="date" value={roundDate} onChange={(event) => setRoundDate(event.target.value)} />
              </label>
              <div className={styles.field}>
                <span>Round actions</span>
                <div className={styles.buttonRow}>
                  <button className={styles.primaryButton} onClick={saveRound}>Save round</button>
                  <button className={styles.secondaryButton} onClick={endRoundAndSave}>End + save</button>
                  <button className={styles.dangerButton} onClick={endRoundAndDelete}>End + delete</button>
                  <button className={styles.ghostButton} onClick={goToNextHole}>Continue round</button>
                  <button className={styles.ghostButton} onClick={startFreshRound}>Fresh round</button>
                  <button className={styles.ghostButton} onClick={exportTrackerData}>Export backup</button>
                </div>
              </div>
            </div>
          </details>
        </div>

        <div className={styles.column}>
          <details className={styles.panel} open>
            <summary className={styles.sectionSummary}>
              <span>Map</span>
              <strong>Hole overview</strong>
              <small>{formatDistance(remainingMeters, unit)} remaining</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Hole overview</h2>
              <p>Hole-specific tee data, target zones, hazard notes, and leave guidance.</p>
            </div>
            <HoleOverview
              course={selectedCourse}
              hole={selectedHole}
              latestShot={latestShot}
              unit={unit}
              teeName={teeName}
              remainingMeters={remainingMeters}
              trackedHoleDistance={trackedHoleDistance}
            />
          </details>

          <details className={styles.panel}>
            <summary className={styles.sectionSummary}>
              <span>Shots</span>
              <strong>Current hole shots</strong>
              <small>{currentHoleShots.length} tracked</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Current hole shots</h2>
              <p>Edit club and notes inline so the round stays useful after the walk back to the buggy.</p>
            </div>

            {currentHoleShots.length === 0 ? (
              <div className={styles.emptyState}>Track a shot on this hole and it will appear here for editing.</div>
            ) : (
              <div className={styles.historyList}>
                {currentHoleShots.map((shot, index) => (
                  <article key={shot.id} className={styles.shotCard}>
                    <div className={styles.historyTop}>
                      <div>
                        <strong>Shot {currentHoleShots.length - index}</strong>
                        <p className={styles.historyMeta}>
                          {formatDistance(shot.distanceMeters, unit)} · Accuracy {Math.round(shot.end.accuracy || 0)}m
                        </p>
                      </div>
                      <span className={`${styles.shotTone} ${styles[`shotTone${getShotTone(shot.notes)}`]}`}>
                        {shot.notes ? shot.notes.split(',')[0] : 'Tracked'}
                      </span>
                    </div>

                    <div className={styles.shotEditGrid}>
                      <label className={styles.field}>
                        <span>Club</span>
                        <input
                          value={shot.club || ''}
                          onChange={(event) => updateShot(shot.id, 'club', event.target.value)}
                          placeholder="Club"
                        />
                      </label>
                      <label className={styles.field}>
                        <span>Notes</span>
                        <input
                          value={shot.notes || ''}
                          onChange={(event) => updateShot(shot.id, 'notes', event.target.value)}
                          placeholder="Notes"
                        />
                      </label>
                    </div>

                    <div className={styles.buttonRow}>
                      <button type="button" className={styles.ghostButton} onClick={() => deleteShot(shot.id)}>
                        Delete shot
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </details>

          <details className={styles.panel}>
            <summary className={styles.sectionSummary}>
              <span>SG</span>
              <strong>Performance</strong>
              <small>{formatSignedNumber(snapshot.strokesGained.total)} total</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Performance snapshot</h2>
              <p>A stronger strokes-gained-style model based on score quality, hole length, and round stats.</p>
            </div>

            <div className={styles.sgGrid}>
              <div className={styles.sgCard}>
                <span className={styles.metaLabel}>Off the tee</span>
                <strong className={`${styles.sgValue} ${snapshot.strokesGained.offTee >= 0 ? styles.positive : styles.negative}`}>{formatSignedNumber(snapshot.strokesGained.offTee)}</strong>
              </div>
              <div className={styles.sgCard}>
                <span className={styles.metaLabel}>Approach</span>
                <strong className={`${styles.sgValue} ${snapshot.strokesGained.approach >= 0 ? styles.positive : styles.negative}`}>{formatSignedNumber(snapshot.strokesGained.approach)}</strong>
              </div>
              <div className={styles.sgCard}>
                <span className={styles.metaLabel}>Short game</span>
                <strong className={`${styles.sgValue} ${snapshot.strokesGained.shortGame >= 0 ? styles.positive : styles.negative}`}>{formatSignedNumber(snapshot.strokesGained.shortGame)}</strong>
              </div>
              <div className={styles.sgCard}>
                <span className={styles.metaLabel}>Putting</span>
                <strong className={`${styles.sgValue} ${snapshot.strokesGained.putting >= 0 ? styles.positive : styles.negative}`}>{formatSignedNumber(snapshot.strokesGained.putting)}</strong>
              </div>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Score to par</span>
                <strong className={styles.summaryValue}>
                  {snapshot.holesPlayed ? `${snapshot.scoringDelta > 0 ? '+' : ''}${snapshot.scoringDelta}` : '--'}
                </strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Expected tee strokes</span>
                <strong className={styles.summaryValue}>{snapshot.holesPlayed ? snapshot.expectedFromTeeTotal.toFixed(1) : '--'}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>SG total</span>
                <strong className={`${styles.summaryValue} ${snapshot.strokesGained.total >= 0 ? styles.positive : styles.negative}`}>{formatSignedNumber(snapshot.strokesGained.total)}</strong>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.metaLabel}>Fairways / GIR</span>
                <strong className={styles.summaryValue}>{snapshot.fairwaysHit} / {snapshot.girHit}</strong>
              </div>
            </div>
          </details>

          <details className={styles.panel}>
            <summary className={styles.sectionSummary}>
              <span>Clubs</span>
              <strong>Club distances</strong>
              <small>{clubAverages.length} clubs</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Club distances</h2>
              <p>Simple averages from tracked shots in the current round.</p>
            </div>

            {clubAverages.length === 0 ? (
              <div className={styles.emptyState}>Track a few shots to build club distance averages.</div>
            ) : (
              <div className={styles.historyList}>
                {clubAverages.map((clubAverage) => (
                  <article key={clubAverage.name} className={styles.historyCard}>
                    <div className={styles.historyTop}>
                      <strong>{clubAverage.name}</strong>
                      <span>{formatDistance(clubAverage.averageMeters, unit)}</span>
                    </div>
                    <p className={styles.historyMeta}>{clubAverage.count} tracked shots</p>
                  </article>
                ))}
              </div>
            )}
          </details>

          <details className={styles.panel}>
            <summary className={styles.sectionSummary}>
              <span>HI</span>
              <strong>Handicap history</strong>
              <small>{savedRounds.length} saved rounds</small>
            </summary>
            <div className={styles.panelHeader}>
              <h2>Handicap history</h2>
              <p>Uses the same differential logic as your spreadsheet and keeps saved rounds editable later.</p>
            </div>

            {savedRounds.length === 0 ? (
              <div className={styles.emptyState}>Save a round to start building handicap history.</div>
            ) : (
              <div className={styles.historyList}>
                {savedRounds.map((round) => (
                  <article key={round.id} className={styles.historyCard}>
                    <div className={styles.historyTop}>
                      <div>
                        <strong>{round.courseName}</strong>
                        <p className={styles.historyMeta}>{round.date} · {round.teeName}</p>
                      </div>
                      <span>{Number.isFinite(round.differential) ? round.differential.toFixed(1) : '--'}</span>
                    </div>
                    <p className={styles.historyMeta}>
                      Score {round.grossScore} · Putts {round.totalPutts} · GIR {round.girHit} · SG {round.strokesGainedTotal.toFixed(1)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </details>
        </div>
      </div>
    </section>
  )
}
