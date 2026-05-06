import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MALLORCA_TRACKER_COURSES } from '../src/lib/mallorca-tracker-courses.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = resolve(__dirname, '../../mmg-tools/strokes-gained')
const outputPath = resolve(outputDir, 'index.html')
const manifestPath = resolve(outputDir, 'manifest.webmanifest')
const serviceWorkerPath = resolve(outputDir, 'sw.js')
const iconPath = resolve(outputDir, 'icon.svg')
const faviconPath = resolve(outputDir, 'favicon.svg')

function validateCourses(courses) {
  const issues = []

  for (const course of courses) {
    const holeNumbers = new Set(course.holes.map((hole) => hole.holeNumber))
    if (holeNumbers.size !== course.holes.length) issues.push(`${course.name}: duplicate hole number`)

    for (const tee of course.tees) {
      const total = course.holes.reduce((sum, hole) => sum + (hole.tees[tee.name]?.lengthMeters || 0), 0)
      if (total !== tee.totalLengthMeters) issues.push(`${course.name} ${tee.label}: tee total ${tee.totalLengthMeters}, holes ${total}`)
    }

    const strokeIndexes = course.holes.map((hole) => hole.strokeIndex).filter(Number.isFinite)
    if (course.holes.length === 18 && new Set(strokeIndexes).size !== 18) issues.push(`${course.name}: SI coverage`)
  }

  return issues
}

const validationIssues = validateCourses(MALLORCA_TRACKER_COURSES)
if (validationIssues.length) {
  throw new Error(`Course validation failed:\n${validationIssues.join('\n')}`)
}

const coursesJson = JSON.stringify(MALLORCA_TRACKER_COURSES)

