/** 
 * POPUP Multiple CONTROLS FOR COACHES, coaching-team.html
 */

const popups = document.querySelectorAll(".pop-up-wrapper");
const openButtons = document.querySelectorAll(".read-more");

// ---- Open popup ----
function openPopup(name) {
  const popup = document.querySelector(`.pop-up-wrapper[data-popup="${name}"]`);
  popup?.classList.add("is-active");
}

// ---- Close popup ----
function closePopup(popup) {
  popup.classList.remove("is-active");
}

// Open button click handlers
openButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    openPopup(btn.dataset.popup);
  });
});

// Close button handlers
popups.forEach(popup => {
  const closeBtn = popup.querySelector(".button-close");

  closeBtn?.addEventListener("click", () => {
    closePopup(popup);
  });

  // Click outside popup closes it
  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup(popup);
  });
});

// ESC closes whichever popup is open
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    popups.forEach(closePopup);
  }
});

