// تهيئة مولد الصور
document.addEventListener('DOMContentLoaded', function() {
    const IMAGE_API = "https://dev-pycodz-blackbox.pantheonsite.io/DEvZ44d/imger.php?img=";
    let currentImageUrl = null;
    
    // توليد الصورة
    document.getElementById('generate-image').addEventListener('click', generateImage);
    
    function generateImage() {
        const prompt = document.getElementById('image-prompt').value.trim();
        if (!prompt) {
            showNotification('وصف الصورة مطلوب', 'الرجاء إدخال وصف للصورة التي تريد إنشائها.', 'warning');
            return;
        }
        
        const style = document.getElementById('image-style').value;
        const quality = document.getElementById('image-quality').value;
        
        const fullPrompt = `${prompt} - ${style} style - ${quality} quality`;
        
        // عرض حالة التحميل
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = `
            <div class="loading-state">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">جارٍ التحميل...</span>
                </div>
                <p>جارٍ إنشاء الصورة...</p>
            </div>
        `;
        
        // إرسال الطلب إلى API
        fetch(IMAGE_API + encodeURIComponent(fullPrompt))
            .then(response => response.json() || response.text())
            .then(data => {
                const imageUrl = typeof data === 'object' ? data.url || data.image || data.result : data;
                currentImageUrl = imageUrl;
                
                // عرض الصورة الناتجة
                imagePreview.innerHTML = `
                    <img src="${imageUrl}" alt="AI Generated Image" class="img-fluid">
                `;
                
                // إظهار أزرار التحكم
                document.getElementById('image-actions').style.display = 'flex';
                
                // حفظ الصورة في المعرض
                saveToGallery(imageUrl);
            })
            .catch(error => {
                console.error('Error:', error);
                imagePreview.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>حدث خطأ أثناء إنشاء الصورة</p>
                        <button class="btn btn-sm btn-primary" onclick="generateImage()">المحاولة مرة أخرى</button>
                    </div>
                `;
            });
    }
    
    // تحميل الصورة
    document.getElementById('download-image').addEventListener('click', function() {
        if (!currentImageUrl) return;
        
        const a = document.createElement('a');
        a.href = currentImageUrl;
        a.download = `ai-image-${new Date().toISOString().slice(0, 10)}.jpg`;
        a.click();
    });
    
    // إعادة إنشاء الصورة
    document.getElementById('regenerate-image').addEventListener('click', generateImage);
    
    // تعديل الصورة
    document.getElementById('edit-image').addEventListener('click', function() {
        if (!currentImageUrl) return;
        
        showNotification('قريباً', 'ميزة التعديل على الصور قيد التطوير وسيتم إضافتها قريباً.', 'info');
    });
    
    // حفظ الصورة في المعرض
    function saveToGallery(imageUrl) {
        const gallery = document.querySelector('.gallery-grid');
        const savedImages = JSON.parse(localStorage.getItem('aiImages') || '[]');
        
        // الحد الأقصى للصور المحفوظة (12 صورة)
        if (savedImages.length >= 12) {
            savedImages.shift();
        }
        
        savedImages.push({
            url: imageUrl,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('aiImages', JSON.stringify(savedImages));
        updateGallery(savedImages);
    }
    
    // تحديث معرض الصور
    function updateGallery(images) {
        const gallery = document.querySelector('.gallery-grid');
        gallery.innerHTML = '';
        
        images.slice().reverse().forEach(img => {
            const imgElement = document.createElement('div');
            imgElement.className = 'gallery-item';
            imgElement.innerHTML = `<img src="${img.url}" alt="AI Generated Image">`;
            
            imgElement.addEventListener('click', function() {
                currentImageUrl = img.url;
                document.getElementById('image-preview').innerHTML = `
                    <img src="${img.url}" alt="AI Generated Image" class="img-fluid">
                `;
                document.getElementById('image-actions').style.display = 'flex';
            });
            
            gallery.appendChild(imgElement);
        });
    }
    
    // تحميل الصور المحفوظة
    const savedImages = JSON.parse(localStorage.getItem('aiImages') || '[]');
    updateGallery(savedImages);
    
    // أمثلة لوصف الصور
    document.querySelectorAll('.sample-list li').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('image-prompt').value = this.textContent;
        });
    });
});
