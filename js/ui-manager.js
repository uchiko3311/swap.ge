// მობილური მენიუს მართვა
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.onclick = () => {
        navMenu.classList.toggle('hidden');
    };
}

// VIP პაკეტის ვადის ვიზუალური მაჩვენებელი (30 დღე)
export function updateVipCountdown(expiryDate) {
    const timerElement = document.getElementById('vip-timer');
    if (!timerElement) return;

    const now = new Date().getTime();
    const distance = new Date(expiryDate).getTime() - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    timerElement.innerText = `დარჩენილია ${days} დღე`;
}

// სერვერის შეცდომების ჩვენება ეკრანზე (Toast notifications)
export function showToast(message, type = "info") {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
