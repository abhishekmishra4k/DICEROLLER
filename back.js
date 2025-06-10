function random() {
  return Math.floor(Math.random() * 6) + 1;
}
const input = document.getElementById("dieInput");
let inputvalue = 0;
input.addEventListener("input", function () {
  inputvalue = input.value;
});
const rollButton = document.getElementById("rollButton");
const resultBackdrop = document.getElementById("resultBackdrop");
const resultModal = document.getElementById("resultModal");
const resultMessage = document.getElementById("resultMessage");
const confetti = document.getElementById("confetti");
const closeModal = document.getElementById("closeModal");
const loadingBackdrop = document.getElementById("loadingBackdrop");
const rollingDieContainer = document.getElementById("rollingDieContainer");
const loadingText = document.getElementById("loadingText");
const die3d = document.getElementById("die3d");

// Helper: dot positions for each face
const dieFaceDots = [
  [],
  [[50, 50]],
  [
    [25, 25],
    [75, 75],
  ],
  [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  [
    [25, 25],
    [75, 25],
    [25, 50],
    [75, 50],
    [25, 75],
    [75, 75],
  ],
];

// Confetti generator
function launchConfetti() {
  confetti.innerHTML = "";
  confetti.style.display = "block";
  const colors = [
    "#ffeb3b",
    "#ff512f",
    "#dd2476",
    "#00e1ff",
    "#7cffcb",
    "#fff",
  ];
  for (let i = 0; i < 60; i++) {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = Math.random() * 100 + "%";
    div.style.top = "-20px";
    div.style.width = 8 + Math.random() * 8 + "px";
    div.style.height = 12 + Math.random() * 12 + "px";
    div.style.background = colors[Math.floor(Math.random() * colors.length)];
    div.style.opacity = 0.85;
    div.style.borderRadius = "3px";
    div.style.transform = `rotate(${Math.random() * 360}deg)`;
    div.style.animation = `fallConfetti ${
      2 + Math.random() * 1.5
    }s cubic-bezier(.62,.28,.23,.99) forwards`;
    div.style.animationDelay = Math.random() * 0.5 + "s";
    confetti.appendChild(div);
  }
}

// Confetti fall animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fallConfetti {
  0% { transform: translateY(0) scale(1) rotate(0deg);}
  80% { opacity: 1;}
  100% { transform: translateY(320px) scale(0.8) rotate(360deg); opacity: 0;}
}`;
document.head.appendChild(style);

function getDieFaceSVG(num) {
  // Returns SVG for die face 1-6
  const dot = (cx, cy) =>
    `<circle class='die-face-dot' cx='${cx}' cy='${cy}' r='10'/>`;
  let dots = [];
  if (num === 1) dots = [dot(50, 50)];
  if (num === 2) dots = [dot(25, 25), dot(75, 75)];
  if (num === 3) dots = [dot(25, 25), dot(50, 50), dot(75, 75)];
  if (num === 4) dots = [dot(25, 25), dot(75, 25), dot(25, 75), dot(75, 75)];
  if (num === 5)
    dots = [dot(25, 25), dot(75, 25), dot(50, 50), dot(25, 75), dot(75, 75)];
  if (num === 6)
    dots = [
      dot(25, 25),
      dot(75, 25),
      dot(25, 50),
      dot(75, 50),
      dot(25, 75),
      dot(75, 75),
    ];
  return `<svg width='100' height='100' viewBox='0 0 100 100'>
    <rect x='10' y='10' width='80' height='80' rx='16' fill='#fff' stroke='#232526' stroke-width='4'/>
    ${dots.join("")}
  </svg>`;
}

function renderDieFace(faceElem, value) {
  faceElem.innerHTML = "";
  dieFaceDots[value].forEach(([cx, cy]) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.position = "absolute";
    dot.style.left = `calc(${cx}% - 9px)`;
    dot.style.top = `calc(${cy}% - 9px)`;
    faceElem.appendChild(dot);
  });
}

function setDieFaces(val) {
  // val: 1-6
  const faces = die3d.querySelectorAll(".die-face");
  // Order: front, back, right, left, top, bottom
  // Map die value to correct face orientation
  // 1: front, 2: right, 3: top, 4: left, 5: bottom, 6: back
  renderDieFace(faces[0], val); // front
  renderDieFace(faces[1], val === 6 ? 6 : 1); // back (show 6 for 6, else 1)
  renderDieFace(faces[2], val === 2 ? 2 : 1); // right
  renderDieFace(faces[3], val === 4 ? 4 : 1); // left
  renderDieFace(faces[4], val === 3 ? 3 : 1); // top
  renderDieFace(faces[5], val === 5 ? 5 : 1); // bottom
}

// 3D Die rotation for each face up
const dieRotations = {
  1: "rotateX(0deg) rotateY(0deg)",
  2: "rotateX(0deg) rotateY(-90deg)",
  3: "rotateX(90deg) rotateY(0deg)",
  4: "rotateX(0deg) rotateY(90deg)",
  5: "rotateX(-90deg) rotateY(0deg)",
  6: "rotateX(0deg) rotateY(180deg)",
};

function showLoadingDie3D() {
  loadingBackdrop.style.display = "flex";
  // Show a random face before rolling for a more natural effect
  const randomStart = Math.floor(Math.random() * 6) + 1;
  setDieFaces(randomStart);
  die3d.style.transform = dieRotations[randomStart] || dieRotations[1];
  die3d.classList.add("rolling");
  loadingText.textContent = "Rolling the die...";
}

function showLoadingDie() {
  loadingBackdrop.style.display = "flex";
  rollingDieContainer.innerHTML = getDieFaceSVG(
    Math.floor(Math.random() * 6) + 1
  );
  rollingDieContainer.firstElementChild.classList.add("rolling-die");
  loadingText.textContent = "Rolling the die...";
}

function rollDie3DTo(resultVal) {
  // Animate roll, then land on resultVal
  die3d.classList.add("rolling");
  setTimeout(() => {
    die3d.classList.remove("rolling");
    setDieFaces(resultVal);
    die3d.style.transform = dieRotations[resultVal] || dieRotations[1];
    loadingText.textContent = "Result:";
  }, 1200);
}

function showResultDie(num) {
  rollingDieContainer.innerHTML = getDieFaceSVG(num);
  rollingDieContainer.firstElementChild.classList.remove("rolling-die");
}

rollButton.addEventListener("click", function () {
  // Start with a random face and rolling animation
  showLoadingDie3D();
  resultBackdrop.style.display = "none";
  const userVal = Math.max(1, Math.min(6, parseInt(inputvalue) || 1));
  setTimeout(() => {
    const r = random();
    die3d.classList.remove("rolling");
    setDieFaces(r);
    die3d.style.transform = dieRotations[r] || dieRotations[1];
    loadingText.textContent = "Result:";
    setTimeout(() => {
      loadingBackdrop.style.display = "none";
      if (parseInt(inputvalue) === r) {
        resultMessage.textContent = "🎉 You guessed it right!";
        confetti.style.display = "block";
        launchConfetti();
      } else {
        resultMessage.textContent = `❌ Wrong guess! The number was ${r}`;
        confetti.style.display = "none";
      }
      resultBackdrop.style.display = "flex";
    }, 1300);
  }, 5000);
});

// Close modal
closeModal.addEventListener("click", function () {
  resultBackdrop.style.display = "none";
  confetti.innerHTML = "";
  confetti.style.display = "none";
});
