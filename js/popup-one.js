/**
 * popup Controls for one popup in BATTS Multi Activity Centre
 * Controls the popup visibility
 */

const popup = document.querySelector(".pop-up-wrapper");
const closeBtn = document.querySelector(".button-close");
const openBtn = document.querySelector("#open-popup");

function openPopup() {
  popup.classList.add("is-active");
}

function closePopup() {
  popup.classList.remove("is-active");
}

// open button
openBtn?.addEventListener("click", openPopup);

// close button
closeBtn?.addEventListener("click", closePopup);

// click outside popup closes it
popup?.addEventListener("click", (e) => {
  if (e.target === popup) closePopup();
});

// ESC key closes popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});


