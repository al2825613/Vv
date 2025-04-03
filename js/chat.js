// تهيئة الدردشة
document.addEventListener('DOMContentLoaded', function() {
    const API_MODELS = {
        "llama": "https://dev-apis-xyz.pantheonsite.io/wp-content/apis/freeAi.php?prompt={prompt}&model=llama",
        "Deepseek": "https://sherifbots.serv00.net/Api/gpt.php?text={text}",
        "GPT-4": "https://dev-apis-xyz.pantheonsite.io/wp-content/apis/freeAi.php?prompt={prompt}&model=chatgpt",
        "WormGPT": "https://dev-apis-xyz.pantheonsite.io/wp-content/apis/freeAi.php?prompt={prompt}&model=wormgpt",
        "EvilAI": "https://dev-apis-xyz.pantheonsite.io/wp-content/apis/freeAi.php?prompt={prompt}&model=evilgpt"
    };
    
    let currentModel = 'llama';
    let conversationHistory = [];
    
    // تحديث النموذج الحالي
    document.getElementById('model-select').addEventListener('change', function() {
        currentModel = this.value;
        updateModelBadge();
    });
    
    // تحديث شارة النموذج
    function updateModelBadge() {
        const modelNames = {
            'llama': 'Llama 2',
            'Deepseek': 'Deepseek',
            'GPT-4': 'GPT-4',
            'WormGPT': 'WormGPT',
            'EvilAI': 'EvilAI'
        };
        
        document.querySelector('.model-badge').textContent = modelNames[currentModel];
    }
    
    // إرسال الرسالة
    document.getElementById('send-message').addEventListener('click', sendMessage);
    document.getElementById('user-message').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    function sendMessage() {
        const userInput = document.getElementById('user-message').value.trim();
        if (!userInput) return;
        
        const chatMessages = document.getElementById('chat-messages');
        
        // إضافة رسالة المستخدم
        addMessage('user', userInput);
        
        // مسح حقل الإدخال
        document.getElementById('user-message').value = '';
        
        // إضافة رسالة تحميل للذكاء الاصطناعي
        const loadingId = addLoadingMessage();
        
        // إرسال الطلب إلى API
        const apiUrl = API_MODELS[currentModel]
            .replace('{prompt}', encodeURIComponent(userInput))
            .replace('{text}', encodeURIComponent(userInput));
        
        fetch(apiUrl)
            .then(response => response.json() || response.text())
            .then(data => {
                // إزالة رسالة التحميل
                removeLoadingMessage(loadingId);
                
                // إضافة رد الذكاء الاصطناعي
                const aiResponse = typeof data === 'object' ? data.response || data.message || JSON.stringify(data) : data;
                addMessage('ai', aiResponse);
                
                // حفظ المحادثة
                saveConversation(userInput, aiResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                removeLoadingMessage(loadingId);
                addErrorMessage();
            });
    }
    
    // إضافة رسالة إلى الدردشة
    function addMessage(sender, content) {
        const chatMessages = document.getElementById('chat-messages');
        
        // إزالة الرسالة الترحيبية إذا كانت موجودة
        if (document.querySelector('.welcome-message')) {
            chatMessages.innerHTML = '';
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${content.replace(/\n/g, '<br>')}
            </div>
            <div class="message-time">
                ${sender === 'user' ? 'أنت' : currentModel} - ${timeString}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // إضافة رسالة تحميل
    function addLoadingMessage() {
        const chatMessages = document.getElementById('chat-messages');
        const loadingId = 'loading-' + Date.now();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message-ai';
        loadingDiv.id = loadingId;
        
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span class="visually-hidden">جارٍ التحميل...</span>
                    </div>
                    <span>جاري توليد الرد...</span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(loadingDiv);
        scrollToBottom();
        
        return loadingId;
    }
    
    // إزالة رسالة تحميل
    function removeLoadingMessage(id) {
        const loadingElement = document.getElementById(id);
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // إضافة رسالة خطأ
    function addErrorMessage() {
        const chatMessages = document.getElementById('chat-messages');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message-ai';
        
        errorDiv.innerHTML = `
            <div class="message-content bg-danger text-white">
                <i class="fas fa-exclamation-circle me-2"></i>
                حدث خطأ أثناء جلب الرد. يرجى المحاولة مرة أخرى.
            </div>
        `;
        
        chatMessages.appendChild(errorDiv);
        scrollToBottom();
    }
    
    // التمرير إلى الأسفل
    function scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // حفظ المحادثة
    function saveConversation(userInput, aiResponse) {
        conversationHistory.push({
            user: userInput,
            ai: aiResponse,
            timestamp: new Date(),
            model: currentModel
        });
        
        // يمكن حفظها في localStorage أو إرسالها إلى الخادم
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
        
        // تحديث قائمة المحادثات
        updateConversationsList();
    }
    
    // تحديث قائمة المحادثات
    function updateConversationsList() {
        const conversationsList = document.querySelector('.conversations-list');
        
        // مسح القائمة الحالية
        conversationsList.innerHTML = '';
        
        // إضافة المحادثات
        conversationHistory.slice().reverse().forEach(conv => {
            const convElement = document.createElement('div');
            convElement.className = 'conversation';
            
            const now = new Date();
            const convDate = new Date(conv.timestamp);
            let timeString;
            
            if (now.toDateString() === convDate.toDateString()) {
                timeString = 'اليوم، ' + convDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            } else {
                timeString = convDate.toLocaleDateString('ar-EG');
            }
            
            convElement.innerHTML = `
                <div class="conversation-preview">${conv.user.substring(0, 50)}${conv.user.length > 50 ? '...' : ''}</div>
                <small class="conversation-time">${timeString}</small>
            `;
            
            convElement.addEventListener('click', function() {
                loadConversation(conv);
            });
            
            conversationsList.appendChild(convElement);
        });
    }
    
    // تحميل محادثة محددة
    function loadConversation(conversation) {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        
        addMessage('ai', conversation.ai);
        addMessage('user', conversation.user);
        
        // تحديث النموذج الحالي
        currentModel = conversation.model;
        document.getElementById('model-select').value = currentModel;
        updateModelBadge();
    }
    
    // محادثة جديدة
    document.getElementById('new-chat').addEventListener('click', function() {
        document.getElementById('chat-messages').innerHTML = `
            <div class="welcome-message">
                <div class="message-ai">
                    <div class="message-content">
                        <p>مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟</p>
                        <p>يمكنك اختيار نموذج مختلف من القائمة الجانبية للحصول على إجابات مختلفة.</p>
                    </div>
                    <div class="message-time">اليوم، ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>
        `;
    });
    
    // مسح الدردشة
    document.getElementById('clear-chat').addEventListener('click', function() {
        if (confirm('هل أنت متأكد من أنك تريد مسح هذه المحادثة؟')) {
            document.getElementById('chat-messages').innerHTML = `
                <div class="welcome-message">
                    <div class="message-ai">
                        <div class="message-content">
                            <p>مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟</p>
                            <p>يمكنك اختيار نموذج مختلف من القائمة الجانبية للحصول على إجابات مختلفة.</p>
                        </div>
                        <div class="message-time">اليوم، ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
            `;
        }
    });
    
    // تصدير الدردشة
    document.getElementById('export-chat').addEventListener('click', function() {
        const chatContent = Array.from(document.querySelectorAll('.message-content'))
            .map(el => {
                const sender = el.closest('.message-ai') ? 'AI' : 'You';
                return `${sender}: ${el.textContent}\n`;
            })
            .join('\n');
        
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-chat-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });
    
    // تحميل المحادثات المحفوظة
    const savedConversations = localStorage.getItem('conversationHistory');
    if (savedConversations) {
        conversationHistory = JSON.parse(savedConversations);
        updateConversationsList();
    }
});
