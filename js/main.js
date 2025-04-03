// تهيئة الموقع والثيم
document.addEventListener('DOMContentLoaded', function() {
    // تحميل الثيم المفضل
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${savedTheme}-theme`;
    
    // تبديل الثيم
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.body.className = `${theme}-theme`;
            localStorage.setItem('theme', theme);
            
            // تحديث حالة الأزرار
            document.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
        
        // تمييز الزر النشط
        if (btn.getAttribute('data-theme') === savedTheme) {
            btn.classList.add('active');
        }
    });
    
    // تنعيم التمرير للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // إظهار العناصر بتأثيرات عند التمرير
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // إعداد العناصر للتحريك
    document.querySelectorAll('.model-card, .feature-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // تشغيلها مرة عند التحميل
    
    // إظهار إشعار ترحيبي
    setTimeout(() => {
        showNotification('مرحباً بك في AI Hub Pro!', 'يمكنك البدء باستخدام أي من أدوات الذكاء الاصطناعي المتاحة.');
    }, 1500);
});

// عرض الإشعارات
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-header">
            <strong>${title}</strong>
            <button class="close-notification">&times;</button>
        </div>
        <div class="notification-body">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // إغلاق الإشعار
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // إخفاء الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// تهيئة مكونات Bootstrap
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
