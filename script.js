let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'circle';
let gameOver = false;

const WIN_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8],      // Reihen
  [0,3,6], [1,4,7], [2,5,8],      // Spalten
  [0,4,8], [2,4,6]                // Diagonalen
];

function init() {
  render();
}

function render() {
  const contentDiv = document.getElementById("content");

  let tableHTML = '<div id="boardWrap" style="position:relative; display:inline-block;">';
  tableHTML += "<table>";
  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = "";
      if (fields[index] === "circle") {
        symbol = createSpinningFillCircleSVG();
      } else if (fields[index] === "cross") {
        symbol = createFillingCrossSVG();
      }
      // onclick nur, wenn Feld leer UND Spiel nicht vorbei
      const clickHandler = (!gameOver && fields[index] === null) ? `onclick="handleClick(${index}, this)"` : "";
      tableHTML += `<td ${clickHandler} data-index="${index}">${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  // SVG-Overlay für mögliche Gewinnlinie (leer, wird später gefüllt)
  tableHTML += `
    <svg class="win-overlay" id="winOverlay"
         style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none;"
         viewBox="0 0 1 1" preserveAspectRatio="none"></svg>
  `;
  tableHTML += "</div>";

  contentDiv.innerHTML = tableHTML;
}

function handleClick(index, tdElement) {
  if (gameOver || fields[index] !== null) return;

  // Zug setzen
  fields[index] = currentPlayer;

  // Symbol einfügen
  if (currentPlayer === 'circle') {
    tdElement.innerHTML = createSpinningFillCircleSVG();
    currentPlayer = 'cross';
  } else {
    tdElement.innerHTML = createFillingCrossSVG();
    currentPlayer = 'circle';
  }

  // Klick für dieses Feld deaktivieren
  tdElement.removeAttribute("onclick");

  // Gewinner prüfen und ggf. Linie zeichnen
  const result = checkWinner();
  if (result) {
    gameOver = true;
    drawWinLine(result.combo);
    // Optional: restliche Klicks deaktivieren
    disableAllClicks();
  }
}

function checkWinner() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return { winner: fields[a], combo };
    }
  }
  return null;
}

function disableAllClicks() {
  document.querySelectorAll('#content td[onclick]').forEach(td => td.removeAttribute('onclick'));
}

/**
 * Zeichnet eine weiße Linie durch die 3 Gewinnfelder.
 * Wir berechnen die Mittelpunkte der ersten und letzten Zelle der Gewinn-Kombination
 * und zeichnen eine Linie darüber (SVG-Overlay).
 */
function drawWinLine(combo) {
  const content = document.getElementById('content');
  const boardWrap = document.getElementById('boardWrap');
  const overlay = document.getElementById('winOverlay');
  if (!content || !boardWrap || !overlay) return;

  const tds = content.querySelectorAll('td');
  const contRect = boardWrap.getBoundingClientRect();

  // Hilfsfunktion: Mittelpunkt einer Zelle relativ zu boardWrap
  const centerOf = (idx) => {
    const r = tds[idx].getBoundingClientRect();
    return {
      x: r.left - contRect.left + r.width / 2,
      y: r.top  - contRect.top  + r.height / 2
    };
  };

  // Für saubere Endpunkte: nimm erstes und letztes Feld der Kombo
  const p1 = centerOf(combo[0]);
  const p3 = centerOf(combo[2]);

  // Overlay-SVG an reale Größe anpassen
  const width  = contRect.width;
  const height = contRect.height;
  overlay.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Linie zeichnen (mit leichter Rundung und Animation)
  overlay.innerHTML = `
    <line x1="${p1.x}" y1="${p1.y}" x2="${p1.x}" y2="${p1.y}"
          stroke="white" stroke-width="8" stroke-linecap="round">
      <animate attributeName="x2" to="${p3.x}" dur="0.2s" fill="freeze" />
      <animate attributeName="y2" to="${p3.y}" dur="0.2s" fill="freeze" />
    </line>
  `;
}

/* ==== Deine bestehenden SVG-Erzeuger bleiben gleich ==== */
function createSpinningFillCircleSVG(durationMs = 400) {
  const dur = (durationMs / 1000) + 's';
  return `
<svg width="70" height="70" viewBox="0 0 70 70"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated circle">
  <circle cx="35" cy="35" r="30" fill="none" stroke="#00b0ef" stroke-width="10" opacity="0.15" />
  <path d="M35 5 A30 30 0 0 1 35 65"
        fill="none" stroke="#00b0ef" stroke-width="10" stroke-linecap="round"
        pathLength="100" stroke-dasharray="0 100">
    <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="${dur}" fill="freeze" />
  </path>
  <path d="M35 5 A30 30 0 0 0 35 65"
        fill="none" stroke="#00b0ef" stroke-width="10" stroke-linecap="round"
        pathLength="100" stroke-dasharray="0 100">
    <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="${dur}" fill="freeze" />
  </path>
</svg>`;
}

function createFillingCrossSVG(durationMs = 400) {
  const dur = (durationMs / 1000) + 's';
  return `
<svg width="70" height="70" viewBox="0 0 70 70"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated X">
  <g stroke="#FFC000" stroke-width="10" stroke-linecap="round" fill="none">
    <line x1="15" y1="15" x2="55" y2="55" pathLength="100" stroke-dasharray="0 100">
      <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="${dur}" fill="freeze" />
    </line>
    <line x1="55" y1="15" x2="15" y2="55" pathLength="100" stroke-dasharray="0 100">
      <animate attributeName="stroke-dasharray" from="0 100" to="100 100" dur="${dur}" fill="freeze" />
    </line>
  </g>
</svg>`;
}