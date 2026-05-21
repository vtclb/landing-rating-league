const revealItems = document.querySelectorAll(".reveal");

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
