// Sporty Nav Bar JavaScript
document.addEventListener('component-loaded', function(e) {
    // Only initialize if the navbar component was loaded
    if (e.detail.componentName === 'navbar') {
        initializeNavbar();
    }
});

// Initialize navbar separately to allow direct initialization if needed
function initializeNavbar() {
    // Get elements
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuItems = document.querySelectorAll('.mobile-menu a');
    let isAnimating = false;
    
    if (!hamburgerBtn || !mobileMenu) return;
    
    // Set initial ARIA attributes
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-controls', 'mobile-menu');
    mobileMenu.setAttribute('id', 'mobile-menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    
    // Toggle mobile menu when hamburger is clicked with debouncing
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent multiple clicks during animation
        if (isAnimating) return;
        
        toggleMenu();
    });
    
    // Handle keyboard navigation
    hamburgerBtn.addEventListener('keydown', function(e) {
        // Toggle on Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    // Add keyboard navigation for menu items
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            // Handle arrow key navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = menuItems[index + 1] || menuItems[0];
                nextItem.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                prevItem.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeMenu();
                hamburgerBtn.focus();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = event.target.closest('.sporty-nav');
        if (!isClickInsideNav && mobileMenu && mobileMenu.classList.contains('show')) {
            closeMenu();
        }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('show')) {
            closeMenu(false); // Don't focus on resize
        }
    });
    
    // Toggle menu function with animation handling
    function toggleMenu() {
        isAnimating = true;
        
        if (mobileMenu.classList.contains('show')) {
            closeMenu();
        } else {
            openMenu();
        }
        
        // Allow animations to complete before accepting new clicks
        setTimeout(() => {
            isAnimating = false;
        }, 300); // Match your CSS transition duration
    }
    
    // Open menu function
    function openMenu() {
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('show');
        mobileMenu.setAttribute('aria-hidden', 'false');
        
        // Focus trap: focus first menu item after animation
        setTimeout(() => {
            if (menuItems.length) menuItems[0].focus();
        }, 300);
    }
    
    // Close menu function
    function closeMenu(shouldFocus = true) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('show');
        mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Return focus to button when menu closes
        if (shouldFocus) {
            setTimeout(() => {
                hamburgerBtn.focus();
            }, 300);
        }
    }
    
    console.log('Navbar component initialized with enhanced accessibility');
}
