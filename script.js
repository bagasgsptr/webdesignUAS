// ===== TOGGLE MENU MOBILE =====
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Tutup menu saat klik link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== DARK MODE TOGGLE =====
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Simpan preferensi ke localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update icon
    const themeToggle = document.querySelector('.theme-toggle i');
    if (isDarkMode) {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    } else {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
    }
}

// Load dark mode preference saat halaman dimuat
window.addEventListener('load', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        }
    }
});

// ===== SLIDER PORTFOLIO =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slides img');

function showSlide(index) {
    if (slides.length === 0) return;
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    const offset = -currentSlide * 100;
    const slidesContainer = document.querySelector('.slides');
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(${offset}%)`;
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

// Auto-slide setiap 5 detik (opsional)
if (slides.length > 0) {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// ===== MODAL UNTUK GAMBAR =====
function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    
    if (modal && modalImg) {
        modal.style.display = 'flex';
        modalImg.src = src;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Klik di luar modal untuk tutup
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (modal && event.target === modal) {
        closeModal();
    }
};

// Keyboard shortcut: ESC untuk tutup modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===== ANIMASI FADE-IN SAAT SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Fallback untuk browser lama
function handleScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// ===== SMOOTH SCROLL UNTUK ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== COUNTER ANIMASI UNTUK STATS =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const originalText = element.textContent;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number dengan suffix
        let suffix = '';
        if (originalText.includes('+')) {
            suffix = '+';
        } else if (originalText.includes('km')) {
            suffix = 'km';
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, 50);
}

// Trigger counter saat stats section terlihat
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const statCards = entry.target.querySelectorAll('.stat-card h3');
            statCards.forEach(card => {
                const text = card.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateCounter(card, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== VALIDASI FORMULIR KONTAK DENGAN DATABASE =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        const feedback = document.getElementById('feedback');
        const submitBtn = document.getElementById('submitBtn');
        
        // Reset feedback
        feedback.textContent = '';
        feedback.style.color = '';
        
        // Validasi field kosong
        if (!name || !email || !message) {
            showFeedback('❌ Harap isi semua field dengan benar.', 'error', feedback);
            return;
        }
        
        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFeedback('❌ Format email tidak valid.', 'error', feedback);
            return;
        }
        
        // Validasi panjang pesan
        if (message.length < 10) {
            showFeedback('❌ Pesan minimal 10 karakter.', 'error', feedback);
            return;
        }
        
        // Disable button dan show loading
        submitBtn.textContent = '⏳ Mengirim...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (data.success) {
                showFeedback('✅ Pesan berhasil dikirim! Terima kasih.', 'success', feedback);
                contactForm.reset();
                
                // Hapus pesan feedback setelah 5 detik
                setTimeout(() => {
                    feedback.textContent = '';
                }, 5000);
            } else {
                showFeedback(data.message || '❌ Gagal mengirim pesan', 'error', feedback);
            }
        } catch (error) {
            console.error('Error:', error);
            showFeedback('❌ Terjadi kesalahan. Coba lagi.', 'error', feedback);
        } finally {
            submitBtn.textContent = '✉️ Kirim';
            submitBtn.disabled = false;
        }
    });
}

// Helper function untuk tampilkan feedback
function showFeedback(message, type, feedbackElement) {
    feedbackElement.textContent = message;
    feedbackElement.style.color = type === 'error' ? '#f5576c' : '#4caf50';
}

// ===== ACTIVE NAVIGATION LINK =====
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('load', setActiveNav);

// ===== SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(button);
    
    // Show/hide button based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
    
    // Scroll to top
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
}

window.addEventListener('load', createScrollToTopButton);

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%cMageRUN Website 🏃‍♂️', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cJangan mager, ayo lari! 💪', 'font-size: 14px; color: #764ba2;');
console.log('%c© 2025 - Kelompok 1', 'font-size: 12px; color: #999;');