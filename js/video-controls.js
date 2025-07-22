/**
 * Video Controls for BATTS Multi Activity Centre
 * Controls the play/pause functionality for the background video
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize video controls once DOM is fully loaded
  initVideoControls();
});

/**
 * Initialize video controls and event listeners
 */
function initVideoControls() {
  const video = document.getElementById("backgroundVideo");
  const btn = document.getElementById("playPauseBtn");
  
  if (!video || !btn) {
    console.error("Video or control button not found");
    return;
  }
  
  // Add click event listener to the play/pause button
  btn.addEventListener('click', function() {
    togglePlay(video, btn);
  });
  
  // Update button text if video state changes by other means
  video.addEventListener('play', function() {
    btn.textContent = "Pause";
  });
  
  video.addEventListener('pause', function() {
    btn.textContent = "Play";
  });
}

/**
 * Toggle play/pause state of the video
 * @param {HTMLVideoElement} video - The video element to control
 * @param {HTMLButtonElement} btn - The button element to update
 */
function togglePlay(video, btn) {
  if (video.paused) {
    video.play();
    btn.textContent = "Pause";
  } else {
    video.pause();
    btn.textContent = "Play";
  }
}
