function getBasePath() {
  const baseAttr = document.documentElement.getAttribute('data-base');
  if (baseAttr === null) {
    return '';
  }
  return baseAttr;
}

function resolvePath(path) {
  const base = getBasePath();

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${base}${cleanPath}`;
}

function initLayout() {
  // Hard bypass browser stylesheet cache
  const link = document.querySelector('link[rel="stylesheet"]');
  if (link && !link.href.includes('?v=')) {
    link.href = link.href.split('?')[0] + '?v=1.0.1';
  }

  const headerContainer = document.getElementById('header-slot');
  const footerContainer = document.getElementById('footer-slot');
  
  if (headerContainer) {
    headerContainer.innerHTML = getNavbarHTML();
    bindNavbarEvents();
  }
  
  if (footerContainer) {
    footerContainer.innerHTML = getFooterHTML();
    bindFooterEvents();
  }
  
  highlightActiveNav();
  initHUDOverlay();
  initChatbotAssets();
}

function initChatbotAssets() {
  const cssPath = resolvePath('static/css/chatbot.css');
  const jsPath = resolvePath('static/js/chatbot.js');

  if (!document.querySelector('link[href*="chatbot.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }

  if (!document.querySelector('script[src*="chatbot.js"]')) {
    const script = document.createElement('script');
    script.src = jsPath;
    script.defer = true;
    document.body.appendChild(script);
  }
}

function getNavbarHTML() {
  const logoUrl = resolvePath('assets/img/Logo-with-Text-copy.png');
  const homeUrl = resolvePath('index.html');
  const companyUrl = resolvePath('company_index.html');
  const mktUrl = resolvePath('digital_marketing_index.html');
  const devUrl = resolvePath('development_index.html');
  const staffingUrl = resolvePath('staffing_index.html');
  const productUrl = resolvePath('product_index.html');
  const careersUrl = resolvePath('careers_index.html');
  const contactUrl = resolvePath('contact_index.html');

  return `
    <header class="header" id="main-header">
      <div class="container header__container">
        
        <a href="${homeUrl}" class="header__logo">
          <img src="${logoUrl}" alt="Riverbird Logo" />
        </a>

        <nav class="nav">
          <ul class="nav__list">
            <li class="nav__item nav__item--has-dropdown">
              <a href="${companyUrl}" class="nav__link" tabindex="0">
                Company
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <div class="dropdown-menu">
                <ul class="dropdown-menu__list">
                  <li>
                    <a href="${companyUrl}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">About Us</span>
                      <span class="dropdown-menu__item-desc">Our mission, leadership, and story.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${homeUrl}#blog" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Blog</span>
                      <span class="dropdown-menu__item-desc">Latest insights on technology and design.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${homeUrl}#case-studies" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Case Studies</span>
                      <span class="dropdown-menu__item-desc">Real delivery projects scaled by us.</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
 
            <li class="nav__item nav__item--has-dropdown">
              <a href="${devUrl}" class="nav__link" tabindex="0">
                Development Solutions
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <div class="dropdown-menu">
                <ul class="dropdown-menu__list">
                  <li>
                    <a href="${resolvePath('software.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Software Development</span>
                      <span class="dropdown-menu__item-desc">Enterprise database and custom scripting builds.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('web.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Web Development</span>
                      <span class="dropdown-menu__item-desc">High-performance reactive interfaces and SPAs.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('app.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Application Development</span>
                      <span class="dropdown-menu__item-desc">Modern iOS, Android, and cross-platform builds.</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
 
            <li class="nav__item nav__item--has-dropdown">
              <a href="${mktUrl}" class="nav__link" tabindex="0">
                Digital Marketing
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <div class="mega-menu">
                
                <div>
                  <h3 class="mega-menu__column-title">Creatives</h3>
                  <ul class="mega-menu__list">
                    <li>
                      <a href="${resolvePath('graphic-design.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Graphic Design</span>
                        <span class="mega-menu__item-desc">Professional branding and high-end vectors.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('video-production.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Video Production</span>
                        <span class="mega-menu__item-desc">High-quality editing and corporate media.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('brand-identity.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Brand Identity</span>
                        <span class="mega-menu__item-desc">Logo, typography, and voice manuals.</span>
                      </a>
                    </li>
                  </ul>
                </div>
 
                <div>
                  <h3 class="mega-menu__column-title">Organic Growth</h3>
                  <ul class="mega-menu__list">
                    <li>
                      <a href="${resolvePath('seo.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">SEO (Google Ranking)</span>
                        <span class="mega-menu__item-desc">Technical search rankings & audit pipelines.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('personal-branding.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Personal Branding</span>
                        <span class="mega-menu__item-desc">Authority design for executives and founders.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('social-media.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Social Media Marketing</span>
                        <span class="mega-menu__item-desc">Content and channel strategies that convert.</span>
                      </a>
                    </li>
                  </ul>
                </div>
 
                <div>
                  <h3 class="mega-menu__column-title">Performance</h3>
                  <ul class="mega-menu__list">
                    <li>
                      <a href="${resolvePath('paid-ads.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Paid Ads (Meta & Google)</span>
                        <span class="mega-menu__item-desc">ROI campaigns across Search and Social.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('lead-generation.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Lead Generation System</span>
                        <span class="mega-menu__item-desc">Qualified pipelines for sales outreach.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('influencer-marketing.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Influencer Marketing</span>
                        <span class="mega-menu__item-desc">Strategic partnerships with target creators.</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
 
            <li class="nav__item nav__item--has-dropdown">
              <a href="${staffingUrl}" class="nav__link" tabindex="0">
                Staffing Solutions
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <div class="dropdown-menu">
                <ul class="dropdown-menu__list">
                  <li>
                    <a href="${resolvePath('talent-management.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Talent Management</span>
                      <span class="dropdown-menu__item-desc">Corporate HR growth scorecards.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('hire-talent.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Hire Talents</span>
                      <span class="dropdown-menu__item-desc">Vetted engineering and UI specialists.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('manpower.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Manpower Solutions</span>
                      <span class="dropdown-menu__item-desc">High volume operations staffing pools.</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
             
            <li class="nav__item nav__item--has-dropdown">
              <a href="${productUrl}" class="nav__link" tabindex="0">
                Product
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <div class="dropdown-menu">
                <ul class="dropdown-menu__list">
                  <li>
                    <a href="${productUrl}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Fashyfi (Quick Commerce)</span>
                      <span class="dropdown-menu__item-desc">Our ultra-fast quick commerce platform.</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
 
            <li class="nav__item nav__item--has-dropdown">
              <a href="${careersUrl}" class="nav__link" tabindex="0">
                Careers
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <div class="dropdown-menu">
                <ul class="dropdown-menu__list">
                  <li>
                    <a href="${careersUrl}#it" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">IT Jobs</span>
                      <span class="dropdown-menu__item-desc">Bespoke backend and web engineering roles.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${careersUrl}#marketing" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Digital Marketing Jobs</span>
                      <span class="dropdown-menu__item-desc">Technical search and performance optimization roles.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${careersUrl}#internship" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Internships</span>
                      <span class="dropdown-menu__item-desc">Accelerated learning cycles for junior developers.</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li class="nav__item">
              <a href="${contactUrl}" class="nav__link">Contact</a>
            </li>
          </ul>
        </nav>

        <div class="header__actions">
          <a href="${contactUrl}" class="btn btn--primary btn--sm magnetic-btn" data-nav="contact">Get in Touch</a>
          
          <div class="mobile-toggle" id="mobile-toggle-btn" role="button" aria-label="Toggle menu" tabindex="0">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>

    <div class="mobile-menu" id="mobile-menu-drawer">
      <nav class="mobile-menu__nav">
        <div>
          <div class="mobile-menu__link mobile-menu__submenu-toggle" data-toggle="company" role="button" tabindex="0">
            Company
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mobile-menu__submenu" data-submenu="company">
            <a href="${companyUrl}" class="mobile-menu__sublink">About Us</a>
            <a href="${homeUrl}#blog" class="mobile-menu__sublink">Blog</a>
            <a href="${homeUrl}#case-studies" class="mobile-menu__sublink">Case Studies</a>
          </div>
        </div>

        <div>
          <div class="mobile-menu__link mobile-menu__submenu-toggle" data-toggle="dev" role="button" tabindex="0">
            Development Solutions
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mobile-menu__submenu" data-submenu="dev">
            <a href="${resolvePath('software.html')}" class="mobile-menu__sublink">Software Development</a>
            <a href="${resolvePath('web.html')}" class="mobile-menu__sublink">Web Development</a>
            <a href="${resolvePath('app.html')}" class="mobile-menu__sublink">Application Development</a>
          </div>
        </div>

        <div>
          <div class="mobile-menu__link mobile-menu__submenu-toggle" data-toggle="marketing" role="button" tabindex="0">
            Digital Marketing
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mobile-menu__submenu" data-submenu="marketing">
            <a href="${resolvePath('social-media.html')}" class="mobile-menu__sublink">Social Media Marketing</a>
            <a href="${resolvePath('graphic-design.html')}" class="mobile-menu__sublink">Graphic Design</a>
            <a href="${resolvePath('video-production.html')}" class="mobile-menu__sublink">Video Production</a>
            <a href="${resolvePath('brand-identity.html')}" class="mobile-menu__sublink">Brand Identity</a>
            <a href="${resolvePath('personal-branding.html')}" class="mobile-menu__sublink">Personal Branding</a>
            <a href="${resolvePath('influencer-marketing.html')}" class="mobile-menu__sublink">Influencer Marketing</a>
            <a href="${resolvePath('seo.html')}" class="mobile-menu__sublink">SEO (Google Ranking)</a>
            <a href="${resolvePath('paid-ads.html')}" class="mobile-menu__sublink">Paid Ads (Meta & Google)</a>
            <a href="${resolvePath('lead-generation.html')}" class="mobile-menu__sublink">Lead Generation System</a>
          </div>
        </div>

        <div>
          <div class="mobile-menu__link mobile-menu__submenu-toggle" data-toggle="staffing" role="button" tabindex="0">
            Staffing Solutions
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mobile-menu__submenu" data-submenu="staffing">
            <a href="${resolvePath('talent-management.html')}" class="mobile-menu__sublink">Talent Management</a>
            <a href="${resolvePath('hire-talent.html')}" class="mobile-menu__sublink">Hire Talents</a>
            <a href="${resolvePath('manpower.html')}" class="mobile-menu__sublink">Manpower Solutions</a>
          </div>
        </div>

        <div>
          <div class="mobile-menu__link mobile-menu__submenu-toggle" data-toggle="product" role="button" tabindex="0">
            Product
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mobile-menu__submenu" data-submenu="product">
            <a href="${productUrl}" class="mobile-menu__sublink">Fashyfi (Quick Commerce)</a>
          </div>
        </div>

        <div>
          <div class="mobile-menu__link mobile-menu__submenu-toggle" data-toggle="careers" role="button" tabindex="0">
            Careers
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="mobile-menu__submenu" data-submenu="careers">
            <a href="${careersUrl}#it" class="mobile-menu__sublink">IT Jobs</a>
            <a href="${careersUrl}#marketing" class="mobile-menu__sublink">Digital Marketing Jobs</a>
            <a href="${careersUrl}#internship" class="mobile-menu__sublink">Internships</a>
          </div>
        </div>

        <a href="${contactUrl}" class="mobile-menu__link">Contact</a>
      </nav>
    </div>
  `;
}

function getFooterHTML() {
  resolvePath('assets/img/logo.png');
  const homeUrl = resolvePath('index.html');
  const companyUrl = resolvePath('company_index.html');
  const devUrl = resolvePath('development_index.html');
  const mktUrl = resolvePath('digital_marketing_index.html');
  const staffingUrl = resolvePath('staffing_index.html');
  const productUrl = resolvePath('product_index.html');
  const careersUrl = resolvePath('careers_index.html');
  const contactUrl = resolvePath('contact_index.html');

  const instagramIcon = resolvePath('assets/img/icons/instagram (1).png');
  const linkedinIcon = resolvePath('assets/img/icons/social.png');
  const facebookIcon = resolvePath('assets/img/icons/facebook.png');
  const youtubeIcon = resolvePath('assets/img/icons/play.png');

  document.body.getAttribute('data-page') === 'home';

  return `
    <footer class="footer py-2xl">
      <div class="container">
        
        <div class="footer__top">
          
          <div class="footer__brand">
            <a href="${homeUrl}" class="footer__logo">
              <img src="${resolvePath('assets/img/Logo-with-Text-copy.png')}" alt="RiverBird Logo" />
            </a>
            <p>15/1 Karur Bypass Road, Mela Chinthamani, Tiruchirappalli 620002. 
              <strong>
              GSTIN: 33AAPCR8973F1ZT</strong>
            </p>
            <div class="footer__socials">
              <a href="https://instagram.com/riverbird.in" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram"> 
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	              <path d="M0 0h24v24H0z" fill="none" />
	              <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
              </svg>

              </a>
              <a href="https://www.linkedin.com/company/riverbird-in/" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	                <path d="M0 0h24v24H0z" fill="none" />
                	<path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.html?id=61559792591988" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">

                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	                <path d="M0 0h24v24H0z" fill="none" />
	                <path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
                </svg>

              </a>
              <a href="https://www.youtube.com/@RiverBirddotin" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
	                <path d="M0 0h24v24H0z" fill="none" />
	                <path fill="none" stroke="currentColor" stroke-dasharray="60" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z">
		              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0" />
	              </path>
	              <path fill="currentColor" d="M10 8.5l6 3.5l-6 3.5Z" opacity="0">
	              	<set fill="freeze" attributeName="opacity" begin="0.6s" to="1" />
	              	<animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 11l0 1l0 1Z;M10 8.5l6 3.5l-6 3.5Z" />
	              </path>
              </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="footer__title">Solutions</h4>
            <ul class="footer__list">
              <li><a href="${devUrl}" class="footer__link">Development Solutions</a></li>
              <li><a href="${mktUrl}" class="footer__link">Digital Marketing</a></li>
              <li><a href="${staffingUrl}" class="footer__link">Staffing Solutions</a></li>
              <li><a href="${productUrl}" class="footer__link">Fashyfi (Quick Commerce)</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer__title">Company</h4>
            <ul class="footer__list">
              <li><a href="${companyUrl}" class="footer__link">About Us</a></li>
              <li><a href="${careersUrl}" class="footer__link">Careers</a></li>
              <li><a href="${contactUrl}" class="footer__link">Contact</a></li>
              <li><a href="${homeUrl}#case-studies" class="footer__link">Testimonials</a></li>
            </ul>
          </div>

          <div>
          <h4 class="footer__title">Contact Us</h4>
          <ul class="footer__list">
              <li><a href="tel:+918610524681" class="footer__link">+91 861-0524681</a></li>
              <li><a href="mailto:info@riverbird.in" class="footer__link">info@riverbird.in</a></li>
            </ul>
            <br>

            <h4 class="footer__title">Newsletter</h4>
            <div class="footer__newsletter">
              <p style="color: var(--color-text-muted); font-size: 0.875rem;">Get industry insights and Riverbird growth announcements.</p>
              <form class="footer__newsletter-form" id="newsletter-form">
                <input type="email" placeholder="Enter your email" class="footer__newsletter-input" required aria-label="Email Address" />
                <button type="submit" class="footer__newsletter-btn" aria-label="Subscribe">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div class="footer__bottom">
          <p class="footer__copyright">&copy; ${new Date().getFullYear()} Riverbird. All rights reserved.</p>
          <div class="footer__legal">
            <a href="${resolvePath('privacy_policy.html')}" class="footer__legal-link">Privacy Policy</a>
            <a href="${resolvePath('terms_of_service.html')}" class="footer__legal-link">Terms of Service</a>
            <a href="${resolvePath('refund and_cancellation.html')}" class="footer__legal-link">Refund and Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function bindNavbarEvents() {
  const header = document.getElementById('main-header');
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  
  if (!header) return;

  const logoImg = header.querySelector('.header__logo img');
  document.querySelector('main > section:first-of-type');

  const setLogo = (state) => {
    if (!logoImg) return;
    // Always use the logo with text, no switching needed
    logoImg.src = resolvePath('assets/img/Logo-with-Text-copy.png');
  };

  {
    setLogo();
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 16) {
      header.classList.add('header--scrolled');
      setLogo();
    } else {
      header.classList.remove('header--scrolled');
      {
        setLogo();
      }
    }
  });

  // Enhanced menu stability
  const navItems = header.querySelectorAll('.nav__item--has-dropdown');
  let menuTimeout;
  
  navItems.forEach(item => {
    const menu = item.querySelector('.dropdown-menu, .mega-menu');
    if (!menu) return;

    item.addEventListener('mouseenter', () => {
      clearTimeout(menuTimeout);
      menu.style.pointerEvents = 'auto';
    });

    item.addEventListener('mouseleave', () => {
      menuTimeout = setTimeout(() => {
        if (!menu.matches(':hover')) {
          menu.style.pointerEvents = 'none';
        }
      }, 300); // Longer delay before closing
    });

    menu.addEventListener('mouseenter', () => {
      clearTimeout(menuTimeout);
      menu.style.pointerEvents = 'auto';
    });

    menu.addEventListener('mouseleave', () => {
      menuTimeout = setTimeout(() => {
        menu.style.pointerEvents = 'none';
      }, 200);
    });
  });

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('mobile-toggle--active');
      drawer.classList.toggle('mobile-menu--open');
      document.body.classList.toggle('no-scroll');
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('mobile-toggle--active');
        drawer.classList.remove('mobile-menu--open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  if (drawer) {
    drawer.querySelectorAll('.mobile-menu__submenu-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const submenuName = btn.getAttribute('data-toggle');
        const submenu = drawer.querySelector(`[data-submenu="${submenuName}"]`);
        if (submenu) {
          btn.classList.toggle('mobile-menu__submenu-toggle--active');
          submenu.classList.toggle('mobile-menu__submenu--open');
        }
      });
    });
  }
}

function bindFooterEvents() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.footer__newsletter-input');
      const email = input.value.trim();
      if (email) {
        const originalPlaceholder = input.placeholder;
        input.value = '';
        input.placeholder = 'Subscribed successfully!';
        input.disabled = true;
        input.classList.add('footer__newsletter-input--success');
        setTimeout(() => {
          input.placeholder = originalPlaceholder;
          input.disabled = false;
          input.classList.remove('footer__newsletter-input--success');
        }, 4000);
      }
    });
  }

  // 3D Parallax Tilt Effect for Footer Avatars
  const avatarCards = document.querySelectorAll('.avatar-card');
  avatarCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = x / rect.width - 0.5;
      const yc = y / rect.height - 0.5;
      
      const rotateX = -yc * 22; // 22 degrees max rotation
      const rotateY = xc * 22;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      
      // Dynamic shift of internal element layers to highlight 3D parallax depth
      const tagTop = card.querySelector('.avatar-tag--top');
      const tagBottom = card.querySelector('.avatar-tag--bottom');
      const icon = card.querySelector('.avatar-sphere__icon');
      
      if (tagTop) tagTop.style.transform = `translateZ(45px) translate(${-xc * 12}px, ${-yc * 12}px)`;
      if (tagBottom) tagBottom.style.transform = `translateZ(45px) translate(${-xc * 12}px, ${-yc * 12}px)`;
      if (icon) icon.style.transform = `translateZ(35px) translate(${xc * 8}px, ${yc * 8}px) scale(1.1)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      
      const tagTop = card.querySelector('.avatar-tag--top');
      const tagBottom = card.querySelector('.avatar-tag--bottom');
      const icon = card.querySelector('.avatar-sphere__icon');
      
      if (tagTop) tagTop.style.transform = 'translateZ(30px) translate(0, 0)';
      if (tagBottom) tagBottom.style.transform = 'translateZ(30px) translate(0, 0)';
      if (icon) icon.style.transform = 'translateZ(20px) translate(0, 0) scale(1)';
    });
  });
}

function highlightActiveNav() {
  const pageName = document.body.getAttribute('data-page');
  if (!pageName) return;
  
  document.querySelectorAll('[data-nav]').forEach(el => {
    if (el.getAttribute('data-nav') === pageName) {
      if (el.classList.contains('nav__link')) {
        el.classList.add('nav__link--active');
      }
    } else {
      el.classList.remove('nav__link--active');
    }
  });
}

/* === Adobe After Effects HUD Injector & Controller === */
function initHUDOverlay() {
  if (document.querySelector('.ae-hud-overlay')) return;

  // 1. Grid background overlay
  const gridOverlay = document.createElement('div');
  gridOverlay.className = 'ae-grid-overlay';
  document.body.prepend(gridOverlay);

  // 2. Camera Viewfinder overlay
  const hudOverlay = document.createElement('div');
  hudOverlay.className = 'ae-hud-overlay';
  hudOverlay.innerHTML = `
    <div class="ae-corner ae-corner--tl"></div>
    <div class="ae-corner ae-corner--tr"></div>
    <div class="ae-corner ae-corner--bl"></div>
    <div class="ae-corner ae-corner--br"></div>

    <div class="ae-hud-ticker ae-hud-ticker--top-left">
      <span class="ae-rec-dot"></span>
      <span>[● REC] 24.00 FPS</span>
    </div>
    <div class="ae-hud-ticker ae-hud-ticker--top-right">
      <span>COMP: RVRBRD_MKT_PROD</span>
    </div>
    <div class="ae-hud-ticker ae-hud-ticker--bottom-left">
      <span class="ae-hud-timecode">TC: 00:00:00:00</span>
    </div>
    <div class="ae-hud-ticker ae-hud-ticker--bottom-right">
      <span>SHUTTER: 180° | ISO 800</span>
    </div>
  `;
  document.body.appendChild(hudOverlay);

  // 3. Mouse coords overlay
  const mouseCoords = document.createElement('div');
  mouseCoords.className = 'ae-mouse-coords';
  mouseCoords.innerHTML = `
    <span class="ae-mouse-coords__x">X: 0</span>
    <span class="ae-mouse-coords__y">Y: 0</span>
  `;
  document.body.appendChild(mouseCoords);

  // Start tickers
  initTimecodeCounter();
  initMouseCoordinatesHUD();

  // Scroll fade overlay logic
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = 200;
    const opacity = Math.max(0.05, 1 - (scrollY / maxScroll));
    hudOverlay.style.opacity = opacity;
    gridOverlay.style.opacity = opacity * 0.8;
  }, { passive: true });
}

function initTimecodeCounter() {
  const tcElement = document.querySelector('.ae-hud-timecode');
  if (!tcElement) return;
  let frame = 0;
  let sec = 15;
  let min = 3;
  let hr = 0;
  setInterval(() => {
    frame++;
    if (frame >= 24) {
      frame = 0;
      sec++;
      if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
          min = 0;
          hr++;
        }
      }
    }
    const pad = (n) => String(n).padStart(2, '0');
    tcElement.textContent = `TC: ${pad(hr)}:${pad(min)}:${pad(sec)}:${pad(frame)}`;
  }, 1000 / 24);
}

function initMouseCoordinatesHUD() {
  const coords = document.querySelector('.ae-mouse-coords');
  const xText = document.querySelector('.ae-mouse-coords__x');
  const yText = document.querySelector('.ae-mouse-coords__y');
  if (!coords) return;
  
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let isMouseActive = false;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
    coords.style.opacity = '0.6';
  });

  document.addEventListener('mouseleave', () => {
    coords.style.opacity = '0';
    isMouseActive = false;
  });
  
  function update() {
    if (isMouseActive) {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      
      coords.style.left = `${curX + 18}px`;
      coords.style.top = `${curY + 18}px`;
      
      if (xText && yText) {
        xText.textContent = `X: ${Math.round(mouseX)}`;
        yText.textContent = `Y: ${Math.round(mouseY)}`;
      }
    }
    requestAnimationFrame(update);
  }
  update();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal--visible');
      
      // Trigger After Effects style decrypt/scramble on headings in the revealed section
      const headings = entry.target.querySelectorAll('h1, h2, .h1, .h2');
      headings.forEach(h => scrambleText(h));
      
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const targetNum = parseInt(target.getAttribute('data-target'), 10);
      if (isNaN(targetNum)) return;
      
      const duration = 1500;
      let start = 0;
      const stepTime = Math.max(Math.floor(duration / targetNum), 15);
      
      const timer = setInterval(() => {
        start += 1;
        target.textContent = start;
        if (start >= targetNum) {
          target.textContent = targetNum;
          clearInterval(timer);
        }
      }, stepTime);
      
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.2 });

function initAnimations() {
  initCursorGlow();
  initCardTilt();
  initScrollProgress();
  initSectionIndicators();
  initParallax();
  initStaggerAnimations();
  initMouseTrail();
  
  scanAndObserve(document.body);
  initMutationObserver();
}

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  });
}



/* Scrambles only text nodes recursively to avoid breaking nested HTML elements */
function scrambleText(element) {
  if (element.dataset.scrambled === 'true') return;
  element.dataset.scrambled = 'true';

  const textNodes = [];
  function findTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.trim().length > 0) {
        textNodes.push(node);
      }
    } else {
      for (let child of node.childNodes) {
        findTextNodes(child);
      }
    }
  }
  findTextNodes(element);

  const originalValues = textNodes.map(node => node.nodeValue);
  const chars = 'XYZ-+$#@&0123456789%[]{}*?!=';
  let progress = 0;
  const maxLen = Math.max(...originalValues.map(val => val.length), 0);
  
  const interval = setInterval(() => {
    textNodes.forEach((node, nodeIdx) => {
      const orig = originalValues[nodeIdx];
      node.nodeValue = orig
        .split('')
        .map((char, charIdx) => {
          if (/\s/.test(char)) return char; // Skip white space
          if (charIdx < progress) return orig[charIdx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
    });

    progress += Math.ceil(maxLen / 12);
    if (progress > maxLen) {
      textNodes.forEach((node, nodeIdx) => {
        node.nodeValue = originalValues[nodeIdx];
      });
      clearInterval(interval);
    }
  }, 45);
}

function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.body.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card, .value-card, .stat-card');
    if (!card) return;

    if (card.classList.contains('card-showcase')) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    const rotateX = -yc * 8;
    const rotateY = xc * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) translateZ(0)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });

  document.body.addEventListener('mouseleave', (e) => {
    const card = e.target.closest('.card, .value-card, .stat-card');
    if (!card) return;

    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  }, true);
}

function scanAndObserve(root) {
  if (!root) return;
  
  if (root.classList && root.classList.contains('reveal')) {
    revealObserver.observe(root);
  }
  root.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
  
  if (root.classList && root.classList.contains('counter-val')) {
    counterObserver.observe(root);
  }
  root.querySelectorAll('.counter-val').forEach(el => {
    counterObserver.observe(el);
  });
}

function initMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          scanAndObserve(node);
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}


function initScrollProgress() {
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
  }

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight);
    progressBar.style.transform = `scaleX(${scrolled})`;
  });
}

function initSectionIndicators() {
  const sections = document.querySelectorAll('main > section[id]');
  if (sections.length === 0) return;

  let indicator = document.querySelector('.section-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'section-indicator';
    document.body.appendChild(indicator);
  }

  sections.forEach((section, index) => {
    const dot = document.createElement('div');
    dot.className = 'section-indicator__dot';
    dot.setAttribute('data-label', section.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    indicator.appendChild(dot);
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    const dots = indicator.querySelectorAll('.section-indicator__dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (sections[index] && sections[index].getAttribute('id') === current) {
        dot.classList.add('active');
      }
    });
  });
}

function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-layer');
  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxElements.forEach((el, index) => {
      const speed = el.dataset.speed || (index + 1) * 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

function initStaggerAnimations() {
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animated');
          }, index * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerGroups.forEach(group => {
    staggerObserver.observe(group);
  });
}



function initMouseTrail() {
  // Create trail elements
  const trailCount = 8;
  const trails = [];
  
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    document.body.appendChild(trail);
    trails.push({
      element: trail,
      x: 0,
      y: 0,
      currentX: 0,
      currentY: 0
    });
  }

  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;
  let movingTimeout;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    isMoving = true;
    trails.forEach(trail => trail.element.classList.add('active'));
    
    clearTimeout(movingTimeout);
    movingTimeout = setTimeout(() => {
      isMoving = false;
      trails.forEach(trail => trail.element.classList.remove('active'));
    }, 150);
  });

  function animateTrail() {
    trails.forEach((trail, index) => {
      const delay = index * 0.05;
      
      trail.x += (mouseX - trail.x) * (0.1 - delay);
      trail.y += (mouseY - trail.y) * (0.1 - delay);
      
      trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px) scale(${1 - (index * 0.1)})`;
      trail.element.style.opacity = isMoving ? (0.6 - (index * 0.07)) : 0;
    });
    
    requestAnimationFrame(animateTrail);
  }
  
  animateTrail();
}

