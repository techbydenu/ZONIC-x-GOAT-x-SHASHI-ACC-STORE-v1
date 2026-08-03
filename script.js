// Hide Loader when page loads
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 800);
});

// Mobile Navbar Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu on clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// Live Search Filter for Accounts
const searchInput = document.getElementById('searchInput');
const accountGrid = id = document.getElementById('accountGrid');

if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = accountGrid.getElementsByClassName('card');

        Array.from(cards).forEach(card => {
            const tags = card.getAttribute('data-tags') || '';
            const textContent = card.textContent.toLowerCase();

            if (tags.toLowerCase().includes(searchTerm) || textContent.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
