// Game state: adjust these starting values and action rewards as needed.
const gameState = {
  day: 1,
  budget: 100,
  builds: 0,
  sanitation: 0,
  agriculture: 0,
  education: 0
};

const costs = {
  waterPump: 40,
  sanitationStation: 30,
  advertise: 15,
  educate: 20
};

const rewards = {
  waterPump: { sanitation: 2, agriculture: 2 },
  sanitationStation: { sanitation: 3 },
  advertise: { budget: 30 },
  educate: { education: 2 }
};

const elements = {
  day: document.querySelector("#day-value"),
  budget: document.querySelector("#budget-value"),
  sanitation: document.querySelector("#sanitation-value"),
  agriculture: document.querySelector("#agriculture-value"),
  education: document.querySelector("#education-value"),
  status: document.querySelector("#status-message")
};

function renderState() {
  elements.day.textContent = gameState.day;
  elements.budget.textContent = `$${gameState.budget}`;
  elements.sanitation.textContent = gameState.sanitation;
  elements.agriculture.textContent = gameState.agriculture;
  elements.education.textContent = gameState.education;
}

function setStatus(message) {
  elements.status.textContent = message;
}

function spendBudget(cost) {
  if (gameState.budget < cost) {
    setStatus(`Not enough budget. You need $${cost}, but have $${gameState.budget}.`);
    return false;
  }
  gameState.budget -= cost;
  return true;
}

function buildWaterPump() {
  if (!spendBudget(costs.waterPump)) return;
  gameState.builds += 1;
  gameState.sanitation += rewards.waterPump.sanitation;
  gameState.agriculture += rewards.waterPump.agriculture;
  renderState();
  setStatus("Water pump built! Sanitation and agriculture increased.");
}

function buildSanitationStation() {
  if (!spendBudget(costs.sanitationStation)) return;
  gameState.builds += 1;
  gameState.sanitation += rewards.sanitationStation.sanitation;
  renderState();
  setStatus("Sanitation station built! Sanitation increased.");
}

function advertise() {
  if (!spendBudget(costs.advertise)) return;
  gameState.budget += rewards.advertise.budget;
  renderState();
  setStatus(`Advertising campaign complete. Budget increased by $${rewards.advertise.budget - costs.advertise} net.`);
}

function educate() {
  if (!spendBudget(costs.educate)) return;
  gameState.education += rewards.educate.education;
  renderState();
  setStatus("Education campaign complete! Education increased.");
}

document.querySelector("#build-pump").addEventListener("click", buildWaterPump);
document.querySelector("#build-sanitation").addEventListener("click", buildSanitationStation);
document.querySelector("#advertise").addEventListener("click", advertise);
document.querySelector("#educate").addEventListener("click", educate);

document.querySelector("#next-day").addEventListener("click", () => {
  gameState.day += 1;
  renderState();
  setStatus(`Day ${gameState.day} started. Choose your next action.`);
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.dataset.scroll;
    const target = section === "builds"
      ? document.querySelector("#build-pump")
      : section === "sanitation"
        ? document.querySelector("#build-sanitation")
        : section === "agriculture"
          ? document.querySelector("#build-pump")
          : document.querySelector("#educate");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.focus();
  });
});

renderState();
