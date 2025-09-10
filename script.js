let fields = ['cross', null, null, 'circle', null, null, null, null, null];

function init() {
  render();
}

function render() {
  const contentDiv = document.getElementById("content");

  let tableHTML = "<table>";
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
      tableHTML += `<td>${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  contentDiv.innerHTML = tableHTML;
}

function createSpinningFillCircleSVG(durationMs = 800) {
  const dur = (durationMs / 1000) + 's';
  return `
<svg width="70" height="70" viewBox="0 0 70 70"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated circle">
  <!-- dezenter Hintergrundkreis -->
  <circle cx="35" cy="35" r="30" fill="none" stroke="#00b0ef" stroke-width="10" opacity="0.15" />

  <!-- rechter Halbkreis: von oben nach unten im Uhrzeigersinn -->
  <path d="M35 5 A30 30 0 0 1 35 65"
        fill="none" stroke="#00b0ef" stroke-width="10" stroke-linecap="round"
        pathLength="100" stroke-dasharray="0 100">
    <animate attributeName="stroke-dasharray"
             from="0 100" to="100 100"
             dur="${dur}" fill="freeze" />
  </path>

  <!-- linker Halbkreis: von oben nach unten gegen den Uhrzeigersinn -->
  <path d="M35 5 A30 30 0 0 0 35 65"
        fill="none" stroke="#00b0ef" stroke-width="10" stroke-linecap="round"
        pathLength="100" stroke-dasharray="0 100">
    <animate attributeName="stroke-dasharray"
             from="0 100" to="100 100"
             dur="${dur}" fill="freeze" />
  </path>
</svg>`;
}

function createFillingCrossSVG(durationMs = 800) {
  const dur = (durationMs / 1000) + 's';
  return `
<svg width="70" height="70" viewBox="0 0 70 70"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated X">
  <g stroke="#FFC000" stroke-width="10" stroke-linecap="round" fill="none">
    <!-- Diagonale 1 -->
    <line x1="15" y1="15" x2="55" y2="55" pathLength="100" stroke-dasharray="0 100">
      <animate attributeName="stroke-dasharray"
               from="0 100" to="100 100"
               dur="${dur}" fill="freeze" />
    </line>
    <!-- Diagonale 2 -->
    <line x1="55" y1="15" x2="15" y2="55" pathLength="100" stroke-dasharray="0 100">
      <animate attributeName="stroke-dasharray"
               from="0 100" to="100 100"
               dur="${dur}" fill="freeze" />
    </line>
  </g>
</svg>`;
}