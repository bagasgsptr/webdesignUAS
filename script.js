// Toggle menu mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Slider di Portfolio
let currentSlide = 0;
const slides = document.querySelectorAll('.slides img');

function showSlide(index) {
    if (slides.length === 0) return;
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    const offset = -currentSlide * 100;
    document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

// Auto-slide setiap 5 detik (opsional)
setInterval(() => {
    changeSlide(1);
}, 5000);

// Modal untuk gambar
function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = 'flex';
    modalImg.src = src;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Klik di luar modal untuk tutup
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Animasi fade-in saat scroll
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
window.addEventListener('load', handleScroll); // Jalankan saat load

// Validasi formulir kontak dengan feedback elegan
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const feedback = document.getElementById('feedback');
    const submitBtn = document.getElementById('submitBtn');
    
    feedback.textContent = '';
    feedback.style.color = '';
    
    if (!name || !email || !message) {
        feedback.textContent = 'Harap isi semua field dengan benar.';
        feedback.style.color = '#f5576c';
        return;
    }
    
    // Simulasi pengiriman (ganti dengan AJAX jika perlu)
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        feedback.textContent = 'Pesan berhasil dikirim! Terima kasih.';
        feedback.style.color = '#4caf50';
        submitBtn.textContent = 'Kirim';
        submitBtn.disabled = false;
        document.getElementById('contactForm').reset();
    }, 2000); // Simulasi delay 2 detik
});