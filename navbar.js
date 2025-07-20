// Sporty Nav Bar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Toggle mobile menu when hamburger is clicked
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('show');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = event.target.closest('.sporty-nav');
        if (!isClickInsideNav && mobileMenu.classList.contains('show')) {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('show');
        }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('show')) {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('show');
        }
    });
});