function initLiquidBackground() {
  const canvas = document.querySelector('.liquid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let targetMouseX = -1e3;
  let targetMouseY = -1e3;
  let currentMouseX = -1e3;
  let currentMouseY = -1e3;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = e.clientX - rect.left;
    targetMouseY = e.clientY - rect.top;
  });

  document.addEventListener('mouseleave', () => {
    targetMouseX = -1e3;
    targetMouseY = -1e3;
  });

  class Blob {
    constructor(width, height, isMouse = false) {
      this.isMouse = isMouse;
      this.radius = isMouse ? 130 : Math.random() * 140 + 110;
      this.x = Math.random() * (width - this.radius * 2) + this.radius;
      this.y = Math.random() * (height - this.radius * 2) + this.radius;
      this.vx = isMouse ? 0 : (Math.random() - 0.5) * 0.7;
      this.vy = isMouse ? 0 : (Math.random() - 0.5) * 0.7;
      this.morphSpeed = Math.random() * 0.6 + 0.3;
      this.morphAmount = Math.random() * 30 + 15;
      this.seed = Math.random() * 100;
      
      this.color = isMouse 
        ? 'rgba(245, 93, 45, 0.38)' 
        : [
            'rgba(245, 93, 45, 0.22)',
            'rgba(212, 238, 54, 0.14)',
            'rgba(7, 0, 255, 0.06)'
          ][Math.floor(Math.random() * 3)];
    }

    update(width, height) {
      if (this.isMouse) {
        if (targetMouseX > -500) {
          currentMouseX += (targetMouseX - currentMouseX) * 0.07;
          currentMouseY += (targetMouseY - currentMouseY) * 0.07;
          this.x = currentMouseX;
          this.y = currentMouseY;
        } else {
          this.x = -1e3;
          this.y = -1e3;
        }
        return;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x - this.radius < 0 && this.vx < 0) this.vx *= -1;
      if (this.x + this.radius > width && this.vx > 0) this.vx *= -1;
      if (this.y - this.radius < 0 && this.vy < 0) this.vy *= -1;
      if (this.y + this.radius > height && this.vy > 0) this.vy *= -1;
    }

    draw(context) {
      if (this.isMouse && this.x < -500) return;

      context.beginPath();
      const numPoints = 16;
      const time = Date.now() * 0.001 * this.morphSpeed;
      
      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const offset = Math.sin(angle * 3 + time + this.seed) * Math.cos(angle * 2 - time) * this.morphAmount;
        const r = this.radius + offset;
        const x = this.x + Math.cos(angle) * r;
        const y = this.y + Math.sin(angle) * r;
        
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
    }
  }

  class EnergyNode {
    constructor(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 40 + 30;
      this.color = 'rgba(245, 93, 45, 0.12)';
      this.speed = Math.random() * 0.2 + 0.08;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.008;
    }

    update(width, height) {
      this.angle += this.spin;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();
    }
  }

  const blobs = [];
  const blobCount = 6;
  for (let i = 0; i < blobCount; i++) {
    blobs.push(new Blob(canvas.width, canvas.height));
  }

  const mouseBlob = new Blob(canvas.width, canvas.height, true);
  blobs.push(mouseBlob);

  const energyNodes = [];
  const nodeCount = 10;
  for (let i = 0; i < nodeCount; i++) {
    energyNodes.push(new EnergyNode(canvas.width, canvas.height));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    blobs.forEach(blob => {
      blob.update(canvas.width, canvas.height);
      blob.draw(ctx);
    });

    energyNodes.forEach(node => {
      node.update(canvas.width, canvas.height);
      node.draw(ctx);
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}

function initForms() {
  bindFormSubmit('contact-form', 'Contact inquiry successfully submitted! We will reach out to you within 24 hours.');
  bindFormSubmit('inquiry-form', 'Business inquiry successfully received. A growth architect will contact you shortly.');
  bindFormSubmit('apply-form', 'Your application was successfully uploaded. Our recruitment cell will review it.');
}

function bindFormSubmit(formId, successMsg) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;

    form.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    form.querySelectorAll('.form-input--error').forEach(el => el.classList.remove('form-input--error'));

    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        hasError = true;
        input.classList.add('form-input--error');
        
        const err = document.createElement('span');
        err.className = 'form-error-msg';
        err.textContent = 'This field is required.';
        input.parentElement.appendChild(err);
      }
    });

    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        hasError = true;
        emailInput.classList.add('form-input--error');
        
        const err = document.createElement('span');
        err.className = 'form-error-msg';
        err.textContent = 'Please enter a valid email address.';
        emailInput.parentElement.appendChild(err);
      }
    }

    if (hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    setTimeout(() => {
      
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      const successDiv = document.createElement('div');
      successDiv.className = 'form-success-msg fade-in';
      successDiv.textContent = successMsg;
      
      form.insertBefore(successDiv, form.firstChild);

      setTimeout(() => {
        successDiv.remove();
      }, 8000);
      
    }, 1500);
  });
}