const html = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#163b32">
  <link rel="manifest" href="./manifest.webmanifest">
  <link rel="icon" href="https://shotscope.com/blog/wp-content/uploads/sites/13/2022/11/Whatisstrokesgainned-778x520-1.png" type="image/png">
  <link rel="shortcut icon" href="https://shotscope.com/blog/wp-content/uploads/sites/13/2022/11/Whatisstrokesgainned-778x520-1.png" type="image/png">
  <link rel="apple-touch-icon" href="https://shotscope.com/blog/wp-content/uploads/sites/13/2022/11/Whatisstrokesgainned-778x520-1.png">
  <title>MMG Player Strokes Gained</title>
  <style>
    :root {
      --pine: #163b32;
      --pine-0: #0f2b25;
      --pine-2: #245648;
      --leaf: #2f795b;
      --gold: #bc963c;
      --gold-2: #d7b964;
      --ink: #17201c;
      --muted: #68726c;
      --line: rgba(23, 32, 28, 0.12);
      --paper: #f7f4ed;
      --card: #fffef9;
      --good: #13734f;
      --bad: #a34532;
      --warn: #8a651f;
    }
    * { box-sizing: border-box; }
    html { color-scheme: light; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        linear-gradient(90deg, rgba(22, 59, 50, 0.05) 0 1px, transparent 1px 96px),
        linear-gradient(180deg, rgba(22, 59, 50, 0.04) 0 1px, transparent 1px 96px),
        linear-gradient(180deg, #faf8f2 0%, #ede6d9 100%);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    button, input, select { font: inherit; }
    button { cursor: pointer; }
    .app { max-width: 1240px; margin: 0 auto; padding: 18px; }
    header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
      padding: 14px 0 18px;
    }
    .brandLockup { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: center; }
    .brandMark {
      width: 48px;
      aspect-ratio: 1;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--pine-0), var(--pine-2));
      border: 1px solid rgba(255, 255, 255, 0.34);
      box-shadow: 0 14px 34px rgba(22, 59, 50, 0.18);
      color: var(--gold-2);
      font-weight: 900;
      letter-spacing: 0.02em;
    }
    h1 { margin: 0; color: var(--pine); font-size: clamp(1.8rem, 5vw, 3rem); line-height: 1.02; letter-spacing: 0; }
    h2 { margin: 0; color: var(--pine); font-size: 1rem; letter-spacing: 0; }
    p { margin: 0; color: var(--muted); line-height: 1.55; }
    .eyebrow, .label, label span, th, .pill, .micro {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .eyebrow { color: var(--gold); margin-bottom: 0.3rem; }
    .status {
      justify-self: end;
      border: 1px solid rgba(22, 59, 50, 0.16);
      border-radius: 999px;
      padding: 9px 12px;
      background: rgba(255, 255, 255, 0.78);
      color: var(--pine);
      font-size: 0.82rem;
      font-weight: 800;
      max-width: 32ch;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .topMetrics, .sgBreakdown {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 1px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--line);
      box-shadow: 0 20px 48px rgba(23, 32, 28, 0.11);
    }
    .sgBreakdown { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .metric {
      min-height: 88px;
      background: linear-gradient(180deg, var(--pine), var(--pine-0));
      color: #fff;
      padding: 15px;
      display: grid;
      align-content: center;
      gap: 6px;
    }
    .metric .label { color: rgba(255,255,255,0.7); }
    .metric strong { font-size: clamp(1.45rem, 5vw, 2.2rem); line-height: 1; }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      gap: 16px;
      align-items: start;
      margin-top: 16px;
    }
    .stack { display: grid; gap: 16px; }
    .panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 254, 249, 0.94);
      box-shadow: 0 16px 36px rgba(23, 32, 28, 0.07);
      padding: 16px;
      backdrop-filter: blur(10px);
    }
    .panelHead {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 13px;
    }
    .formGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
    label { display: grid; gap: 6px; color: var(--muted); }
    input, select {
      width: 100%;
      min-height: 44px;
      border: 1px solid rgba(23, 32, 28, 0.15);
      border-radius: 8px;
      background: linear-gradient(180deg, #fff, #fbfaf5);
      color: var(--ink);
      padding: 11px 12px;
    }
    input:focus, select:focus, button:focus-visible {
      outline: 2px solid rgba(188, 150, 60, 0.58);
      outline-offset: 2px;
    }
    input:disabled { opacity: 0.65; background: #f1eee6; }
    .currentHole {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.08), transparent 42%),
        linear-gradient(135deg, var(--pine-0), var(--pine-2));
      color: #fff;
      padding: 16px;
      box-shadow: 0 24px 54px rgba(22, 59, 50, 0.2);
    }
    .currentHole p, .currentHole .label { color: rgba(255,255,255,0.72); }
    .currentHole strong { display: block; font-size: clamp(2.2rem, 12vw, 4.4rem); line-height: 0.9; }
    .holeFacts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 10px; }
    .fact {
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 8px;
      padding: 10px;
      background: rgba(255,255,255,0.08);
    }
    .fact b { display: block; margin-top: 3px; color: #fff; }
    .holeStrip {
      display: grid;
      grid-template-columns: repeat(9, minmax(0, 1fr));
      gap: 6px;
      margin-top: 12px;
    }
    .holeStrip button, .scoreButtons button, .quickButtons button, .lieButtons button, .clubButtons button, .tagButtons button {
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--pine);
      font-weight: 850;
    }
    .holeStrip button.active, .lieButtons button.active, .tagButtons button.active {
      background: var(--pine);
      color: #fff;
      border-color: var(--pine);
    }
    .holeStrip button.scored { box-shadow: inset 0 0 0 2px rgba(188, 150, 60, 0.4); }
    .actions, .scoreButtons, .quickButtons, .lieButtons, .clubButtons, .tagButtons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .scoreButtons { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .quickButtons, .clubButtons, .tagButtons { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .lieButtons { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .qualityButtons { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
    .qualityButtons button {
      min-height: 52px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--pine);
      font-weight: 900;
    }
    .qualityButtons button.active { background: var(--pine); color: #fff; border-color: var(--pine); }
    .primary, .secondary, .ghost, .danger {
      min-height: 46px;
      border-radius: 8px;
      padding: 10px 15px;
      border: 1px solid transparent;
      font-size: 0.72rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .primary { background: var(--pine); color: #fff; }
    .primary:hover, .secondary:hover, .ghost:hover, .danger:hover, .holeStrip button:hover, .scoreButtons button:hover, .quickButtons button:hover, .lieButtons button:hover, .clubButtons button:hover, .tagButtons button:hover { transform: translateY(-1px); }
    .secondary { background: linear-gradient(180deg, var(--gold-2), var(--gold)); color: var(--ink); }
    .ghost { background: transparent; border-color: rgba(23, 32, 28, 0.16); color: var(--pine); }
    .danger { background: rgba(163, 69, 50, 0.08); border-color: rgba(163, 69, 50, 0.25); color: var(--bad); }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      border-radius: 999px;
      padding: 6px 9px;
      background: rgba(22, 59, 50, 0.08);
      color: var(--pine);
      white-space: nowrap;
    }
    .good { color: var(--good) !important; }
    .bad { color: var(--bad) !important; }
    .warn { color: var(--warn) !important; }
    .scorecardWrap { overflow-x: auto; }
    table { width: 100%; min-width: 760px; border-collapse: collapse; }
    th, td { padding: 8px 7px; border-bottom: 1px solid var(--line); text-align: left; }
    th { color: var(--muted); }
    td input { min-height: 34px; padding: 7px; }
    tr.activeRow { background: rgba(22, 59, 50, 0.06); }
    .shotList { display: grid; gap: 10px; }
    .shot {
      display: grid;
      gap: 8px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      padding: 12px;
    }
    .shotTop { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
    .shotTop strong { color: var(--pine); }
    .shotMeta { color: var(--muted); font-size: 0.88rem; }
    .twoCols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .miniChart { display: grid; gap: 9px; }
    .barRow { display: grid; grid-template-columns: 82px minmax(0, 1fr) 54px; gap: 8px; align-items: center; font-size: 0.84rem; }
    .barTrack { height: 9px; background: rgba(23,32,28,0.08); border-radius: 999px; overflow: hidden; }
    .barFill { height: 100%; width: 0; background: var(--leaf); border-radius: 999px; }
    .barFill.neg { background: var(--bad); }
    .sourceBox { border-left: 4px solid var(--gold); padding: 10px 12px; background: rgba(188, 150, 60, 0.09); border-radius: 6px; }
    details.setupDetails, details.compactDetails {
      margin-top: 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255,255,255,0.54);
      padding: 10px 12px;
    }
    details.setupDetails summary, details.compactDetails summary {
      cursor: pointer;
      color: var(--pine);
      font-weight: 850;
    }
    details.setupDetails[open] summary, details.compactDetails[open] summary { margin-bottom: 11px; }
    textarea {
      width: 100%;
      min-height: 88px;
      resize: vertical;
      border: 1px solid rgba(23, 32, 28, 0.15);
      border-radius: 8px;
      background: #fff;
      color: var(--ink);
      padding: 11px 12px;
    }
    body[data-mode="score"] .sgPanel, body[data-mode="score"] .shotEntry { display: none; }
    body[data-mode="sg"] .detailOnly { display: none; }
    .detailOnly .tagButtons { display: none; }
    details.compactDetails[open] .tagButtons { display: grid; }
    @media (max-width: 900px) {
      .app { padding: 12px; }
      header, .layout, .topMetrics, .sgBreakdown, .formGrid, .currentHole, .twoCols { grid-template-columns: 1fr; }
      .status { justify-self: start; max-width: 100%; }
      .metric { min-height: 74px; }
      .holeFacts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .holeStrip { grid-template-columns: repeat(6, minmax(0, 1fr)); }
      input, select, textarea { min-height: 50px; font-size: 1rem; }
      .scoreButtons { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .quickButtons, .clubButtons, .lieButtons, .tagButtons, .qualityButtons { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .holeStrip button, .scoreButtons button, .quickButtons button, .lieButtons button, .clubButtons button, .tagButtons button, .qualityButtons button, .primary, .secondary, .ghost, .danger { min-height: 52px; }
      .actions { display: grid; grid-template-columns: 1fr; }
      .actions button { width: 100%; }
    }
  </style>
</head>
<body>
  <main class="app">
    <header>
      <div>
        <div class="brandLockup">
          <div class="brandMark">SG</div>
          <div>
            <p class="eyebrow">Mr Mallorca Golf</p>
            <h1>Player Strokes Gained</h1>
          </div>
        </div>
      </div>
      <div class="status" id="status">Ready</div>
    </header>

    <section class="topMetrics">
      <div class="metric"><span class="label">Round SG</span><strong id="sgTotal">--</strong></div>
      <div class="metric"><span class="label">Score</span><strong id="scoreTotal">--</strong></div>
      <div class="metric"><span class="label">Putts / Hole</span><strong id="puttsTotal">--</strong></div>
      <div class="metric"><span class="label">Differential</span><strong id="differential">--</strong></div>
      <div class="metric"><span class="label">Thru</span><strong id="holesThru">--</strong></div>
    </section>

    <div class="layout">
      <div class="stack">
        <section class="panel">
          <div class="panelHead">
            <h2>Round Setup</h2>
            <span class="pill" id="courseCount"></span>
          </div>
          <div class="formGrid">
            <label><span>Course</span><select id="courseSelect"></select></label>
            <label><span>Tee</span><select id="teeSelect"></select></label>
            <label><span>Mode</span><select id="roundMode"><option value="full">Full shot detail</option><option value="sg">Strokes gained</option><option value="score">Score only</option></select></label>
          </div>
          <details class="setupDetails">
            <summary>Round details</summary>
            <div class="formGrid">
            <label><span>Player</span><input id="playerName" placeholder="Name"></label>
            <label><span>Round date</span><input id="roundDate" type="date"></label>
            <label><span>Target handicap</span><input id="targetHandicap" type="number" step="0.1" placeholder="0"></label>
            <label><span>Playing handicap</span><input id="playingHandicap" type="number" step="1" placeholder="Auto"></label>
            <label><span>Units</span><select id="unitSelect"><option value="yards">Yards</option><option value="meters">Metres</option></select></label>
            </div>
            <div class="sourceBox" style="margin-top:12px"><p id="sourceText"></p></div>
          </details>
        </section>

        <section class="currentHole">
          <div>
            <span class="label">Current hole</span>
            <strong id="holeTitle">1</strong>
            <p id="holeSubtitle"></p>
            <div class="holeFacts">
              <div class="fact"><span class="label">Par</span><b id="holePar">--</b></div>
              <div class="fact"><span class="label">SI</span><b id="holeSi">--</b></div>
              <div class="fact"><span class="label">Length</span><b id="holeLength">--</b></div>
              <div class="fact"><span class="label">HCP</span><b id="holeShots">--</b></div>
              <div class="fact"><span class="label">Score</span><b id="holeScore">--</b></div>
              <div class="fact"><span class="label">SG</span><b id="holeLiveSg">--</b></div>
              <div class="fact"><span class="label">Putts</span><b id="holePutts">--</b></div>
              <div class="fact"><span class="label">Miss</span><b id="holeMiss">--</b></div>
            </div>
          </div>
          <div class="actions">
            <button class="ghost" id="prevHole">Prev</button>
            <button class="secondary" id="nextHole">Next</button>
          </div>
        </section>

        <section class="panel">
          <div class="panelHead">
            <h2>Hole Select</h2>
            <span class="pill" id="progressPill">0%</span>
          </div>
          <div class="holeStrip" id="holeGrid"></div>
        </section>

        <section class="panel">
          <div class="panelHead">
            <h2>Quick Score</h2>
            <span class="pill" id="netPill">Net --</span>
          </div>
          <div class="scoreButtons" id="scoreButtons"></div>
        </section>

        <section class="panel shotEntry" id="shotEntryPanel">
          <div class="panelHead">
            <h2>Add Shot</h2>
            <span class="pill" id="draftSg">--</span>
          </div>
          <div class="sourceBox"><p id="shotContext">Shot 1 | Tee shot</p></div>
          <div class="twoCols">
            <div>
              <label><span>Start lie</span><select id="startLie"></select></label>
              <div class="lieButtons" id="startLieButtons"></div>
            </div>
            <div>
              <label><span>Finish lie</span><select id="endLie"></select></label>
              <div class="lieButtons" id="endLieButtons"></div>
            </div>
          </div>
          <div class="quickButtons" id="puttButtons"></div>
          <div class="formGrid" style="margin-top:11px">
            <label><span id="startDistanceLabel">Start yards</span><input id="startDistance" type="number" step="0.1" inputmode="decimal"></label>
            <label><span id="endDistanceLabel">Finish yards</span><input id="endDistance" type="number" step="0.1" inputmode="decimal"></label>
            <label><span>Club</span><select id="club"></select></label>
            <label><span>Wind</span><select id="wind"></select></label>
            <label><span>Penalty</span><input id="penaltyStrokes" type="number" min="0" step="1" inputmode="numeric" placeholder="0"></label>
            <label><span>Note</span><input id="note" placeholder="Optional"></label>
          </div>
          <div class="qualityButtons" id="qualityButtons"></div>
          <details class="compactDetails detailOnly">
            <summary>Shot tags</summary>
            <div class="formGrid" style="margin-top:11px">
              <label><span>Contact</span><select id="contact"></select></label>
              <label><span>Direction</span><select id="direction"></select></label>
              <label><span>Flight</span><select id="flight"></select></label>
              <label><span>Outcome</span><select id="outcome"></select></label>
            </div>
            <div class="tagButtons" id="contactButtons"></div>
            <div class="tagButtons" id="directionButtons"></div>
            <div class="tagButtons" id="outcomeButtons"></div>
          </details>
          <details class="compactDetails">
            <summary>Club and notes shortcuts</summary>
            <div class="clubButtons" id="clubButtons"></div>
            <div class="quickButtons" id="noteButtons"></div>
          </details>
          <div class="actions">
            <button class="primary" id="addShot">Add shot</button>
            <button class="ghost" id="holedButton">Holed / next</button>
            <button class="secondary" id="addShotNext">Add shot + next</button>
            <button class="ghost" id="undoShot">Undo last shot</button>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="panel sgPanel">
          <div class="panelHead">
            <h2>Performance</h2>
            <span class="pill" id="targetPill">Target --</span>
          </div>
          <div class="sgBreakdown">
            <div class="metric"><span class="label">Off tee</span><strong id="sgTee">--</strong></div>
            <div class="metric"><span class="label">Approach</span><strong id="sgApproach">--</strong></div>
            <div class="metric"><span class="label">Short</span><strong id="sgShort">--</strong></div>
            <div class="metric"><span class="label">Putting</span><strong id="sgPutting">--</strong></div>
          </div>
          <div class="miniChart" id="leaksChart" style="margin-top:12px"></div>
        </section>

        <section class="panel sgPanel">
          <div class="panelHead">
            <h2>Shots This Hole</h2>
            <span class="pill" id="holeSgPill">--</span>
          </div>
          <div class="shotList" id="shotList"></div>
        </section>

        <section class="panel sgPanel">
          <div class="panelHead">
            <h2>Club Review</h2>
            <span class="pill" id="clubCount">--</span>
          </div>
          <div class="shotList" id="clubList"></div>
        </section>

        <section class="panel sgPanel">
          <div class="panelHead">
            <h2>Shot Patterns</h2>
            <span class="pill">Contact + direction</span>
          </div>
          <div class="shotList" id="patternList"></div>
        </section>

        <section class="panel">
          <div class="panelHead">
            <h2>Scorecard</h2>
            <span class="pill" id="stablefordPill">-- pts</span>
          </div>
          <div class="scorecardWrap"><table id="scorecard"></table></div>
          <label style="margin-top:12px"><span>Round note</span><textarea id="roundNote" placeholder="First-test notes, feels, weather, anything worth remembering"></textarea></label>
          <div class="actions">
            <button class="primary" id="saveRound">Save round</button>
            <button class="ghost" id="exportData">Export</button>
            <button class="ghost" id="exportCsv">CSV</button>
            <button class="ghost" id="importButton">Import</button>
            <button class="danger" id="clearRound">Clear current</button>
          </div>
          <input id="importFile" type="file" accept="application/json" style="display:none">
        </section>

        <section class="panel">
          <div class="panelHead">
            <h2>Saved Rounds</h2>
            <span class="pill" id="roundCount">--</span>
          </div>
          <div class="shotList" id="roundList"></div>
          <div class="shotList" id="roundDetail" style="margin-top:10px"></div>
        </section>
      </div>
    </div>
  </main>

  <script>
    const COURSES = ${coursesJson};
    const STORAGE_KEY = 'mmg-player-strokes-gained-v3';
    const LIES = [
      ['tee', 'Tee'],
      ['fairway', 'Fairway'],
      ['rough', 'Rough'],
      ['sand', 'Sand'],
      ['recovery', 'Recovery'],
      ['green', 'Green'],
      ['holed', 'Holed']
    ];
    const START_LIES = LIES.filter(function(item) { return item[0] !== 'holed'; });
    const CLUBS = ['Driver', '3 wood', '3', '4', '5', '6', '7', '8', '9', 'PW', '50', '54', '58', 'Putter'];
    const NOTES = ['Good', 'Left', 'Right', 'Short', 'Long', 'Bunker', 'Penalty', 'Recovery'];
    const QUALITIES = [
      ['great', 'Great'],
      ['good', 'Good'],
      ['ok', 'OK'],
      ['poor', 'Poor'],
      ['penalty', 'Penalty']
    ];
    const PUTTS = [['Gimmie', 1], ['3ft', 3], ['6ft', 6], ['10ft', 10], ['20ft', 20], ['40ft', 40]];
    const WINDS = [['', 'Not set'], ['calm', 'Calm'], ['helping', 'Helping'], ['into', 'Into'], ['left-right', 'Left to right'], ['right-left', 'Right to left'], ['gusting', 'Gusting']];
    const CONTACT = [['', 'Not set'], ['flush', 'Flush'], ['good', 'Good'], ['thin', 'Thin'], ['heavy', 'Heavy'], ['toe', 'Toe'], ['heel', 'Heel'], ['topped', 'Topped']];
    const DIRECTION = [['', 'Not set'], ['online', 'Online'], ['left', 'Left'], ['right', 'Right'], ['pull', 'Pull'], ['push', 'Push'], ['hook', 'Hook'], ['slice', 'Slice']];
    const FLIGHT = [['', 'Not set'], ['stock', 'Stock'], ['low', 'Low'], ['high', 'High'], ['draw', 'Draw'], ['fade', 'Fade'], ['wind', 'Wind affected']];
    const OUTCOME = [['', 'Not set'], ['good', 'Good shot'], ['safe', 'Safe miss'], ['short', 'Short'], ['long', 'Long'], ['bunker', 'Bunker'], ['trees', 'Trees'], ['water', 'Water'], ['lost', 'Lost ball'], ['penalty', 'Penalty']];
    const state = loadState();

    function defaultState() {
      return {
        courseId: COURSES[0].id,
        teeName: COURSES[0].tees[0].name,
        hole: 1,
        date: new Date().toISOString().slice(0, 10),
        playerName: '',
        roundMode: 'full',
        roundNote: '',
        targetHandicap: '0',
        playingHandicap: '',
        units: 'yards',
        shots: [],
        scores: {},
        savedRounds: [],
        selectedRoundId: '',
        editingShotId: '',
        lastUndo: null,
        draft: { startLie: 'tee', startDistance: '', endLie: 'fairway', endDistance: '', club: '', wind: '', penaltyStrokes: '', note: '', quality: '', contact: '', direction: '', flight: '', outcome: '' }
      };
    }
    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Object.assign(defaultState(), saved || {});
      } catch {
        return defaultState();
      }
    }
    function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    function course() { return COURSES.find(function(c) { return c.id === state.courseId; }) || COURSES[0]; }
    function tee() { return course().tees.find(function(t) { return t.name === state.teeName; }) || course().tees[0]; }
    function holeModel(n) { return course().holes[(n || state.hole) - 1]; }
    function lengthMeters(n) { return holeModel(n).tees[state.teeName] ? holeModel(n).tees[state.teeName].lengthMeters : 0; }
    function toYards(m) { return Math.round(m * 1.09361); }
    function displayLength(m) { return state.units === 'meters' ? m + 'm' : toYards(m) + 'yd'; }
    function signed(v, places) { return Number.isFinite(v) ? (v > 0 ? '+' : '') + v.toFixed(places == null ? 2 : places) : '--'; }
    function rating(v) { return Number.isFinite(v) ? v.toFixed(1) : '--'; }
    function currentPlayingHandicap() {
      if (state.playingHandicap !== '' && Number.isFinite(Number(state.playingHandicap))) return Number(state.playingHandicap);
      const hcp = Number(state.targetHandicap || 0);
      const t = tee();
      if (!Number.isFinite(t.slope)) return Math.round(hcp);
      return Math.round(hcp * t.slope / 113);
    }
    function strokesReceived(hole) {
      const ph = currentPlayingHandicap();
      if (!Number.isFinite(ph) || ph <= 0 || !Number.isFinite(hole.strokeIndex)) return 0;
      return Math.floor((ph + (18 - hole.strokeIndex)) / 18);
    }
    function expected(distance, lie) {
      const d = Number(distance);
      if (lie === 'holed') return 0;
      if (!Number.isFinite(d) || d <= 0) return null;
      if (lie === 'green') {
        if (d <= 2) return 1.03;
        if (d <= 5) return 1.12 + d * 0.035;
        if (d <= 10) return 1.32 + (d - 5) * 0.045;
        if (d <= 30) return 1.55 + (d - 10) * 0.018;
        if (d <= 80) return 1.91 + (d - 30) * 0.01;
        return Math.min(3.2, 2.35 + (d - 80) * 0.004);
      }
      const base = d <= 40 ? 2.15 + d * 0.012 : d <= 120 ? 2.63 + (d - 40) * 0.0065 : d <= 220 ? 3.15 + (d - 120) * 0.005 : d <= 340 ? 3.65 + (d - 220) * 0.0042 : 4.15 + (d - 340) * 0.0032;
      const penalty = { tee: -0.1, fairway: 0, rough: 0.22, sand: 0.34, recovery: 0.72 }[lie] || 0;
      return Math.min(6.2, Math.max(1.01, base + penalty));
    }
    function category(shot) {
      if (shot.startLie === 'green') return 'putting';
      if (shot.startLie === 'tee') return 'offTee';
      if (Number(shot.startDistance) <= 50) return 'short';
      return 'approach';
    }
    function sgFor(shot) {
      const start = expected(shot.startDistance, shot.startLie);
      const end = expected(shot.endDistance, shot.endLie);
      const penalties = Number(shot.penaltyStrokes || 0);
      return Number.isFinite(start) && Number.isFinite(end) ? start - (1 + end + (Number.isFinite(penalties) ? penalties : 0)) : null;
    }
    function totals(shots) {
      const out = { offTee: 0, approach: 0, short: 0, putting: 0, total: 0, count: 0 };
      (shots || state.shots).forEach(function(shot) {
        const value = sgFor(shot);
        if (!Number.isFinite(value)) return;
        const key = category(shot);
        out[key] += value;
        out.total += value;
        out.count += 1;
      });
      return out;
    }
    function grossScore() {
      return Object.values(state.scores).reduce(function(sum, score) { return sum + (Number(score) || 0); }, 0);
    }
    function holesPlayed() { return Object.values(state.scores).filter(Boolean).length; }
    function parTotal() { return course().holes.reduce(function(sum, hole) { return sum + hole.par; }, 0); }
    function differentialFor(score) {
      const t = tee();
      if (!Number.isFinite(score) || !Number.isFinite(t.courseRating) || !Number.isFinite(t.slope) || t.slope <= 0) return null;
      return (score - t.courseRating) * (113 / t.slope);
    }
    function handicapIndex() {
      const diffs = state.savedRounds.map(function(r) { return r.differential; }).filter(Number.isFinite).sort(function(a, b) { return a - b; });
      if (!diffs.length) return null;
      const take = diffs.length >= 20 ? 8 : Math.max(1, Math.ceil(diffs.length * 0.4));
      return diffs.slice(0, take).reduce(function(sum, v) { return sum + v; }, 0) / take;
    }
    function stablefordFor(hole, score) {
      if (!Number(score)) return 0;
      const net = Number(score) - strokesReceived(hole);
      return Math.max(0, 2 + (hole.par - net));
    }
    function stablefordTotal() {
      return course().holes.reduce(function(sum, hole) { return sum + stablefordFor(hole, state.scores[hole.holeNumber]); }, 0);
    }
    function setStatus(text) { document.getElementById('status').textContent = text; }
    function setMetric(id, value, places) {
      const el = document.getElementById(id);
      el.textContent = signed(value, places);
      el.className = value >= 0 ? 'good' : 'bad';
    }
    function draftValue() {
      return sgFor({
        startLie: state.draft.startLie,
        startDistance: state.draft.startDistance,
        endLie: state.draft.endLie,
        endDistance: state.draft.endLie === 'holed' ? 0 : state.draft.endDistance,
        penaltyStrokes: state.draft.penaltyStrokes
      });
    }
    function shotsForHole(n) {
      return state.shots.filter(function(s) { return s.hole === (n || state.hole); });
    }
    function totalPutts() {
      return state.shots.filter(function(s) { return s.startLie === 'green'; }).length;
    }
    function roundParPlayed() {
      return course().holes.reduce(function(sum, hole) { return sum + (state.scores[hole.holeNumber] ? hole.par : 0); }, 0);
    }
    function resetDraftForHole() {
      state.draft = Object.assign({}, defaultState().draft, {
        startLie: 'tee',
        startDistance: String(toYards(lengthMeters())),
        endLie: 'fairway',
        endDistance: '',
        club: '',
        note: '',
        wind: ''
      });
    }
    function shotContextLabel() {
      const count = shotsForHole().length + 1;
      const putts = shotsForHole().filter(function(s) { return s.startLie === 'green'; }).length + (state.draft.startLie === 'green' ? 1 : 0);
      if (state.draft.startLie === 'tee') return 'Shot ' + count + ' | Tee shot';
      if (state.draft.startLie === 'green') return 'Shot ' + count + ' | Putt ' + putts;
      return 'Shot ' + count + ' | ' + categoryLabel(category(state.draft));
    }
    function currentHoleSummary() {
      const shots = shotsForHole();
      const sg = totals(shots).total;
      const putts = shots.filter(function(s) { return s.startLie === 'green'; }).length;
      const penalties = shots.reduce(function(sum, s) { return sum + (Number(s.penaltyStrokes) || 0); }, 0);
      const missShot = shots.find(function(s) { return s.direction && s.direction !== 'online'; }) || shots.find(function(s) { return ['water', 'lost', 'penalty', 'trees', 'bunker'].includes(s.outcome); });
      return {
        score: state.scores[state.hole] || '--',
        sg: sg,
        putts: putts || '--',
        penalties: penalties,
        miss: missShot ? (missShot.direction || missShot.outcome) : '--'
      };
    }
    function suggestedEndLies() {
      if (state.draft.startLie === 'tee') return ['fairway', 'rough', 'recovery', 'sand', 'green', 'holed'];
      if (state.draft.startLie === 'green') return ['holed', 'green'];
      if (Number(state.draft.startDistance) <= 50) return ['green', 'sand', 'rough', 'holed', 'fairway', 'recovery'];
      return ['green', 'rough', 'sand', 'fairway', 'recovery', 'holed'];
    }
    function applyQuality(value) {
      state.draft.quality = value;
      if (value === 'great') Object.assign(state.draft, { contact: 'flush', direction: 'online', outcome: 'good', note: 'Great' });
      if (value === 'good') Object.assign(state.draft, { contact: 'good', direction: state.draft.direction || 'online', outcome: 'good', note: 'Good' });
      if (value === 'ok') Object.assign(state.draft, { outcome: 'safe', note: 'OK' });
      if (value === 'poor') Object.assign(state.draft, { contact: state.draft.contact || 'thin', outcome: state.draft.outcome || 'short', note: 'Poor' });
      if (value === 'penalty') Object.assign(state.draft, { outcome: 'penalty', penaltyStrokes: state.draft.penaltyStrokes || '1', note: 'Penalty' });
    }
    function normalizeDraft() {
      if (state.draft.startLie === 'green') state.draft.club = 'Putter';
      if (state.draft.startLie === 'green' && !state.draft.startDistance) state.draft.startDistance = '20';
      if (state.draft.endLie === 'holed') state.draft.endDistance = '0';
    }
    function draftIsValid() {
      return Number.isFinite(draftValue());
    }
    function lastShotOnHole(n) {
      return state.shots.find(function(s) { return s.hole === (n || state.hole); });
    }
    function completeHole() {
      const previousHole = state.hole;
      const lastShot = lastShotOnHole(previousHole);
      if (lastShot && lastShot.endLie === 'holed') {
        if (!state.scores[previousHole]) state.scores[previousHole] = String(shotsForHole(previousHole).length);
        setHole(previousHole + 1);
        setStatus('Hole ' + previousHole + ' complete. Now on hole ' + state.hole + '.');
        return;
      }
      state.draft.endLie = 'holed';
      state.draft.endDistance = '0';
      normalizeDraft();
      if (draftIsValid()) {
        addShot(true);
        return;
      }
      setHole(state.hole + 1);
      setStatus('Hole ' + previousHole + ' complete. Now on hole ' + state.hole + '.');
    }
    function setHole(n) {
      state.hole = Math.max(1, Math.min(course().holes.length, n));
      resetDraftForHole();
      render();
    }
    function addShot(advance) {
      normalizeDraft();
      if (state.draft.endLie === 'holed') state.draft.endDistance = '0';
      const wasEditing = Boolean(state.editingShotId);
      const previousHole = state.hole;
      const completesHole = state.draft.endLie === 'holed' && !wasEditing;
      const shot = Object.assign({}, state.draft, {
        id: state.editingShotId || String(Date.now()),
        hole: state.hole,
        courseId: state.courseId,
        teeName: state.teeName
      });
      const value = sgFor(shot);
      if (!Number.isFinite(value)) {
        setStatus('Add start and finish distances');
        return false;
      }
      if (state.editingShotId) {
        state.shots = state.shots.map(function(s) { return s.id === state.editingShotId ? shot : s; });
        state.editingShotId = '';
      } else {
        state.shots.unshift(shot);
      }
      if (completesHole && !state.scores[previousHole]) state.scores[previousHole] = String(shotsForHole(previousHole).length);
      state.lastUndo = { type: wasEditing ? 'edit' : 'add', shot: shot };
      if (advance || completesHole) {
        setHole(state.hole + 1);
      } else {
        state.draft = {
          startLie: shot.endLie === 'holed' ? 'tee' : shot.endLie,
          startDistance: shot.endLie === 'holed' ? String(toYards(lengthMeters())) : String(shot.endDistance),
          endLie: shot.endLie === 'holed' ? 'fairway' : 'green',
          endDistance: '',
          club: '',
          wind: '',
          penaltyStrokes: '',
          note: '',
          quality: '',
          contact: '',
          direction: '',
          flight: '',
          outcome: ''
        };
        render();
      }
      setStatus((advance || completesHole) ? 'Hole ' + previousHole + ' complete. Now on hole ' + state.hole + '.' : (wasEditing ? 'Shot updated: ' : 'Shot added: ') + signed(value));
      return true;
    }
    function saveRound() {
      const score = grossScore();
      const sg = totals();
      state.savedRounds.unshift({
        id: String(Date.now()),
        courseName: course().name,
        teeLabel: tee().label,
        date: state.date,
        playerName: state.playerName,
        roundMode: state.roundMode,
        roundNote: state.roundNote,
        score: score,
        differential: holesPlayed() === course().holes.length ? differentialFor(score) : null,
        sgTotal: sg.total,
        stableford: stablefordTotal(),
        shots: state.shots.slice(),
        scores: Object.assign({}, state.scores)
      });
      state.savedRounds = state.savedRounds.slice(0, 20);
      setStatus('Round saved');
      render();
    }
    function render() {
      const c = course();
      const t = tee();
      const hole = holeModel();
      document.body.dataset.mode = state.roundMode || 'full';
      document.getElementById('courseCount').textContent = COURSES.length + ' courses';
      document.getElementById('courseSelect').innerHTML = COURSES.map(function(item) { return '<option value="' + item.id + '">' + item.name + '</option>'; }).join('');
      document.getElementById('courseSelect').value = state.courseId;
      document.getElementById('teeSelect').innerHTML = c.tees.map(function(item) { return '<option value="' + item.name + '">' + item.label + ' | ' + item.totalLengthMeters + 'm | CR ' + rating(item.courseRating) + ' | Slope ' + (item.slope ?? '--') + '</option>'; }).join('');
      document.getElementById('teeSelect').value = state.teeName;
      document.getElementById('roundDate').value = state.date;
      document.getElementById('playerName').value = state.playerName || '';
      document.getElementById('roundMode').value = state.roundMode || 'full';
      document.getElementById('roundNote').value = state.roundNote || '';
      document.getElementById('targetHandicap').value = state.targetHandicap;
      document.getElementById('playingHandicap').value = state.playingHandicap;
      document.getElementById('unitSelect').value = state.units;
      document.getElementById('sourceText').textContent = 'Course data: ' + c.scorecardSource + '. Selected tee: course rating ' + rating(t.courseRating) + ', slope ' + (t.slope ?? '--') + '.';
      document.getElementById('holeTitle').textContent = state.hole;
      document.getElementById('holeSubtitle').textContent = c.name + ' | ' + t.label + ' tee';
      document.getElementById('holePar').textContent = hole.par;
      document.getElementById('holeSi').textContent = hole.strokeIndex || '--';
      document.getElementById('holeLength').textContent = displayLength(lengthMeters());
      document.getElementById('holeShots').textContent = strokesReceived(hole);
      const live = currentHoleSummary();
      document.getElementById('holeScore').textContent = live.score;
      document.getElementById('holeLiveSg').textContent = signed(live.sg);
      document.getElementById('holePutts').textContent = 'H' + (live.putts === '--' ? '0' : live.putts) + ' R' + totalPutts();
      document.getElementById('holeMiss').textContent = live.penalties ? 'P+' + live.penalties : live.miss;
      document.getElementById('holeGrid').innerHTML = c.holes.map(function(h) {
        const cls = (h.holeNumber === state.hole ? 'active ' : '') + (state.scores[h.holeNumber] ? 'scored' : '');
        return '<button class="' + cls + '" data-hole="' + h.holeNumber + '">' + h.holeNumber + '<br><small>Par ' + h.par + '</small></button>';
      }).join('');
      renderScoreButtons();
      renderShotEntry();
      renderMetrics();
      renderScorecard();
      renderShots();
      renderClubReview();
      renderPatternReview();
      renderRounds();
      renderRoundDetail();
      persist();
    }
    function renderMetrics() {
      const sg = totals();
      const score = grossScore();
      const diff = holesPlayed() === course().holes.length ? differentialFor(score) : null;
      setMetric('sgTotal', sg.total);
      document.getElementById('scoreTotal').textContent = score ? score + ' / ' + roundParPlayed() : '--';
      document.getElementById('puttsTotal').textContent = holesPlayed() ? totalPutts() + ' / ' + holesPlayed() : '--';
      document.getElementById('differential').textContent = Number.isFinite(diff) ? diff.toFixed(1) : '--';
      document.getElementById('holesThru').textContent = holesPlayed() ? holesPlayed() + ' / ' + course().holes.length : '--';
      setMetric('sgTee', sg.offTee);
      setMetric('sgApproach', sg.approach);
      setMetric('sgShort', sg.short);
      setMetric('sgPutting', sg.putting);
      document.getElementById('progressPill').textContent = Math.round((holesPlayed() / course().holes.length) * 100) + '%';
      const hole = holeModel();
      const currentScore = Number(state.scores[state.hole]);
      document.getElementById('netPill').textContent = currentScore ? 'Net ' + (currentScore - strokesReceived(hole)) : 'Net --';
      document.getElementById('stablefordPill').textContent = stablefordTotal() + ' pts';
      const target = Number(state.targetHandicap || 0);
      document.getElementById('targetPill').textContent = 'Target ' + target.toFixed(1) + ' | PH ' + currentPlayingHandicap();
      const holeSg = totals(state.shots.filter(function(s) { return s.hole === state.hole; })).total;
      document.getElementById('holeSgPill').textContent = 'Hole SG ' + signed(holeSg);
      renderLeaksChart(sg);
    }
    function renderLeaksChart(sg) {
      const rows = [
        ['Off tee', sg.offTee],
        ['Approach', sg.approach],
        ['Short', sg.short],
        ['Putting', sg.putting]
      ];
      const max = Math.max(0.25, ...rows.map(function(row) { return Math.abs(row[1]); }));
      document.getElementById('leaksChart').innerHTML = rows.map(function(row) {
        const width = Math.round((Math.abs(row[1]) / max) * 100);
        return '<div class="barRow"><span>' + row[0] + '</span><div class="barTrack"><div class="barFill ' + (row[1] < 0 ? 'neg' : '') + '" style="width:' + width + '%"></div></div><b class="' + (row[1] >= 0 ? 'good' : 'bad') + '">' + signed(row[1], 1) + '</b></div>';
      }).join('');
    }
    function renderScoreButtons() {
      const h = holeModel();
      const scores = [
        ['Eagle', h.par - 2],
        ['Birdie', h.par - 1],
        ['Par', h.par],
        ['Bogey', h.par + 1],
        ['Double', h.par + 2]
      ];
      document.getElementById('scoreButtons').innerHTML = scores.map(function(item) {
        return '<button data-quick-score="' + item[1] + '">' + item[0] + '<br><small>' + item[1] + '</small></button>';
      }).join('');
    }
    function renderShotEntry() {
      normalizeDraft();
      if (!state.draft.startDistance) state.draft.startDistance = state.draft.startLie === 'green' ? '20' : String(toYards(lengthMeters()));
      const start = document.getElementById('startLie');
      const end = document.getElementById('endLie');
      start.innerHTML = START_LIES.map(function(item) { return '<option value="' + item[0] + '">' + item[1] + '</option>'; }).join('');
      end.innerHTML = LIES.map(function(item) { return '<option value="' + item[0] + '">' + item[1] + '</option>'; }).join('');
      renderSelect('contact', CONTACT, state.draft.contact);
      renderSelect('direction', DIRECTION, state.draft.direction);
      renderSelect('flight', FLIGHT, state.draft.flight);
      renderSelect('outcome', OUTCOME, state.draft.outcome);
      renderSelect('club', [['', 'Not set']].concat(CLUBS.map(function(club) { return [club, club]; })), state.draft.club);
      renderSelect('wind', WINDS, state.draft.wind);
      ['startLie', 'startDistance', 'endLie', 'endDistance', 'club', 'wind', 'penaltyStrokes', 'note', 'contact', 'direction', 'flight', 'outcome'].forEach(function(id) { document.getElementById(id).value = state.draft[id] || ''; });
      document.getElementById('shotContext').textContent = shotContextLabel();
      document.getElementById('endDistance').disabled = state.draft.endLie === 'holed';
      document.getElementById('startDistanceLabel').textContent = state.draft.startLie === 'green' ? 'Start feet' : 'Start yards';
      document.getElementById('endDistanceLabel').textContent = state.draft.endLie === 'green' ? 'Finish feet' : state.draft.endLie === 'holed' ? 'Holed' : 'Finish yards';
      document.getElementById('startLieButtons').innerHTML = START_LIES.slice(0, 6).map(function(item) { return '<button class="' + (state.draft.startLie === item[0] ? 'active' : '') + '" data-start-lie="' + item[0] + '">' + item[1] + '</button>'; }).join('');
      const endOrder = suggestedEndLies().map(function(key) { return LIES.find(function(item) { return item[0] === key; }); }).filter(Boolean);
      document.getElementById('endLieButtons').innerHTML = endOrder.map(function(item) { return '<button class="' + (state.draft.endLie === item[0] ? 'active' : '') + '" data-end-lie="' + item[0] + '">' + item[1] + '</button>'; }).join('');
      document.getElementById('clubButtons').innerHTML = CLUBS.map(function(club) { return '<button data-club="' + club + '">' + club + '</button>'; }).join('');
      document.getElementById('noteButtons').innerHTML = NOTES.map(function(note) { return '<button data-note="' + note + '">' + note + '</button>'; }).join('');
      document.getElementById('puttButtons').innerHTML = PUTTS.map(function(item) { return '<button data-putt="' + item[1] + '">' + item[0] + '</button>'; }).join('') + '<button data-putt-holed="1">Holed</button>';
      document.getElementById('qualityButtons').innerHTML = QUALITIES.map(function(item) { return '<button class="' + (state.draft.quality === item[0] ? 'active' : '') + '" data-quality="' + item[0] + '">' + item[1] + '</button>'; }).join('');
      document.getElementById('contactButtons').innerHTML = CONTACT.slice(1, 7).map(function(item) { return '<button class="' + (state.draft.contact === item[0] ? 'active' : '') + '" data-contact="' + item[0] + '">' + item[1] + '</button>'; }).join('');
      document.getElementById('directionButtons').innerHTML = DIRECTION.slice(1, 7).map(function(item) { return '<button class="' + (state.draft.direction === item[0] ? 'active' : '') + '" data-direction="' + item[0] + '">' + item[1] + '</button>'; }).join('');
      document.getElementById('outcomeButtons').innerHTML = OUTCOME.slice(1, 7).map(function(item) { return '<button class="' + (state.draft.outcome === item[0] ? 'active' : '') + '" data-outcome="' + item[0] + '">' + item[1] + '</button>'; }).join('');
      const value = draftValue();
      document.getElementById('draftSg').textContent = 'Shot ' + signed(value);
      document.getElementById('draftSg').className = 'pill ' + (Number(value) >= 0 ? 'good' : 'bad');
      document.getElementById('addShot').textContent = state.editingShotId ? 'Update shot' : 'Add shot';
    }
    function renderSelect(id, options, value) {
      document.getElementById(id).innerHTML = options.map(function(item) { return '<option value="' + item[0] + '">' + item[1] + '</option>'; }).join('');
      document.getElementById(id).value = value || '';
    }
    function renderScorecard() {
      const rows = course().holes.map(function(h) {
        const score = state.scores[h.holeNumber] || '';
        const net = score ? Number(score) - strokesReceived(h) : '';
        return '<tr class="' + (h.holeNumber === state.hole ? 'activeRow' : '') + '"><td><button class="ghost" data-hole="' + h.holeNumber + '">' + h.holeNumber + '</button></td><td>' + h.par + '</td><td>' + h.strokeIndex + '</td><td>' + displayLength(lengthMeters(h.holeNumber)) + '</td><td>' + strokesReceived(h) + '</td><td><input data-score="' + h.holeNumber + '" type="number" inputmode="numeric" value="' + score + '"></td><td>' + (net || '--') + '</td><td>' + stablefordFor(h, score) + '</td></tr>';
      }).join('');
      document.getElementById('scorecard').innerHTML = '<thead><tr><th>Hole</th><th>Par</th><th>SI</th><th>Length</th><th>Shots</th><th>Gross</th><th>Net</th><th>Pts</th></tr></thead><tbody>' + rows + '</tbody>';
    }
    function renderShots() {
      const shots = state.shots.filter(function(s) { return s.hole === state.hole; });
      document.getElementById('shotList').innerHTML = shots.length ? shots.map(function(s) {
        const value = sgFor(s);
        const end = s.endLie === 'holed' ? 'holed' : s.endLie + ' ' + s.endDistance + (s.endLie === 'green' ? 'ft' : 'yd');
        const tags = [s.contact, s.direction, s.flight, s.outcome, s.wind ? 'wind ' + s.wind : '', Number(s.penaltyStrokes || 0) ? 'penalty +' + s.penaltyStrokes : ''].filter(Boolean).join(' | ');
        return '<article class="shot"><div class="shotTop"><div><strong>' + (s.club || 'Shot') + ' | ' + categoryLabel(category(s)) + '</strong><p class="shotMeta">' + s.startLie + ' ' + s.startDistance + (s.startLie === 'green' ? 'ft' : 'yd') + ' to ' + end + '</p></div><span class="pill ' + (value >= 0 ? 'good' : 'bad') + '">' + signed(value) + '</span></div><p class="shotMeta">' + (tags || 'No shot tags') + '</p><p class="shotMeta">' + (s.note || 'No note') + '</p><div class="actions"><button class="ghost" data-edit-shot="' + s.id + '">Edit</button><button class="ghost" data-delete-shot="' + s.id + '">Delete</button></div></article>';
      }).join('') : '<p>No shots on this hole yet.</p>';
    }
    function categoryLabel(key) {
      return { offTee: 'Off tee', approach: 'Approach', short: 'Short game', putting: 'Putting' }[key] || key;
    }
    function renderClubReview() {
      const clubs = new Map();
      state.shots.forEach(function(s) {
        if (!s.club) return;
        const value = sgFor(s);
        if (!Number.isFinite(value)) return;
        const row = clubs.get(s.club) || { count: 0, sg: 0 };
        row.count += 1;
        row.sg += value;
        clubs.set(s.club, row);
      });
      const rows = Array.from(clubs.entries()).map(function(entry) {
        return { club: entry[0], count: entry[1].count, sg: entry[1].sg, avg: entry[1].sg / entry[1].count };
      }).sort(function(a, b) { return a.avg - b.avg; });
      document.getElementById('clubCount').textContent = rows.length + ' clubs';
      document.getElementById('clubList').innerHTML = rows.length ? rows.map(function(r) {
        return '<article class="shot"><div class="shotTop"><div><strong>' + r.club + '</strong><p class="shotMeta">' + r.count + ' shots | avg ' + signed(r.avg) + '</p></div><span class="pill ' + (r.sg >= 0 ? 'good' : 'bad') + '">' + signed(r.sg) + '</span></div></article>';
      }).join('') : '<p>Add club names to build a club SG profile.</p>';
    }
    function renderPatternReview() {
      const groups = new Map();
      state.shots.forEach(function(s) {
        ['contact', 'direction', 'outcome'].forEach(function(field) {
          if (!s[field]) return;
          const value = sgFor(s);
          if (!Number.isFinite(value)) return;
          const key = field + ': ' + s[field];
          const row = groups.get(key) || { count: 0, sg: 0 };
          row.count += 1;
          row.sg += value;
          groups.set(key, row);
        });
      });
      const rows = Array.from(groups.entries()).map(function(entry) {
        return { label: entry[0], count: entry[1].count, sg: entry[1].sg, avg: entry[1].sg / entry[1].count };
      }).sort(function(a, b) { return a.avg - b.avg; }).slice(0, 6);
      document.getElementById('patternList').innerHTML = rows.length ? rows.map(function(r) {
        return '<article class="shot"><div class="shotTop"><div><strong>' + r.label + '</strong><p class="shotMeta">' + r.count + ' shots | avg ' + signed(r.avg) + '</p></div><span class="pill ' + (r.sg >= 0 ? 'good' : 'bad') + '">' + signed(r.sg) + '</span></div></article>';
      }).join('') : '<p>Add contact, direction, and outcome tags to reveal shot patterns.</p>';
    }
    function renderRounds() {
      document.getElementById('roundCount').textContent = state.savedRounds.length + ' saved';
      document.getElementById('roundList').innerHTML = state.savedRounds.length ? state.savedRounds.map(function(r) {
        const player = r.playerName ? r.playerName + ' | ' : '';
        return '<article class="shot"><div class="shotTop"><div><strong>' + r.courseName + '</strong><p class="shotMeta">' + player + r.date + ' | ' + r.teeLabel + ' | Score ' + r.score + ' | ' + r.stableford + ' pts</p></div><span class="pill">Diff ' + (Number.isFinite(r.differential) ? r.differential.toFixed(1) : '--') + '</span></div><p class="shotMeta">SG ' + signed(r.sgTotal) + '</p><button class="ghost" data-view-round="' + r.id + '">View</button></article>';
      }).join('') : '<p>No saved rounds yet.</p>';
    }
    function renderRoundDetail() {
      const round = state.savedRounds.find(function(r) { return r.id === state.selectedRoundId; });
      const el = document.getElementById('roundDetail');
      if (!round) {
        el.innerHTML = '';
        return;
      }
      const byCat = totals(round.shots || []);
      const topShots = (round.shots || []).slice().sort(function(a, b) { return (sgFor(a) || 0) - (sgFor(b) || 0); }).slice(0, 5);
      el.innerHTML = '<article class="shot"><div class="shotTop"><div><strong>' + round.courseName + '</strong><p class="shotMeta">Off tee ' + signed(byCat.offTee) + ' | Approach ' + signed(byCat.approach) + ' | Short ' + signed(byCat.short) + ' | Putting ' + signed(byCat.putting) + '</p></div><span class="pill">SG ' + signed(round.sgTotal) + '</span></div>' + topShots.map(function(s) { return '<p class="shotMeta">' + (s.club || 'Shot') + ' H' + s.hole + ' | ' + [s.contact, s.direction, s.outcome].filter(Boolean).join(' | ') + ' | ' + signed(sgFor(s)) + '</p>'; }).join('') + '</article>';
    }
    function csvEscape(value) {
      const text = String(value ?? '');
      return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
    }
    function exportCsv() {
      const rows = [['player','date','course','tee','mode','round_note','hole','club','start_lie','start_distance','end_lie','end_distance','quality','contact','direction','flight','wind','outcome','penalty_strokes','note','category','sg']];
      state.shots.forEach(function(s) {
        rows.push([state.playerName, state.date, course().name, tee().label, state.roundMode, state.roundNote, s.hole, s.club, s.startLie, s.startDistance, s.endLie, s.endDistance, s.quality, s.contact, s.direction, s.flight, s.wind, s.outcome, s.penaltyStrokes || 0, s.note, category(s), signed(sgFor(s))]);
      });
      const blob = new Blob([rows.map(function(row) { return row.map(csvEscape).join(','); }).join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mmg-player-strokes-gained-' + state.date + '.csv';
      link.click();
      URL.revokeObjectURL(url);
      setStatus('CSV exported');
    }
    document.addEventListener('input', function(event) {
      const id = event.target.id;
      let handled = false;
      if (id === 'playerName') { state.playerName = event.target.value; handled = true; }
      if (id === 'roundNote') { state.roundNote = event.target.value; handled = true; }
      if (id === 'roundDate') { state.date = event.target.value; handled = true; }
      if (id === 'targetHandicap') { state.targetHandicap = event.target.value; handled = true; }
      if (id === 'playingHandicap') { state.playingHandicap = event.target.value; handled = true; }
      if (['startLie', 'startDistance', 'endLie', 'endDistance', 'club', 'wind', 'penaltyStrokes', 'note', 'quality', 'contact', 'direction', 'flight', 'outcome'].includes(id)) { state.draft[id] = event.target.value; handled = true; }
      if (id === 'startLie' || id === 'endLie') normalizeDraft();
      if (event.target.dataset.score) { state.scores[event.target.dataset.score] = event.target.value; handled = true; }
      if (handled) render();
    });
    document.addEventListener('change', function(event) {
      if (event.target.id === 'courseSelect') {
        state.courseId = event.target.value;
        state.teeName = course().tees[0].name;
        state.hole = 1;
        state.shots = [];
        state.scores = {};
        resetDraftForHole();
      }
      if (event.target.id === 'teeSelect') {
        state.teeName = event.target.value;
        resetDraftForHole();
      }
      if (event.target.id === 'unitSelect') state.units = event.target.value;
      if (event.target.id === 'roundMode') state.roundMode = event.target.value;
      render();
    });
    document.addEventListener('click', function(event) {
      const hole = event.target.closest('[data-hole]')?.dataset.hole;
      if (hole) setHole(Number(hole));
      if (event.target.dataset.quickScore) {
        state.scores[state.hole] = event.target.dataset.quickScore;
        render();
      }
      if (event.target.dataset.startLie) {
        state.draft.startLie = event.target.dataset.startLie;
        if (state.draft.startLie === 'tee') state.draft.startDistance = String(toYards(lengthMeters()));
        normalizeDraft();
        render();
      }
      if (event.target.dataset.endLie) {
        state.draft.endLie = event.target.dataset.endLie;
        normalizeDraft();
        render();
      }
      if (event.target.dataset.club) {
        state.draft.club = event.target.dataset.club;
        render();
      }
      if (event.target.dataset.quality) {
        applyQuality(event.target.dataset.quality);
        render();
      }
      if (event.target.dataset.putt) {
        state.draft.startLie = 'green';
        state.draft.startDistance = event.target.dataset.putt;
        state.draft.endLie = 'holed';
        state.draft.endDistance = '0';
        state.draft.club = 'Putter';
        if (event.target.textContent === 'Gimmie') state.draft.note = state.draft.note ? state.draft.note + ', Gimmie' : 'Gimmie';
        render();
      }
      if (event.target.dataset.puttHoled) {
        state.draft.endLie = 'holed';
        state.draft.endDistance = '0';
        state.draft.club = 'Putter';
        render();
      }
      if (event.target.dataset.note) {
        state.draft.note = state.draft.note ? state.draft.note + ', ' + event.target.dataset.note : event.target.dataset.note;
        render();
      }
      if (event.target.dataset.contact) {
        state.draft.contact = event.target.dataset.contact;
        render();
      }
      if (event.target.dataset.direction) {
        state.draft.direction = event.target.dataset.direction;
        render();
      }
      if (event.target.dataset.outcome) {
        state.draft.outcome = event.target.dataset.outcome;
        if (['water', 'lost', 'penalty'].includes(state.draft.outcome) && !state.draft.penaltyStrokes) state.draft.penaltyStrokes = '1';
        render();
      }
      if (event.target.dataset.editShot) {
        const shot = state.shots.find(function(s) { return s.id === event.target.dataset.editShot; });
        if (shot) {
          state.editingShotId = shot.id;
          state.hole = shot.hole;
          state.draft = Object.assign({}, defaultState().draft, shot);
          normalizeDraft();
          setStatus('Editing shot');
          render();
          setTimeout(function() { document.getElementById('shotEntryPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 0);
        }
      }
      if (event.target.dataset.deleteShot) {
        state.shots = state.shots.filter(function(s) { return s.id !== event.target.dataset.deleteShot; });
        setStatus('Shot deleted');
        render();
      }
      if (event.target.dataset.viewRound) {
        state.selectedRoundId = event.target.dataset.viewRound;
        render();
      }
    });
    document.getElementById('prevHole').addEventListener('click', function() { setHole(state.hole - 1); });
    document.getElementById('nextHole').addEventListener('click', function() { setHole(state.hole + 1); });
    document.getElementById('addShot').addEventListener('click', function() { addShot(false); });
    document.getElementById('addShotNext').addEventListener('click', function() { addShot(true); });
    document.getElementById('undoShot').addEventListener('click', function() {
      if (!state.shots.length) {
        setStatus('No shot to undo');
        return;
      }
      const shot = state.shots.shift();
      state.hole = shot.hole;
      state.draft = Object.assign({}, defaultState().draft, shot);
      state.editingShotId = '';
      setStatus('Last shot undone');
      render();
    });
    document.getElementById('holedButton').addEventListener('click', function() {
      completeHole();
    });
    document.getElementById('saveRound').addEventListener('click', saveRound);
    document.getElementById('clearRound').addEventListener('click', function() {
      if (!confirm('Clear current round shots and scores?')) return;
      state.shots = [];
      state.scores = {};
      state.hole = 1;
      state.draft = defaultState().draft;
      setStatus('Current round cleared');
      render();
    });
    document.getElementById('exportData').addEventListener('click', function() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mmg-player-strokes-gained-' + state.date + '.json';
      link.click();
      URL.revokeObjectURL(url);
      setStatus('Exported');
    });
    document.getElementById('exportCsv').addEventListener('click', exportCsv);
    document.getElementById('importButton').addEventListener('click', function() { document.getElementById('importFile').click(); });
    document.getElementById('importFile').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const imported = JSON.parse(reader.result);
          Object.assign(state, defaultState(), imported);
          setStatus('Imported');
          render();
        } catch {
          setStatus('Import failed');
        }
      };
      reader.readAsText(file);
    });
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('./sw.js').catch(function() {});
    }
    render();
  </script>
</body>
</html>`

const manifest = JSON.stringify(
  {
    name: 'MMG Player Strokes Gained',
    short_name: 'MMG SG',
    start_url: './index.html',
    scope: './',
    display: 'standalone',
    background_color: '#f7f4ed',
    theme_color: '#163b32',
    icons: [
      { src: './icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
  },
  null,
  2,
)

const serviceWorker = `const CACHE = 'mmg-player-strokes-gained-v8';
const ASSETS = ['./index.html', './manifest.webmanifest', './icon.svg', './favicon.svg'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
`

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="92" fill="#163b32"/>
  <path d="M92 383c76-16 134-60 172-132 20 51 64 91 132 119-78 68-207 82-304 13z" fill="#f7f4ed"/>
  <path d="M119 118h162v41H119zm0 78h211v41H119zm0 78h125v41H119z" fill="#f7f4ed"/>
  <circle cx="377" cy="121" r="46" fill="#bc963c"/>
  <path d="M356 121c0-14 11-25 25-25h14v21h-14c-3 0-5 2-5 5s2 5 5 5h12c15 0 27 12 27 27s-12 27-27 27h-35v-21h35c3 0 6-3 6-6s-3-6-6-6h-12c-14 0-25-12-25-27z" fill="#163b32" opacity=".92"/>
</svg>
`

await mkdir(outputDir, { recursive: true })
await writeFile(outputPath, html, 'utf8')
await writeFile(manifestPath, manifest, 'utf8')
await writeFile(serviceWorkerPath, serviceWorker, 'utf8')
await writeFile(iconPath, icon, 'utf8')
await writeFile(faviconPath, icon, 'utf8')
console.log(outputPath)
console.log(`Validated ${MALLORCA_TRACKER_COURSES.length} courses`)
