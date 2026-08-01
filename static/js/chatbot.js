/**
 * RiverBird Overlay Chatbot Client Script — Humanized Support Interface
 */

(function () {
  let isLeadCaptured = localStorage.getItem('rb_lead_captured') === 'true';
  let chatHistory = [];
  let currentServiceInterest = 'General Inquiry';

  function getLogoPath() {
    const baseAttr = document.documentElement.getAttribute('data-base');
    const base = baseAttr !== null ? baseAttr : '';
    return `${base}assets/img/RiverBird_Ore_logo.png`;
  }

  function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Inject Chatbot HTML Structure
  function initChatbot() {
    if (document.getElementById('rb-chat-launcher')) return;

    const logoUrl = getLogoPath();

    const chatbotHTML = `
      <!-- Floating Launcher -->
      <button id="rb-chat-launcher" class="rb-chat-launcher" aria-label="Open Chat Support">
        <img src="${logoUrl}" alt="RiverBird Logo" class="rb-launcher-logo" />
        <span class="rb-launcher-status-dot"></span>
      </button>

      <!-- Chat Drawer Overlay -->
      <div id="rb-chat-container" class="rb-chat-container">
        <!-- Header -->
        <div class="rb-chat-header">
          <div class="rb-chat-header-info">
            <div class="rb-chat-avatar-wrapper">
              <img src="${logoUrl}" alt="RiverBird Support" class="rb-chat-logo-img" />
              <span class="rb-avatar-online-dot"></span>
            </div>
            <div>
              <div class="rb-chat-header-title">RiverBird Client Support</div>
              <div class="rb-chat-header-status">
                <span class="rb-chat-status-pulse"></span> Active Now • Instant Answers
              </div>
            </div>
          </div>
          <button id="rb-chat-close" class="rb-chat-close-btn" aria-label="Close Chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Chat Body -->
        <div id="rb-chat-body" class="rb-chat-body">
          <div class="rb-chat-time-divider">Today</div>
          
          <div class="rb-chat-msg-row rb-msg-bot">
            <div class="rb-msg-avatar">
              <img src="${logoUrl}" alt="RiverBird" />
            </div>
            <div class="rb-msg-content-box">
              <div class="rb-chat-msg rb-chat-msg-bot">
                Hello there! 👋 Welcome to RiverBird Support. I'm here to assist you with <strong>Web Engineering</strong>, <strong>Digital Marketing</strong>, <strong>SEO</strong>, <strong>Staffing</strong>, or <strong>Career Opportunities</strong>!
                <div class="rb-chat-pills" id="initial-pills">
                  <button class="rb-chat-pill" onclick="window.sendChatPill('Tell me about Web Development')">💻 Web Engineering</button>
                  <button class="rb-chat-pill" onclick="window.sendChatPill('How can SEO help my site?')">📈 SEO Ranking</button>
                  <button class="rb-chat-pill" onclick="window.sendChatPill('Digital Marketing Solutions')">🚀 Marketing</button>
                  <button class="rb-chat-pill" onclick="window.sendChatPill('Tell me about Career Opportunities')">💼 Careers</button>
                  <button class="rb-chat-pill" onclick="window.sendChatPill('Get a Custom Quote')">📞 Get a Quote</button>
                </div>
              </div>
              <div class="rb-msg-timestamp">${getFormattedTime()}</div>
            </div>
          </div>
        </div>

        <!-- Footer Input -->
        <div class="rb-chat-footer">
          <input type="text" id="rb-chat-input" class="rb-chat-input" placeholder="Type your message..." autocomplete="off" />
          <button id="rb-chat-send" class="rb-chat-send-btn" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    attachEvents();
  }

  // Attach Event Listeners
  function attachEvents() {
    const launcher = document.getElementById('rb-chat-launcher');
    const container = document.getElementById('rb-chat-container');
    const closeBtn = document.getElementById('rb-chat-close');
    const sendBtn = document.getElementById('rb-chat-send');
    const input = document.getElementById('rb-chat-input');

    launcher.addEventListener('click', () => {
      container.classList.toggle('active');
      launcher.classList.toggle('active');
      if (container.classList.contains('active')) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      container.classList.remove('active');
      launcher.classList.remove('active');
    });

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Window global function for suggested pill buttons
  window.sendChatPill = function (text) {
    const input = document.getElementById('rb-chat-input');
    input.value = text;
    handleSend();
  };

  // Format simple markdown (bold text & linebreaks)
  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }

  // Handle User Message Sending
  async function handleSend() {
    const input = document.getElementById('rb-chat-input');
    const userMsg = input.value.trim();
    if (!userMsg) return;

    input.value = '';
    appendMessage(userMsg, 'user');
    chatHistory.push({ role: 'user', content: userMsg });

    showTypingIndicator();

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory })
      });

      const data = await response.json();
      removeTypingIndicator();

      if (data.text) {
        appendMessage(data.text, 'bot', data.suggested_questions);
        chatHistory.push({ role: 'bot', content: data.text });

        if (data.service) {
          currentServiceInterest = data.service;
        }

        // Show Lead Capture Form if AI recommends or upon user request
        if (data.prompt_lead || userMsg.toLowerCase().includes('quote') || userMsg.toLowerCase().includes('call') || userMsg.toLowerCase().includes('contact')) {
          setTimeout(() => renderLeadForm(currentServiceInterest), 400);
        }
      } else {
        appendMessage("I'm sorry, I couldn't process that request right now. Please try again or contact our team directly!", 'bot');
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      removeTypingIndicator();
      appendMessage("Something went wrong connecting to RiverBird. Please check your connection and try again.", 'bot');
    }
  }

  // Append Message to Chat Body with Humanized Layout & Timestamps
  function appendMessage(text, sender, suggestedQuestions = null) {
    const chatBody = document.getElementById('rb-chat-body');
    const timeStr = getFormattedTime();

    if (sender === 'user') {
      const userRow = document.createElement('div');
      userRow.className = 'rb-chat-msg-row rb-msg-user';
      userRow.innerHTML = `
        <div class="rb-msg-content-box">
          <div class="rb-chat-msg rb-chat-msg-user">${escapeHtml(text)}</div>
          <div class="rb-msg-timestamp">${timeStr}</div>
        </div>
      `;
      chatBody.appendChild(userRow);
    } else {
      const logoUrl = getLogoPath();
      const botRow = document.createElement('div');
      botRow.className = 'rb-chat-msg-row rb-msg-bot';
      
      const contentBox = document.createElement('div');
      contentBox.className = 'rb-msg-content-box';

      const msgDiv = document.createElement('div');
      msgDiv.className = 'rb-chat-msg rb-chat-msg-bot';
      msgDiv.innerHTML = formatMarkdown(text);

      if (suggestedQuestions && suggestedQuestions.length > 0) {
        const pillsDiv = document.createElement('div');
        pillsDiv.className = 'rb-chat-pills';
        suggestedQuestions.forEach(q => {
          const pill = document.createElement('button');
          pill.className = 'rb-chat-pill';
          pill.textContent = q;
          pill.onclick = () => window.sendChatPill(q);
          pillsDiv.appendChild(pill);
        });
        msgDiv.appendChild(pillsDiv);
      }

      contentBox.appendChild(msgDiv);
      contentBox.insertAdjacentHTML('beforeend', `<div class="rb-msg-timestamp">${timeStr}</div>`);

      botRow.innerHTML = `
        <div class="rb-msg-avatar">
          <img src="${logoUrl}" alt="RiverBird" />
        </div>
      `;
      botRow.appendChild(contentBox);
      chatBody.appendChild(botRow);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Typing Indicator
  function showTypingIndicator() {
    const chatBody = document.getElementById('rb-chat-body');
    const logoUrl = getLogoPath();
    const typingDiv = document.createElement('div');
    typingDiv.id = 'rb-typing-indicator';
    typingDiv.className = 'rb-chat-msg-row rb-msg-bot';
    typingDiv.innerHTML = `
      <div class="rb-msg-avatar">
        <img src="${logoUrl}" alt="RiverBird" />
      </div>
      <div class="rb-chat-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('rb-typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  // Render Humanized Lead Collection Contact Form inside Chat
  function renderLeadForm(serviceName) {
    const chatBody = document.getElementById('rb-chat-body');
    if (document.getElementById('rb-lead-card')) return;

    const cardDiv = document.createElement('div');
    cardDiv.id = 'rb-lead-card';
    cardDiv.className = 'rb-lead-card';
    cardDiv.innerHTML = `
      <div class="rb-lead-card-header">
        <div class="rb-lead-card-icon">📩</div>
        <div>
          <div class="rb-lead-card-title">Connect with RiverBird Team</div>
          <div class="rb-lead-card-subtitle">Share your details and our team will get back to you with custom info & pricing.</div>
        </div>
      </div>

      <form id="rb-lead-form-element" class="rb-lead-form">
        <div class="rb-input-group">
          <label for="rb-lead-name">Your Full Name</label>
          <input type="text" id="rb-lead-name" placeholder="e.g. Alex Morgan" autocomplete="name" />
        </div>
        <div class="rb-input-group">
          <label for="rb-lead-email">Email Address *</label>
          <input type="email" id="rb-lead-email" placeholder="name@company.com" required autocomplete="email" />
        </div>
        <div class="rb-input-group">
          <label for="rb-lead-phone">Phone / WhatsApp Number *</label>
          <input type="tel" id="rb-lead-phone" placeholder="+1 (555) 000-0000" required autocomplete="tel" />
        </div>
        <button type="submit" class="rb-lead-btn">Submit Contact Details ➔</button>
      </form>
      <div id="rb-lead-status" class="rb-lead-status"></div>
    `;

    chatBody.appendChild(cardDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    document.getElementById('rb-lead-form-element').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('rb-lead-name').value.trim();
      const email = document.getElementById('rb-lead-email').value.trim();
      const phone = document.getElementById('rb-lead-phone').value.trim();
      const statusDiv = document.getElementById('rb-lead-status');

      if (!email || !phone) {
        statusDiv.style.color = '#EF4444';
        statusDiv.textContent = 'Please enter both Email and Phone Number.';
        return;
      }

      statusDiv.style.color = '#3B82F6';
      statusDiv.textContent = 'Submitting details...';

      try {
        const response = await fetch('/api/chatbot/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            service: serviceName,
            message: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : ''
          })
        });

        const resData = await response.json();
        if (resData.success) {
          isLeadCaptured = true;
          localStorage.setItem('rb_lead_captured', 'true');
          cardDiv.remove();
          appendMessage(`🎉 Thank you ${name || ''}! We've received your contact details. Our team will reach out to you shortly!`, 'bot');
        } else {
          statusDiv.style.color = '#EF4444';
          statusDiv.textContent = resData.error || 'Failed to submit details.';
        }
      } catch (err) {
        console.error('Lead submit error:', err);
        statusDiv.style.color = '#EF4444';
        statusDiv.textContent = 'Network error. Please try again.';
      }
    });
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
