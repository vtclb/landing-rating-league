const revealItems = document.querySelectorAll(".reveal");
const kyivTimeZone = "Europe/Kyiv";
const gameSchedule = [
  { day: 3, hour: 19, minute: 0 },
  { day: 5, hour: 19, minute: 0 },
  { day: 0, hour: 15, minute: 0 }
];
const weekdayNames = [
  "Неділя",
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П’ятниця",
  "Субота"
];
const monthNames = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня"
];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const contactModal = document.querySelector("[data-contact-modal]");
const contactTriggers = document.querySelectorAll("[data-contact-trigger]");
const contactClosers = document.querySelectorAll("[data-contact-close]");
const firstContactOption = contactModal?.querySelector(".contact-option");

function openContactModal(event) {
  if (!contactModal) return;
  event.preventDefault();
  contactModal.hidden = false;
  document.body.style.overflow = "hidden";
  firstContactOption?.focus();
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.hidden = true;
  document.body.style.overflow = "";
}

contactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openContactModal);
});

contactClosers.forEach((closer) => {
  closer.addEventListener("click", closeContactModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModal && !contactModal.hidden) {
    closeContactModal();
  }
});

const nextGameElements = {
  dayNumber: document.querySelector("[data-next-game-day-number]"),
  weekday: document.querySelector("[data-next-game-weekday]"),
  date: document.querySelector("[data-next-game-date]"),
  time: document.querySelector("[data-next-game-time]"),
  countdown: document.querySelector("[data-next-game-countdown]")
};

function getKyivParts(date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: kyivTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second)
  };
}

function getKyivOffsetMs(date) {
  const parts = getKyivParts(date);
  const kyivAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return kyivAsUtc - date.getTime();
}

function makeKyivDate(year, month, day, hour, minute) {
  const firstGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = getKyivOffsetMs(firstGuess);
  const secondGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - offset);
  const correctedOffset = getKyivOffsetMs(secondGuess);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - correctedOffset);
}

function getKyivCalendarWeekday(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
}

function findNextGame(now = new Date()) {
  const kyivNow = getKyivParts(now);
  const todayCalendar = Date.UTC(kyivNow.year, kyivNow.month - 1, kyivNow.day);
  const todayWeekday = getKyivCalendarWeekday(kyivNow);

  return gameSchedule
    .flatMap((game) => {
      const candidates = [];
      for (let week = 0; week < 2; week += 1) {
        const daysUntil = (game.day - todayWeekday + 7) % 7 + week * 7;
        const candidateBase = new Date(todayCalendar + daysUntil * 24 * 60 * 60 * 1000);
        candidates.push(
          makeKyivDate(
            candidateBase.getUTCFullYear(),
            candidateBase.getUTCMonth() + 1,
            candidateBase.getUTCDate(),
            game.hour,
            game.minute
          )
        );
      }
      return candidates;
    })
    .filter((candidate) => candidate.getTime() > now.getTime())
    .sort((a, b) => a.getTime() - b.getTime())[0];
}

function formatCountdown(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days} дн ${hours} год`;
  if (hours > 0) return `${hours} год ${minutes} хв`;
  return `${minutes} хв`;
}

function updateNextGame() {
  if (!nextGameElements.date) return;

  const now = new Date();
  const nextGame = findNextGame(now);
  if (!nextGame) return;

  const parts = getKyivParts(nextGame);
  const weekday = weekdayNames[getKyivCalendarWeekday(parts)];
  const time = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;

  nextGameElements.dayNumber.textContent = String(parts.day).padStart(2, "0");
  nextGameElements.weekday.textContent = weekday;
  nextGameElements.date.textContent = `${parts.day} ${monthNames[parts.month - 1]}`;
  nextGameElements.time.textContent = time;
  nextGameElements.countdown.textContent = formatCountdown(nextGame.getTime() - now.getTime());
}

updateNextGame();
window.setInterval(updateNextGame, 60000);
