const orbit1 = document.getElementById("orbit1");
const orbit2 = document.getElementById("orbit2");
const orbit3 = document.getElementById("orbit3");
const orbitSystem = document.getElementById("orbitSystem");
const stage = document.getElementById("stage");
const photoCard = document.getElementById("photoCard");
const flipBtn = document.getElementById("flipBtn");

const orbitData = [
  {
    el: orbit1,
    radiusDesktopX: 150,
    radiusDesktopY: 110,
    radiusMobileX: 95,
    radiusMobileY: 70,
    speed: 0.08,
    words: [
      { text: "Perdón", type: "big" },
      { text: "Lo siento", type: "big" },
      { text: "Perdóname", type: "" },
      { text: "Fallé", type: "soft" },
      { text: "Me equivoqué", type: "" },
      { text: "Discúlpame", type: "" }
    ]
  },
  {
    el: orbit2,
    radiusDesktopX: 240,
    radiusDesktopY: 180,
    radiusMobileX: 140,
    radiusMobileY: 105,
    speed: -0.05,
    words: [
      { text: "Estoy aquí", type: "" },
      { text: "Debí decirte la verdad", type: "" },
      { text: "No quise herirte", type: "soft" },
      { text: "No estuvo bien", type: "soft" },
      { text: "Quiero arreglarlo", type: "" },
      { text: "No quiero perderte", type: "" },
      { text: "En serio lo siento", type: "" }
    ]
  },
  {
    el: orbit3,
    radiusDesktopX: 320,
    radiusDesktopY: 250,
    radiusMobileX: 180,
    radiusMobileY: 140,
    speed: 0.03,
    words: [
      { text: "Te pido perdón", type: "big" },
      { text: "Dame una oportunidad", type: "" },
      { text: "Te hablo con sinceridad", type: "soft" },
      { text: "No era mi intención", type: "" },
      { text: "Fue un error", type: "" },
      { text: "Perdón de corazón", type: "big" }
    ]
  }
];

function isMobile() {
  return window.innerWidth <= 600;
}

function createWord(item) {
  const span = document.createElement("span");
  span.className = `word ${item.type}`;
  span.textContent = item.text;
  return span;
}

function setupOrbits() {
  const mobile = isMobile();

  orbitData.forEach((orbit) => {
    orbit.el.innerHTML = "";

    orbit.wordObjects = orbit.words.map((word, index) => {
      const span = createWord(word);
      orbit.el.appendChild(span);

      return {
        el: span,
        angle: (Math.PI * 2 * index) / orbit.words.length
      };
    });

    orbit.radiusX = mobile ? orbit.radiusMobileX : orbit.radiusDesktopX;
    orbit.radiusY = mobile ? orbit.radiusMobileY : orbit.radiusDesktopY;
  });
}

let pointerOffsetX = 0;
let pointerOffsetY = 0;
let targetOffsetX = 0;
let targetOffsetY = 0;

let tiltX = 0;
let tiltY = 0;
let targetTiltX = 0;
let targetTiltY = 0;

function updatePointer(clientX, clientY) {
  const rect = stage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = clientX - centerX;
  const dy = clientY - centerY;

  targetOffsetX = dx * 0.045;
  targetOffsetY = dy * 0.025;

  targetTiltY = dx * 0.01;
  targetTiltX = -dy * 0.01;
}

window.addEventListener("mousemove", (e) => {
  updatePointer(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

function resetPointer() {
  targetOffsetX = 0;
  targetOffsetY = 0;
  targetTiltX = 0;
  targetTiltY = 0;
}

window.addEventListener("mouseleave", resetPointer);
window.addEventListener("touchend", resetPointer);

function renderOrbits() {
  pointerOffsetX += (targetOffsetX - pointerOffsetX) * 0.06;
  pointerOffsetY += (targetOffsetY - pointerOffsetY) * 0.06;

  tiltX += (targetTiltX - tiltX) * 0.06;
  tiltY += (targetTiltY - tiltY) * 0.06;

  orbitSystem.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  orbitData.forEach((orbit, orbitIndex) => {
    const orbitInfluence = orbitIndex + 1;

    orbit.wordObjects.forEach((wordObj) => {
      wordObj.angle += orbit.speed * 0.01;

      const x = Math.cos(wordObj.angle) * orbit.radiusX + pointerOffsetX * (0.12 * orbitInfluence);
      const y = Math.sin(wordObj.angle) * orbit.radiusY + pointerOffsetY * (0.10 * orbitInfluence);

      wordObj.el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  requestAnimationFrame(renderOrbits);
}

flipBtn.addEventListener("click", () => {
  photoCard.classList.toggle("flipped");
});

photoCard.addEventListener("click", () => {
  photoCard.classList.toggle("flipped");
});

window.addEventListener("resize", setupOrbits);

setupOrbits();
renderOrbits();