const TECH_DATA = {
  html5: {
    name: 'HTML5',
    category: 'Frontend',
    description: 'Semantic markup standard for web documents, providing structure, accessibility, and SEO foundations.',
    experience: 'Expert',
    usecases: 'Semantic Web, SPA Structure, SEO Schema Markup',
    related: ['css3', 'javascript'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L2 5l1.8 14.2L12 22l8.2-2.8L22 5zM17.8 8.8h-7.2l-.3 1.8h7.2l-.5 4.8-5 1.7-5-1.7-.3-2.6h1.8l.2 1.4 3.3 1.1 3.3-1.1.3-2.8H7.3l.7-5.4h10.2z"/></svg>`
  },
  css3: {
    name: 'CSS3',
    category: 'Frontend',
    description: 'Advanced responsive presentation sheets, utilizing CSS grid, flexbox, custom variables, and keyframe animations.',
    experience: 'Expert',
    usecases: 'User Interface Design, Animations, Responsive Layouts',
    related: ['html5', 'javascript'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L2 5l1.8 14.2L12 22l8.2-2.8L22 5zM17.3 9.3h-6.7l-.3 1.8h6.7l-.4 3.7-4.6 1.5-4.6-1.5-.2-1.8h1.8l.1.9 3 1 3-1 .2-2.2H7.6l.5-4.4h9.7z"/></svg>`
  },
  javascript: {
    name: 'JavaScript ES6+',
    category: 'Frontend',
    description: 'High-performance scripting language, using modern async/await patterns, ES Modules, and native DOM APIs.',
    experience: 'Expert',
    usecases: 'Interactive Logic, State Management, API Communication',
    related: ['html5', 'css3', 'react', 'typescript'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 3h18v18H3zm13.3 12.3c-.2-1-.8-1.5-1.8-1.5-1.1 0-1.6.6-1.6 1.5 0 .9.5 1.3 1.6 1.8l1 .4c1.6.6 2.5 1.4 2.5 3.1 0 2-1.6 3.2-3.8 3.2-2.2 0-3.6-1.1-3.9-2.9h2c.2 1 .9 1.4 1.8 1.4 1 0 1.6-.4 1.6-1.2 0-.8-.4-1.1-1.4-1.5l-1-.4c-1.6-.6-2.5-1.4-2.5-3.1 0-1.8 1.4-3.1 3.6-3.1 2 0 3.3 1 3.7 2.7zm-6.2-2.1v9h-2v-9z"/></svg>`
  },
  react: {
    name: 'React',
    category: 'Frontend',
    description: 'Component-driven UI library for building dynamic, single-page client applications with fast virtual rendering.',
    experience: 'Expert',
    usecases: 'SaaS Dashboards, Dynamic Web Applications, Component Systems',
    related: ['typescript', 'graphql', 'javascript'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`
  },
  vue: {
    name: 'Vue.js',
    category: 'Frontend',
    description: 'Progressive, lightweight user interface framework featuring two-way reactive binding and modular composition APIs.',
    experience: 'Intermediate',
    usecases: 'Frontends, Interactive Page Sections, SPAs',
    related: ['javascript', 'typescript'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 3.5h-3.8L12 13.7 5.8 3.5H2l10 17z"/><path d="M18.2 3.5H15l-3 5-3-5H5.8L12 14z"/></svg>`
  },
  typescript: {
    name: 'TypeScript',
    category: 'Frontend',
    description: 'Strictly typed superset of JavaScript, preventing compiler errors and ensuring type safety on large-scale builds.',
    experience: 'Expert',
    usecases: 'Enterprise Codebases, Scalable Core Libraries, API Contracts',
    related: ['javascript', 'react', 'node'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 3h18v18H3zm13.8 9H11.5v9h-2v-9H4.6v-2h12.2zM21 16.5c0-1.8-1.5-3-3.6-3-2.1 0-3.6 1.2-3.6 3v4.5h2V16.5c0-.8.6-1.2 1.6-1.2s1.6.4 1.6 1.2v4.5h2z"/></svg>`
  },
  node: {
    name: 'Node.js',
    category: 'Backend',
    description: 'Asynchronous event-driven JavaScript runtime built on Chrome\'s V8 engine, powering scalable network apps.',
    experience: 'Expert',
    usecases: 'REST & GraphQL APIs, Microservices, Real-time Servers',
    related: ['typescript', 'postgresql', 'mongodb', 'redis'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L3.5 7v10L12 22l8.5-5V7zm-1.5 15.3l-4.5-2.6v-5.2l4.5 2.6zm6-3.4l-4.5 2.6V11.3l4.5-2.6z"/></svg>`
  },
  python: {
    name: 'Python',
    category: 'Backend',
    description: 'High-level general purpose language popular for scripting, automated pipelines, data science, and web APIs.',
    experience: 'Expert',
    usecases: 'Data Analysis, Automation Scripts, AI Integrations, APIs',
    related: ['postgresql', 'mongodb'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2A10 10 0 0 0 2 12c0 2 .5 3.9 1.5 5.5l1.5-1.5A8 8 0 0 1 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-2 0-3.9-.7-5.5-2l-1.5 1.5c2 1.6 4.6 2.5 7 2.5a10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/></svg>`
  },
  postgresql: {
    name: 'PostgreSQL',
    category: 'Backend',
    description: 'Powerful, open source object-relational database system with strong reliability, SQL compliance, and JSON support.',
    experience: 'Expert',
    usecases: 'Relational Data Storage, User Analytics, Structured Inventories',
    related: ['node', 'python'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>`
  },
  mongodb: {
    name: 'MongoDB',
    category: 'Backend',
    description: 'NoSQL document-oriented database designed for developer agility, flexible BSON schemas, and seamless scaling.',
    experience: 'Expert',
    usecases: 'Content Inventories, Document Storage, Flexible Schemas',
    related: ['node', 'python'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.7 5.3 7 9.3 7 12c0 3 1.3 6 5 10 3.7-4 5-7 5-10 0-2.7-1.7-6.7-5-10z"/></svg>`
  },
  redis: {
    name: 'Redis',
    category: 'Backend',
    description: 'In-memory data structure store used as a distributed, ultra-fast cache, session manager, and message broker.',
    experience: 'Expert',
    usecases: 'Data Caching, Session Management, Real-time Queueing',
    related: ['node'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5zm-10 10l10 5 10-5-10-3zm0 5l10 5 10-5-10-3z"/></svg>`
  },
  graphql: {
    name: 'GraphQL',
    category: 'Backend',
    description: 'Query language and server runtime for APIs, letting clients request exactly the data they need and nothing more.',
    experience: 'Expert',
    usecases: 'Federated APIs, Client Fetching Optimization, High-speed APIs',
    related: ['react', 'node'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><polygon points="12 6.5 17.5 10 17.5 14 12 17.5 6.5 14 6.5 10"/></svg>`
  },
  aws: {
    name: 'AWS',
    category: 'Cloud & DevOps',
    description: 'Comprehensive global cloud services suite, hosting scalable virtual instances, databases, and serverless compute.',
    experience: 'Expert',
    usecases: 'Infrastructure Hosting, Serverless Functions, S3 Storage',
    related: ['docker', 'kubernetes', 'terraform'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.4 13c0-2-1.3-3-3-3-1.6 0-3 1-3 3s1.4 3 3 3c1.7 0 3-1 3-3zm-6-6.5a8.5 8.5 0 0 0-8.5 8.5c0 4.7 3.8 8.5 8.5 8.5a8.4 8.4 0 0 0 7.8-5.3h-2.2a6.2 6.2 0 1 1-5.6-7.4c2.6 0 4.8 1.6 5.6 3.9h2.2A8.4 8.4 0 0 0 13.4 6.5z"/></svg>`
  },
  gcp: {
    name: 'Google Cloud',
    category: 'Cloud & DevOps',
    description: 'Highly secure cloud computing platform popular for container native management, analytical engines, and global scale.',
    experience: 'Intermediate',
    usecases: 'Container Clusters, Big Data Compute, Analytics Pipeline',
    related: ['kubernetes', 'docker'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
  },
  docker: {
    name: 'Docker',
    category: 'Cloud & DevOps',
    description: 'Industry standard OS virtualization platform packaging software services inside isolated, portable container boxes.',
    experience: 'Expert',
    usecases: 'Service Containerization, Consistent Dev Environments',
    related: ['aws', 'kubernetes', 'gcp', 'cicd'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="3" x2="12" y2="17"/></svg>`
  },
  kubernetes: {
    name: 'Kubernetes',
    category: 'Cloud & DevOps',
    description: 'Open source container orchestration engine automating deployment, cloud scaling, and load-balancing of clusters.',
    experience: 'Expert',
    usecases: 'Cluster Management, High Availability APIs, Cloud Scale',
    related: ['docker', 'aws', 'gcp'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6"/></svg>`
  },
  cicd: {
    name: 'CI/CD',
    category: 'Cloud & DevOps',
    description: 'Continuous Integration and Deployment pipelines automating unit tests, package builds, and instant cloud releases.',
    experience: 'Expert',
    usecases: 'Automated Testing, Production Releases, Code Quality Audits',
    related: ['docker', 'aws'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c2.37 0 4.55-.83 6.27-2.22l-1.42-1.42C15.58 19.34 13.88 20 12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8c0 1.88-.66 3.58-1.76 4.93l1.42 1.42C21.17 16.55 22 14.37 22 12z"/><polyline points="12 8 12 12 15 15"/></svg>`
  },
  terraform: {
    name: 'Terraform',
    category: 'Cloud & DevOps',
    description: 'Infrastructure as Code deployment engine creating cloud resources automatically using standard declaration models.',
    experience: 'Expert',
    usecases: 'Infrastructure Automation, Multi-cloud Provisioning',
    related: ['aws'],
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h10V4H7zM7 20h10v-6H7z"/><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/></svg>`
  }
};

function initOrbitalSystem() {
  const container = document.querySelector('.orbital-system-container');
  if (!container) return;

  const nodesContainer = container.querySelector('.orbital-nodes-container');
  const svg = container.querySelector('.orbital-connections-svg');
  const infoPanel = container.querySelector('.orbital-info-panel');
  const placeholder = infoPanel.querySelector('.orbital-info-placeholder');
  const content = infoPanel.querySelector('.orbital-info-content');

  const keys = Object.keys(TECH_DATA);
  const totalNodes = keys.length;
  
  // Dimensions and layout variables matching the SVG viewBox (540x540)
  const center = 270;
  const radius = 210;
  
  let currentAngle = 0;
  let isPaused = false;
  let selectedNodeKey = null;

  // Build the node elements
  const nodeElements = keys.map((key, i) => {
    const data = TECH_DATA[key];
    const baseAngle = (i * 360) / totalNodes;

    const el = document.createElement('div');
    el.className = 'orbital-node';
    el.setAttribute('data-tech', key);
    el.innerHTML = `
      <div class="orbital-node-icon">${data.icon}</div>
      <div class="orbital-node-label">${data.name}</div>
    `;

    nodesContainer.appendChild(el);

    el.addEventListener('click', () => {
      if (selectedNodeKey === key) {
        // Deselect
        selectedNodeKey = null;
        placeholder.style.display = 'block';
        content.style.display = 'none';
        drawConnections();
      } else {
        selectedNodeKey = key;
        showInfo(key);
        drawConnections();
      }
      updateActiveStates();
    });

    el.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    el.addEventListener('mouseleave', () => {
      if (!selectedNodeKey) {
        isPaused = false;
      }
    });

    return {
      el,
      key,
      baseAngle: (baseAngle * Math.PI) / 180
    };
  });

  // Pause rotation on orbital system hover
  const sys = container.querySelector('.orbital-system');
  sys.addEventListener('mouseenter', () => { isPaused = true; });
  sys.addEventListener('mouseleave', () => { if (!selectedNodeKey) isPaused = false; });

  // Soft click anchor
  const core = container.querySelector('.orbital-core');
  core.addEventListener('click', () => {
    selectedNodeKey = null;
    isPaused = false;
    placeholder.style.display = 'block';
    content.style.display = 'none';
    updateActiveStates();
    drawConnections();
  });

  function updateActiveStates() {
    nodeElements.forEach(item => {
      item.el.classList.remove('active', 'related');
      if (item.key === selectedNodeKey) {
        item.el.classList.add('active');
      } else if (selectedNodeKey) {
        const activeData = TECH_DATA[selectedNodeKey];
        if (activeData.related.includes(item.key)) {
          item.el.classList.add('related');
        }
      }
    });
  }

  function showInfo(key) {
    const data = TECH_DATA[key];
    placeholder.style.display = 'none';
    content.style.display = 'block';
    
    content.querySelector('.info-title').textContent = data.name;
    content.querySelector('.info-category').textContent = data.category;
    content.querySelector('.info-desc').textContent = data.description;
    content.querySelector('.info-exp').textContent = data.experience;
    content.querySelector('.info-usecases').textContent = data.usecases;

    const relatedTags = content.querySelector('.info-related-tags');
    relatedTags.innerHTML = data.related.map(rKey => {
      const relData = TECH_DATA[rKey];
      return `<span class="related-tag" data-tech="${rKey}">${relData ? relData.name : rKey}</span>`;
    }).join('');

    relatedTags.querySelectorAll('.related-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const k = tag.getAttribute('data-tech');
        selectedNodeKey = k;
        showInfo(k);
        drawConnections();
        updateActiveStates();
      });
    });
  }

  // Draw SVG lines between the selected node and its related nodes
  function drawConnections() {
    svg.innerHTML = '';
    if (!selectedNodeKey) return;

    const activeNode = nodeElements.find(n => n.key === selectedNodeKey);
    if (!activeNode) return;

    const activeData = TECH_DATA[selectedNodeKey];
    
    // Core center coords
    const activeX = center + radius * Math.cos(activeNode.baseAngle + currentAngle);
    const activeY = center + radius * Math.sin(activeNode.baseAngle + currentAngle);

    // Draw connection to the central core first
    const coreLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    coreLine.setAttribute('x1', activeX);
    coreLine.setAttribute('y1', activeY);
    coreLine.setAttribute('x2', center);
    coreLine.setAttribute('y2', center);
    coreLine.setAttribute('class', 'connection-line connection-line-core');
    svg.appendChild(coreLine);

    // Draw connections to related nodes
    activeData.related.forEach(relKey => {
      const relNode = nodeElements.find(n => n.key === relKey);
      if (!relNode) return;

      const relX = center + radius * Math.cos(relNode.baseAngle + currentAngle);
      const relY = center + radius * Math.sin(relNode.baseAngle + currentAngle);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', activeX);
      line.setAttribute('y1', activeY);
      line.setAttribute('x2', relX);
      line.setAttribute('y2', relY);
      line.setAttribute('class', 'connection-line');
      svg.appendChild(line);
    });
  }

  // Main animation frame loop
  function tick() {
    if (!isPaused) {
      currentAngle += 0.002; // Very slow rotation: ~20-30 seconds per revolution
      
      // Update node DOM positions
      nodeElements.forEach(item => {
        const angle = item.baseAngle + currentAngle;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        
        // Express position in percentages of the 540x540 canvas to support scale responsiveness
        const pctX = (x / 540) * 100;
        const pctY = (y / 540) * 100;

        item.el.style.left = `${pctX}%`;
        item.el.style.top = `${pctY}%`;
      });

      // Update lines dynamically if rotation is moving (usually paused when clicked, but safe to update)
      if (selectedNodeKey) {
        drawConnections();
      }
    }
    requestAnimationFrame(tick);
  }

  // Kick off the loop
  tick();
}

/**
 * Client Testimonials for Riverbird.
 */

const testimonials = [
  {
    quote: "Riverbird delivered a highly secure, high-performance software system that integrated seamlessly into our manufacturing sites. Their engineering expertise is world-class.",
    author: "Rajesh Kumar",
    role: "Chief Technology Officer",
    company: "Meridian Industries",
    avatar: "assets/images/avatar_rajesh.jpg"
  },
  {
    quote: "The digital marketing campaigns run by Riverbird transformed our acquisition loops. Their technical SEO audits and paid ads models exceeded our growth metrics.",
    author: "Priya Sharma",
    role: "VP of Growth & Marketing",
    company: "TechVenture Solutions",
    avatar: "assets/images/avatar_priya.jpg"
  },
  {
    quote: "Sourcing talent is a major bottleneck in our operations. Riverbird's staffing cell deployed pre-vetted engineers who were productive on day one.",
    author: "Arun Menon",
    role: "Director of Operations",
    company: "Coastal Summit Group",
    avatar: "assets/images/avatar_arun.jpg"
  }
];

/**
 * Corporate Case Studies for Riverbird.
 */

const caseStudies = [
  {
    id: "fashyfi-launch",
    title: "Launching Fashyfi — E-Commerce Scaling",
    client: "Fashyfi Inc.",
    category: "Product Development & Marketing",
    tagline: "Building and marketing a global social e-commerce solution.",
    description: "Riverbird engineered Fashyfi from a simple wireframe into a high-performance web platform, followed by a data-driven digital marketing campaign that acquired 100k+ active users within 90 days.",
    results: [
      { metric: "100K+", label: "Active Users" },
      { metric: "185ms", label: "Page Load Speed" },
      { metric: "4.2x", label: "Marketing ROI" }
    ],
    image: "assets/images/case_fashyfi.jpg"
  },
  {
    id: "meridian-erp",
    title: "Meridian Industrial Systems — Enterprise ERP",
    client: "Meridian Systems",
    category: "Software Development",
    tagline: "Modernizing manufacturing workflows for enterprise operations.",
    description: "We replaced Meridian's legacy manufacturing database with a secure, real-time microservices dashboard, tracking materials, shipping logs, and employee schedules across five factories.",
    results: [
      { metric: "35%", label: "Operational Speedup" },
      { metric: "99.99%", label: "System Uptime" },
      { metric: "$1.2M", label: "Yearly Savings" }
    ],
    image: "assets/images/case_meridian.jpg"
  },
  {
    id: "techventure-staffing",
    title: "TechVenture Inc. — Dedicated Engineering Cell",
    client: "TechVenture Solutions",
    category: "Staffing Solutions",
    tagline: "Deploying a pre-vetted team of 15 senior developers.",
    description: "TechVenture needed to scale their database team to meet client launch schedules. Riverbird sourced, screened, and deployed 15 senior developers within two weeks, completing the project on schedule.",
    results: [
      { metric: "14 Days", label: "Deployment Time" },
      { metric: "100%", label: "SLA Compliance" },
      { metric: "15", label: "Senior Engineers Placed" }
    ],
    image: "assets/images/case_techventure.jpg"
  }
];

/**
 * Open job positions at Riverbird.
 */

const jobListings = [
  {
    id: "snr-backend-eng",
    title: "Senior Backend Engineer (Python/Django)",
    department: "it",
    location: "Chennai, India (Hybrid)",
    type: "Full-Time",
    experience: "5+ Years",
    description: "Lead the development of custom enterprise backend solutions, microservice endpoints, and schema design for manufacturing scale operations."
  },
  {
    id: "frontend-dev",
    title: "Frontend Architect (Vanilla JS/CSS3)",
    department: "it",
    location: "Chennai, India (On-Site)",
    type: "Full-Time",
    experience: "3+ Years",
    description: "Build premium, performant, and responsive web pages and digital interfaces with pure vanilla technologies. Focus on Lighthouse scores."
  },
  {
    id: "digital-marketing-lead",
    title: "Digital Marketing Specialist (Paid Ads)",
    department: "marketing",
    location: "Remote (India)",
    type: "Full-Time",
    experience: "4+ Years",
    description: "Design, launch, and optimize paid advertising campaigns, lead generation forms, and ROI dashboards for startup and corporate clients."
  },
  {
    id: "video-animator",
    title: "Motion Graphic Designer & Video Editor",
    department: "marketing",
    location: "Chennai, India (Hybrid)",
    type: "Contract",
    experience: "2+ Years",
    description: "Produce premium explainer videos, brand trailers, and motion graphic assets for digital launch channels."
  },
  {
    id: "intern-dev",
    title: "Web Engineering Intern",
    department: "internship",
    location: "Chennai, India (On-Site)",
    type: "Internship (6 Months)",
    experience: "Freshers Welcome",
    description: "Learn and construct semantic web components, CSS layouts, and simple ES modules. Potential for conversion to full-time."
  }
];

/**
 * Editorial Blog Posts for Riverbird.
 */

const blogs = [
  {
    id: "vanilla-js-performance",
    title: "Why We Choose Vanilla JS for Enterprise Scaling",
    category: "Engineering",
    excerpt: "Exploring the latency, asset size, and long-term maintenance advantages of building core systems without heavy framework dependencies.",
    date: "June 10, 2026",
    readTime: "5 Min Read",
    image: "assets/images/blog_vanilla.jpg"
  },
  {
    id: "seo-lighthouse-metrics",
    title: "Cracking the Google PageRank: A 100/100 Lighthouse Story",
    category: "Marketing",
    excerpt: "How we structured our HTML tags, lazyloaded assets, and streamlined script payloads to achieve maximum SEO search indexing.",
    date: "June 05, 2026",
    readTime: "7 Min Read",
    image: "assets/images/blog_seo.jpg"
  },
  {
    id: "talent-acquisition-pipeline",
    title: "RPO Blueprint: Sourcing Senior Engineers in Under 14 Days",
    category: "Staffing",
    excerpt: "Vetting developers requires speed and technical accuracy. Here is the operational checklist our recruitment cell uses to find the top 2% talent.",
    date: "May 28, 2026",
    readTime: "6 Min Read",
    image: "assets/images/blog_talent.jpg"
  }
];

/**
 * Brand services and process details for Riverbird.
 */

const developmentSolutions = {
  process: [
    {
      step: "01",
      title: "Discovery & Blueprint",
      description: "Analyzing infrastructure requirements, designing layout wireframes, and writing technical blueprints."
    },
    {
      step: "02",
      title: "Architect & Build",
      description: "Setting up design tokens, coding modular files, and implementing server/database integrations."
    },
    {
      step: "03",
      title: "Integrate & Secure",
      description: "Performing strict unit testing, setting up SSL, encryption protocols, and performance profiling."
    },
    {
      step: "04",
      title: "Deploy & Scale",
      description: "Releasing to production environments via continuous integration pipelines with active monitoring."
    }
  ]};

const ICONS = {
  software: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  
  web: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  
  app: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
  
  marketing: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  
  design: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03345 19.1749 5.099 19.426 5.02194 19.6601C4.78604 20.377 4.66136 21.1402 4.66136 21.9333C4.66136 21.9702 4.69123 22 4.72808 22C6.18342 22 7.52044 21.4646 8.54807 20.58C8.75168 20.4047 9.04354 20.3853 9.26786 20.5099C10.1264 20.9868 11.0331 21.2599 12 21.2599V22Z"></path><circle cx="7.5" cy="10.5" r="1.5"></circle><circle cx="11.5" cy="7.5" r="1.5"></circle><circle cx="16.5" cy="9.5" r="1.5"></circle></svg>`,
  
  video: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
  
  tag: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  
  user: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  
  megaphone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
  
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  
  dollar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  
  target: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  
  handshake: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  
  userPlus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
  
  manpower: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  
  settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  
  building: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><path d="M9 22V12h6v10"></path><path d="M8 7h.01"></path><path d="M16 7h.01"></path><path d="M8 12h.01"></path><path d="M16 12h.01"></path></svg>`,
  
  zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  
  bag: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  
  upload: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  
  arrowRight: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,

  chevronDown: `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="rb-icon"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  location: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,

  mail: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="rb-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
};

function getIcon(key) {
  return ICONS[key] || '';
}

function renderTestimonials(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = testimonials.map(item => `
    <div class="card-testimonial reveal stagger-item">
      <p class="card-testimonial__quote">"${item.quote}"</p>
      <div class="card-testimonial__author">
        <div class="card-testimonial__avatar scale-pulse" style="background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--font-primary);">
          ${item.author.charAt(0)}
        </div>
        <div class="card-testimonial__info">
          <h4>${item.author}</h4>
          <p>${item.role}, ${item.company}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCaseStudies(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const items = caseStudies.slice(0, limit);

  container.innerHTML = items.map((study, index) => `
    <div class="card card-showcase reveal stagger-item parallax-layer" data-speed="${0.2 + (index * 0.1)}">
      
      <div class="card-showcase__bg morph-shape" style="background: linear-gradient(135deg, var(--color-bg-alt) 0%, rgba(245,93,45,0.15) 100%); position:absolute; width:100%; height:100%; top:0; left:0; z-index:1;"></div>
      <div class="card-showcase__content">
        <span class="label-text wipe-in" style="color: var(--color-primary); margin-bottom: var(--space-8);">${study.category}</span>
        <h3 class="card-showcase__title h3">${study.title}</h3>
        <p class="card-showcase__desc">${study.tagline}</p>
        <div style="display: flex; gap: var(--space-24); margin-top: var(--space-16); border-top: 1px solid var(--color-border); padding-top: var(--space-16);">
          ${study.results.map(res => `
            <div class="reveal">
              <div class="counter-num" style="font-family: var(--font-primary); font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">${res.metric}</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${res.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderJobs(containerId, filterDept = 'all') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filteredJobs = filterDept === 'all' 
    ? jobListings 
    : jobListings.filter(job => job.department === filterDept);

  if (filteredJobs.length === 0) {
    container.innerHTML = `<p class="text-center body-text">No positions open in this department at this time.</p>`;
    return;
  }

  container.innerHTML = filteredJobs.map(job => `
    <div class="job-card reveal">
      <div class="job-card__main">
        <h3>${job.title}</h3>
        <div class="job-card__meta">
          <div class="job-card__meta-item">
            <span class="icon-wrap">${getIcon('location')}</span> ${job.location}
          </div>
          <div class="job-card__meta-item">
            <span class="icon-wrap">${getIcon('settings')}</span> ${job.type}
          </div>
          <div class="job-card__meta-item">
            <span class="icon-wrap">${getIcon('building')}</span> ${job.experience}
          </div>
        </div>
      </div>
      <a href="#apply-section" class="btn btn--outline btn--sm apply-job-trigger" data-job="${job.title}">Apply Now</a>
    </div>
  `).join('');

  document.querySelectorAll('.apply-job-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const jobTitle = e.target.getAttribute('data-job');
      const formInput = document.getElementById('apply-job-input');
      if (formInput) {
        formInput.value = jobTitle;
      }
    });
  });
}

function renderBlogs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = blogs.map(post => `
    <div class="card reveal">
      <div style="height: 180px; width: 100%; border-radius: var(--radius-sm); background: linear-gradient(135deg, rgba(7,0,255,0.1) 0%, rgba(245,93,45,0.1) 100%); margin-bottom: var(--space-20); display: flex; align-items: center; justify-content: center; font-family: var(--font-primary); font-weight: 700; color: var(--color-primary);">
        ${post.category} Focus
      </div>
      <span class="label-text">${post.category}</span>
      <h3 class="card__title h4">${post.title}</h3>
      <p class="card__desc">${post.excerpt}</p>
      <div class="flex-between" style="border-top: 1px solid var(--color-border); padding-top: var(--space-12); font-size: 0.8125rem; color: var(--color-text-muted);">
        <span>${post.date}</span>
        <span>${post.readTime}</span>
      </div>
    </div>
  `).join('');
}

function renderProcessSteps(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const stepIcons = [
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`
  ];

  container.innerHTML = developmentSolutions.process.map((step, index) => `
    <div class="bento-process-card${index === 0 ? ' bento-process-card--featured' : ''} reveal${index > 0 ? ` delay-${index}` : ''}">
      <div class="bento-process-card__inner">
        <div class="bento-process-card__dot-grid"></div>
        <div class="bento-process-card__header">
          <div class="bento-process-card__icon">
            ${stepIcons[index] || stepIcons[0]}
          </div>
          <span class="bento-process-card__step">${step.step}</span>
        </div>
        <h3 class="bento-process-card__title">${step.title}</h3>
        <p class="bento-process-card__desc">${step.description}</p>
        <div class="bento-process-card__glow"></div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-enabled');
  
  // No loader - instant page load
  document.body.classList.add('page-loaded');
  
  initLayout();

  initAnimations();

  initLiquidBackground();

  initForms();

  const pageName = document.body.getAttribute('data-page');
  
  if (pageName === 'home') {
    renderCaseStudies('home-case-studies', 3);
    renderTestimonials('home-testimonials');
    initOrbitalSystem();
  } 
  else if (pageName === 'development') {
    renderProcessSteps('dev-process-grid');
  }
  else if (pageName === 'company') {
    renderBlogs('company-blog-grid');
  }
  else if (pageName === 'careers') {
    const hash = window.location.hash.replace('#', '');
    const validDepts = ['it', 'marketing', 'internship'];
    const initialDept = validDepts.includes(hash) ? hash : 'all';
    
    renderJobs('careers-jobs-grid', initialDept);
    setupCareersFilter(initialDept);
    
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      const newDept = validDepts.includes(newHash) ? newHash : 'all';
      renderJobs('careers-jobs-grid', newDept);
      updateFilterButtons(newDept);
    });
  }
});

function setupCareersFilter(activeDept = 'all') {
  const filterContainer = document.querySelector('.careers-filter');
  if (!filterContainer) return;

  updateFilterButtons(activeDept);

  filterContainer.querySelectorAll('.careers-filter__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dept = btn.getAttribute('data-filter');
      window.location.hash = dept === 'all' ? '' : dept;
    });
  });
}

function updateFilterButtons(activeDept) {
  const filterContainer = document.querySelector('.careers-filter');
  if (!filterContainer) return;
  filterContainer.querySelectorAll('.careers-filter__btn').forEach(btn => {
    const dept = btn.getAttribute('data-filter');
    if (dept === activeDept) {
      btn.classList.add('careers-filter__btn--active');
    } else {
      btn.classList.remove('careers-filter__btn--active');
    }
  });
}
