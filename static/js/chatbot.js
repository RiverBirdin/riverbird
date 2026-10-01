/**
 * RiverBird chat — keyword replies, in-session context only (no stored conversations).
 * Leads: name → phone → service (pills) → confirm → POST to api/chatbot/submit-lead.php
 */
(function () {
  const SERVICE_OPTIONS = [
    'Web Engineering',
    'SEO & Ranking',
    'Digital Marketing',
    'Staffing Solutions',
    'Careers',
    'General Inquiry'
  ];

  const INTENTS = [
    {
      id: 'web',
      service: 'Web Engineering',
      keywords: ['web', 'website', 'engineering', 'development', 'software', 'app', 'application'],
      reply:
        'We build **websites, web apps, and software** with a focus on performance and maintainability. Would you like our team to reach out with next steps?',
      pills: ['Yes, share my details', 'Tell me about SEO', 'Get a Quote']
    },
    {
      id: 'seo',
      service: 'SEO & Ranking',
      keywords: ['seo', 'google', 'ranking', 'search', 'lighthouse', 'visibility'],
      reply:
        'Our **SEO** work covers technical audits, on-page structure, and content strategy to improve rankings in Tiruchirappalli and beyond. Shall I connect you with a strategist?',
      pills: ['Yes, share my details', 'Digital Marketing', 'Get a Quote']
    },
    {
      id: 'marketing',
      service: 'Digital Marketing',
      keywords: ['marketing', 'social', 'ads', 'meta', 'ppc', 'brand', 'campaign'],
      reply:
        'We handle **digital marketing** — social media, paid ads, branding, and lead generation. Want a quick callback from our team?',
      pills: ['Yes, share my details', 'Web Engineering', 'Get a Quote']
    },
    {
      id: 'staffing',
      service: 'Staffing Solutions',
      keywords: ['staffing', 'hire', 'talent', 'recruit', 'manpower', 'hr'],
      reply:
        'Our **staffing** team helps you hire vetted developers, designers, and operations talent. Should we collect your details for a recruiter to call?',
      pills: ['Yes, share my details', 'Careers', 'Get a Quote']
    },
    {
      id: 'careers',
      service: 'Careers',
      keywords: ['career', 'careers', 'job', 'jobs', 'intern', 'internship', 'hiring', 'vacancy'],
      reply:
        'Explore roles on our **Careers** page — IT, digital marketing, and internships in Trichy. I can also pass your details to our HR team.',
      pills: ['Yes, share my details', 'View careers page', 'General question']
    },
    {
      id: 'quote',
      service: 'General Inquiry',
      keywords: ['quote', 'price', 'pricing', 'cost', 'proposal', 'contact', 'call', 'reach'],
      reply:
        'Happy to help with a **custom quote**. I’ll ask for your name, phone, and service — then we’ll email our team (no chat history is saved).',
      pills: ['Continue', 'Speak to team now']
    }
  ];

  /** In-memory session only — cleared on refresh. */
  const session = {
    step: 'chat',
    intent: '',
    service: '',
    name: '',
    phone: '',
    openedAt: Date.now(),
    leadSubmitted: false
  };

  function getApiBase() {
    return window.location.origin;
  }

  const LEAD_ENDPOINT = `${getApiBase()}/api/chatbot/submit-lead.php`;

  function resolvePath(path) {
    const baseAttr = document.documentElement.getAttribute('data-base');
    const base = baseAttr !== null ? baseAttr : '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  }

  function getLogoPath() {
    return resolvePath('assets/img/RiverBird_Ore_logo.jpg');
  }

  function getFormattedTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  }

  function normalizeText(text) {
    return text.toLowerCase().replace(/[^\w\s+&]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function matchIntent(text) {
    const norm = normalizeText(text);
    for (const intent of INTENTS) {
      if (intent.keywords.some((kw) => norm.includes(kw))) {
        return intent;
      }
    }
    return null;
  }

  function initChatbot() {
    if (document.getElementById('rb-chat-launcher')) return;

    const logoUrl = getLogoPath();

    const chatbotHTML = `
      <div id="rb-chat-pop-badge" class="rb-chat-pop-badge" role="status">
        <div class="rb-pop-text">Hi, how can I help you?</div>
        <div class="rb-pop-arrow"></div>
      </div>

      <button id="rb-chat-launcher" class="rb-chat-launcher" type="button" aria-label="Open chat support" aria-controls="rb-chat-container" aria-expanded="false">
        <img src="${logoUrl}" alt="" class="rb-launcher-logo" />
      </button>

      <div id="rb-chat-container" class="rb-chat-container" role="dialog" aria-modal="true" aria-labelledby="rb-chat-title" hidden>
        <div class="rb-chat-header">
          <div class="rb-chat-header-info">
            <div class="rb-chat-avatar-wrapper">
              <img src="${logoUrl}" alt="" class="rb-chat-logo-img" />
              <span class="rb-avatar-online-dot" aria-hidden="true"></span>
            </div>
            <div>
              <div id="rb-chat-title" class="rb-chat-header-title">RiverBird Client Support</div>
              <div class="rb-chat-header-status">
                <span class="rb-chat-status-pulse" aria-hidden="true"></span> Active now • Guided answers
              </div>
            </div>
          </div>
          <button id="rb-chat-close" class="rb-chat-close-btn" type="button" aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div id="rb-chat-body" class="rb-chat-body" aria-live="polite" aria-relevant="additions">
          <div class="rb-chat-time-divider">Today</div>
          <div class="rb-chat-msg-row rb-msg-bot">
            <div class="rb-msg-avatar">
              <img src="${logoUrl}" alt="" />
            </div>
            <div class="rb-msg-content-box">
              <div class="rb-chat-msg rb-chat-msg-bot">
                Hello! Welcome to RiverBird Support. Ask about <strong>Web Engineering</strong>, <strong>SEO</strong>, <strong>Marketing</strong>, <strong>Staffing</strong>, or <strong>Careers</strong> — or tap a topic below.
                <div class="rb-chat-pills" data-rb-pills>
                  <button type="button" class="rb-chat-pill" data-rb-pill="Web Engineering">Web Engineering</button>
                  <button type="button" class="rb-chat-pill" data-rb-pill="SEO and ranking">SEO Ranking</button>
                  <button type="button" class="rb-chat-pill" data-rb-pill="Digital Marketing">Marketing</button>
                  <button type="button" class="rb-chat-pill" data-rb-pill="Career opportunities">Careers</button>
                  <button type="button" class="rb-chat-pill" data-rb-pill="Get a custom quote">Get a Quote</button>
                </div>
              </div>
              <div class="rb-msg-timestamp">${getFormattedTime()}</div>
            </div>
          </div>
        </div>

        <div class="rb-chat-footer">
          <label class="sr-only" for="rb-chat-input">Type your message</label>
          <input type="text" id="rb-chat-input" class="rb-chat-input" placeholder="Type your message..." autocomplete="off" maxlength="500" />
          <input type="text" id="rb-chat-honeypot" name="company_website" class="rb-chat-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <button id="rb-chat-send" class="rb-chat-send-btn" type="button" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
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

  function attachEvents() {
    const launcher = document.getElementById('rb-chat-launcher');
    const popBadge = document.getElementById('rb-chat-pop-badge');
    const container = document.getElementById('rb-chat-container');
    const closeBtn = document.getElementById('rb-chat-close');
    const sendBtn = document.getElementById('rb-chat-send');
    const input = document.getElementById('rb-chat-input');
    const chatBody = document.getElementById('rb-chat-body');

    const setOpen = (open) => {
      container.classList.toggle('active', open);
      launcher.classList.toggle('active', open);
      container.hidden = !open;
      launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        popBadge.classList.add('hidden');
        session.openedAt = Date.now();
        input.focus();
      } else {
        popBadge.classList.remove('hidden');
      }
    };

    launcher.addEventListener('click', () => setOpen(!container.classList.contains('active')));
    if (popBadge) {
      popBadge.addEventListener('click', () => setOpen(true));
      setTimeout(() => {
        if (!container.classList.contains('active')) {
          popBadge.classList.add('popped');
        }
      }, 2500);
    }

    closeBtn.addEventListener('click', () => setOpen(false));

    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    chatBody.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-rb-pill]');
      if (!pill) return;
      const value = pill.getAttribute('data-rb-pill') || pill.textContent.trim();
      handleUserMessage(value);
    });
  }

  window.sendChatPill = function (text) {
    handleUserMessage(text);
  };

  async function handleSend() {
    const input = document.getElementById('rb-chat-input');
    const userMsg = input.value.trim();
    if (!userMsg) return;
    input.value = '';
    await handleUserMessage(userMsg);
  }

  async function handleUserMessage(userMsg) {
    appendMessage(userMsg, 'user');
    showTypingIndicator();
    await delay(350);
    removeTypingIndicator();
    await processUserInput(userMsg);
  }

  async function processUserInput(text) {
    const norm = normalizeText(text);

    if (session.leadSubmitted) {
      appendMessage('Your details were already sent. For urgent help, call **+91 99949 67655** or visit our contact page.', 'bot', [
        'Ask another question'
      ]);
      session.step = 'chat';
      return;
    }

    if (norm === 'view careers page' || norm.includes('view careers')) {
      const careersUrl = resolvePath('careers_index.html');
      appendMessage(`Open **[Careers](${careersUrl})** to see open roles. You can also share your details here for HR.`, 'bot', [
        'Yes, share my details',
        'Back to topics'
      ]);
      return;
    }

    if (norm === 'try again' && session.name && session.phone && session.service && !session.leadSubmitted) {
      session.step = 'confirm';
      await submitLead();
      return;
    }

    if (norm === 'ask another question' || norm === 'back to topics' || norm === 'general question') {
      session.step = 'chat';
      appendMessage('What would you like to know about?', 'bot', [
        'Web Engineering',
        'SEO and ranking',
        'Get a custom quote'
      ]);
      return;
    }

    if (
      session.step === 'chat' &&
      ((norm.includes('yes') && norm.includes('detail')) ||
        norm === 'continue' ||
        norm === 'speak to team now' ||
        norm.includes('share my'))
    ) {
      beginLeadCapture();
      return;
    }

    switch (session.step) {
      case 'collect_name':
        if (text.length < 2 || text.length > 80) {
          appendMessage('Please enter your **full name** (at least 2 characters).', 'bot');
          return;
        }
        session.name = text.trim();
        session.step = 'collect_phone';
        appendMessage(`Thanks, **${escapeHtml(session.name)}**. What is the best **phone or WhatsApp** number to reach you? (e.g. +91 99949 67655)`, 'bot');
        return;

      case 'collect_phone': {
        const digits = text.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          appendMessage('Please enter a valid **phone number** with at least 10 digits.', 'bot');
          return;
        }
        session.phone = text.trim();
        session.step = 'collect_service';
        appendMessage('Which **service** are you interested in? Choose one:', 'bot', SERVICE_OPTIONS);
        return;
      }

      case 'collect_service': {
        const picked = SERVICE_OPTIONS.find(
          (s) => normalizeText(s) === norm || norm.includes(normalizeText(s))
        );
        if (picked) {
          session.service = picked;
          showConfirmSummary();
          return;
        }
        appendMessage('Please pick a **service** using the buttons below.', 'bot', SERVICE_OPTIONS);
        return;
      }

      case 'confirm':
        if (norm === 'yes' || norm === 'send' || norm.includes('confirm')) {
          await submitLead();
          return;
        }
        if (norm === 'no' || norm.includes('edit') || norm.includes('change')) {
          session.step = 'collect_name';
          appendMessage("No problem. Let's start again — what is your **name**?", 'bot');
          return;
        }
        appendMessage('Reply **Send** to notify our team, or **Edit** to change your details.', 'bot', ['Send', 'Edit']);
        return;

      default:
        break;
    }

    const intent = matchIntent(text);
    if (intent) {
      session.intent = intent.id;
      if (!session.service) {
        session.service = intent.service;
      }
      appendMessage(intent.reply, 'bot', intent.pills);
      return;
    }

    if (session.intent) {
      appendMessage(
        'I can help with **Web**, **SEO**, **Marketing**, **Staffing**, **Careers**, or a **quote**. Say "share my details" to reach our team.',
        'bot',
        ['Yes, share my details', 'Get a custom quote']
      );
      return;
    }

    appendMessage(
      "I'm not sure I caught that. Try a topic below or type **quote**, **SEO**, or **careers**.",
      'bot',
      ['Web Engineering', 'SEO and ranking', 'Get a custom quote', 'Yes, share my details']
    );
  }

  function beginLeadCapture() {
    session.step = 'collect_name';
    appendMessage('Great — I’ll collect **name**, **phone**, and **service** (nothing is stored in this chat after you close the page). What is your **name**?', 'bot');
  }

  function showConfirmSummary() {
    session.step = 'confirm';
    appendMessage(
      `Please confirm:\n\n**Name:** ${escapeHtml(session.name)}\n**Phone:** ${escapeHtml(session.phone)}\n**Service:** ${escapeHtml(session.service)}\n\nSend this to **info@riverbird.in**?`,
      'bot',
      ['Send', 'Edit']
    );
  }

  async function submitLead() {
    showTypingIndicator();
    const honeypot = document.getElementById('rb-chat-honeypot');
    const payload = {
      name: session.name,
      phone: session.phone,
      service: session.service,
      intent: session.intent || '',
      opened_at: session.openedAt,
      company_website: honeypot ? honeypot.value : ''
    };

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      removeTypingIndicator();

      if (response.ok && data.success) {
        session.leadSubmitted = true;
        session.step = 'done';
        appendMessage(
          `Thank you, **${escapeHtml(session.name)}**! Our team will contact you soon at **${escapeHtml(session.phone)}** about **${escapeHtml(session.service)}**.`,
          'bot'
        );
      } else {
        appendMessage(data.error || 'Could not send your details. Please call **+91 99949 67655** or use our contact page.', 'bot', [
          'Try again',
          'Get a custom quote'
        ]);
        session.step = 'confirm';
      }
    } catch (err) {
      removeTypingIndicator();
      appendMessage('Network error. Please try again or contact us at **info@riverbird.in**.', 'bot', ['Send', 'Edit']);
      session.step = 'confirm';
    }
  }

  function appendMessage(text, sender, pillLabels = null) {
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

      if (pillLabels && pillLabels.length > 0) {
        const pillsDiv = document.createElement('div');
        pillsDiv.className = 'rb-chat-pills';
        pillsDiv.setAttribute('data-rb-pills', '');
        pillLabels.forEach((label) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'rb-chat-pill';
          pill.setAttribute('data-rb-pill', label);
          pill.textContent = label;
          pillsDiv.appendChild(pill);
        });
        msgDiv.appendChild(pillsDiv);
      }

      contentBox.appendChild(msgDiv);
      contentBox.insertAdjacentHTML('beforeend', `<div class="rb-msg-timestamp">${timeStr}</div>`);

      botRow.innerHTML = `<div class="rb-msg-avatar"><img src="${logoUrl}" alt="" /></div>`;
      botRow.appendChild(contentBox);
      chatBody.appendChild(botRow);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const chatBody = document.getElementById('rb-chat-body');
    if (document.getElementById('rb-typing-indicator')) return;
    const logoUrl = getLogoPath();
    const typingDiv = document.createElement('div');
    typingDiv.id = 'rb-typing-indicator';
    typingDiv.className = 'rb-chat-msg-row rb-msg-bot';
    typingDiv.setAttribute('aria-hidden', 'true');
    typingDiv.innerHTML = `
      <div class="rb-msg-avatar"><img src="${logoUrl}" alt="" /></div>
      <div class="rb-chat-typing"><span></span><span></span><span></span></div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('rb-typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
