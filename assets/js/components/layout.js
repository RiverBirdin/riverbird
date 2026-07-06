import { resolvePath } from '../utils/paths.js';

export function initLayout() {
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
}

function getNavbarHTML() {
  const logoUrl = resolvePath('assets/img/Logo-with-Text-copy.png');
  const homeUrl = resolvePath('index.html');
  const companyUrl = resolvePath('company/index.html');
  const mktUrl = resolvePath('digital-marketing/index.html');
  const devUrl = resolvePath('development/index.html');
  const staffingUrl = resolvePath('staffing/index.html');
  const productUrl = resolvePath('product/index.html');
  const careersUrl = resolvePath('careers/index.html');
  const contactUrl = resolvePath('contact/index.html');

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
                    <a href="${companyUrl}#blog" class="dropdown-menu__link">
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
                    <a href="${resolvePath('development/software.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Software Development</span>
                      <span class="dropdown-menu__item-desc">Enterprise database and custom scripting builds.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('development/web.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Web Development</span>
                      <span class="dropdown-menu__item-desc">High-performance reactive interfaces and SPAs.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('development/app.html')}" class="dropdown-menu__link">
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
                      <a href="${resolvePath('digital-marketing/graphic-design.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Graphic Design</span>
                        <span class="mega-menu__item-desc">Professional branding and high-end vectors.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('digital-marketing/video-production.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Video Production</span>
                        <span class="mega-menu__item-desc">High-quality editing and corporate media.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('digital-marketing/brand-identity.html')}" class="mega-menu__link">
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
                      <a href="${resolvePath('digital-marketing/seo.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">SEO (Google Ranking)</span>
                        <span class="mega-menu__item-desc">Technical search rankings & audit pipelines.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('digital-marketing/personal-branding.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Personal Branding</span>
                        <span class="mega-menu__item-desc">Authority design for executives and founders.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('digital-marketing/social-media.html')}" class="mega-menu__link">
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
                      <a href="${resolvePath('digital-marketing/paid-ads.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Paid Ads (Meta & Google)</span>
                        <span class="mega-menu__item-desc">ROI campaigns across Search and Social.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('digital-marketing/lead-generation.html')}" class="mega-menu__link">
                        <span class="mega-menu__item-title">Lead Generation System</span>
                        <span class="mega-menu__item-desc">Qualified pipelines for sales outreach.</span>
                      </a>
                    </li>
                    <li>
                      <a href="${resolvePath('digital-marketing/influencer-marketing.html')}" class="mega-menu__link">
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
                    <a href="${resolvePath('staffing/talent-management.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Talent Management</span>
                      <span class="dropdown-menu__item-desc">Corporate HR growth scorecards.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('staffing/hire-talent.html')}" class="dropdown-menu__link">
                      <span class="dropdown-menu__item-title">Hire Talents</span>
                      <span class="dropdown-menu__item-desc">Vetted engineering and UI specialists.</span>
                    </a>
                  </li>
                  <li>
                    <a href="${resolvePath('staffing/manpower.html')}" class="dropdown-menu__link">
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
            <a href="${companyUrl}#blog" class="mobile-menu__sublink">Blog</a>
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
            <a href="${resolvePath('development/software.html')}" class="mobile-menu__sublink">Software Development</a>
            <a href="${resolvePath('development/web.html')}" class="mobile-menu__sublink">Web Development</a>
            <a href="${resolvePath('development/app.html')}" class="mobile-menu__sublink">Application Development</a>
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
            <a href="${resolvePath('digital-marketing/social-media.html')}" class="mobile-menu__sublink">Social Media Marketing</a>
            <a href="${resolvePath('digital-marketing/graphic-design.html')}" class="mobile-menu__sublink">Graphic Design</a>
            <a href="${resolvePath('digital-marketing/video-production.html')}" class="mobile-menu__sublink">Video Production</a>
            <a href="${resolvePath('digital-marketing/brand-identity.html')}" class="mobile-menu__sublink">Brand Identity</a>
            <a href="${resolvePath('digital-marketing/personal-branding.html')}" class="mobile-menu__sublink">Personal Branding</a>
            <a href="${resolvePath('digital-marketing/influencer-marketing.html')}" class="mobile-menu__sublink">Influencer Marketing</a>
            <a href="${resolvePath('digital-marketing/seo.html')}" class="mobile-menu__sublink">SEO (Google Ranking)</a>
            <a href="${resolvePath('digital-marketing/paid-ads.html')}" class="mobile-menu__sublink">Paid Ads (Meta & Google)</a>
            <a href="${resolvePath('digital-marketing/lead-generation.html')}" class="mobile-menu__sublink">Lead Generation System</a>
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
            <a href="${resolvePath('staffing/talent-management.html')}" class="mobile-menu__sublink">Talent Management</a>
            <a href="${resolvePath('staffing/hire-talent.html')}" class="mobile-menu__sublink">Hire Talents</a>
            <a href="${resolvePath('staffing/manpower.html')}" class="mobile-menu__sublink">Manpower Solutions</a>
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
  const logoUrl = resolvePath('assets/img/logo.png');
  const homeUrl = resolvePath('index.html');
  const companyUrl = resolvePath('company/index.html');
  const devUrl = resolvePath('development/index.html');
  const mktUrl = resolvePath('digital-marketing/index.html');
  const staffingUrl = resolvePath('staffing/index.html');
  const productUrl = resolvePath('product/index.html');
  const careersUrl = resolvePath('careers/index.html');
  const contactUrl = resolvePath('contact/index.html');

  const instagramIcon = resolvePath('assets/img/icons/instagram (1).png');
  const linkedinIcon = resolvePath('assets/img/icons/social.png');
  const facebookIcon = resolvePath('assets/img/icons/facebook.png');
  const youtubeIcon = resolvePath('assets/img/icons/play.png');

  const isHomePage = document.body.getAttribute('data-page') === 'home';

  return `
    <footer class="footer py-2xl">
      <div class="container">
        
        <!-- 3D Agents Showcase -->
        ${isHomePage ? '' : `
        <div class="footer__avatars-section reveal">
          <div class="footer__avatars-header">
            <span class="label-text">Growth Optimization Squad</span>
            <h3 class="footer__avatars-title">Connect With Our 3D Digital Squad</h3>
            <p>Our cross-functional campaign and technology agents active on your scaling parameters.</p>
          </div>
          
          <div class="footer__avatars-grid">
            <!-- Kai (Growth) -->
            <div class="avatar-card">
              <div class="avatar-sphere" style="--avatar-glow-color: rgba(245, 93, 45, 0.25);">
                <div class="avatar-sphere__glow"></div>
                <div class="avatar-sphere__image">
                  <svg viewBox="0 0 100 100" class="avatar-sphere__icon">
                    <defs>
                      <linearGradient id="gradKai" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#F55D2D" />
                        <stop offset="100%" stop-color="#FFA285" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="url(#gradKai)" />
                    <path d="M30 40 Q50 15 70 40 Q75 60 70 80 H30 Q25 60 30 40 Z" fill="#1C1921" />
                    <circle cx="50" cy="45" r="20" fill="#FFE3D1" />
                    <path d="M35 42 L65 42 L60 52 L40 52 Z" fill="#0D0C10" stroke="#FFA285" stroke-width="1.5" />
                    <line x1="35" y1="42" x2="65" y2="42" stroke="#FFA285" stroke-width="2" />
                    <path d="M45 58 Q50 63 55 58" stroke="#0D0C10" stroke-width="1.5" stroke-linecap="round" fill="none" />
                    <path d="M40 65 L50 78 L60 65" fill="#FFFFFF" />
                    <path d="M48 68 L50 82 L52 68" fill="#F55D2D" />
                  </svg>
                </div>
              </div>
              <div class="avatar-tag avatar-tag--top">ROI +180%</div>
              <div class="avatar-tag avatar-tag--bottom">Growth</div>
              <h4 class="avatar-card__name">Kai</h4>
              <p class="avatar-card__role">Growth Architect</p>
            </div>

            <!-- Luna (Creative) -->
            <div class="avatar-card">
              <div class="avatar-sphere" style="--avatar-glow-color: rgba(168, 85, 247, 0.25);">
                <div class="avatar-sphere__glow"></div>
                <div class="avatar-sphere__image">
                  <svg viewBox="0 0 100 100" class="avatar-sphere__icon">
                    <defs>
                      <linearGradient id="gradLuna" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#A855F7" />
                        <stop offset="100%" stop-color="#EC4899" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="url(#gradLuna)" />
                    <path d="M25 45 Q50 10 75 45 L70 85 H30 Z" fill="#E2E8F0" />
                    <circle cx="50" cy="48" r="18" fill="#FFD0BA" />
                    <rect x="34" y="42" width="32" height="10" rx="3" fill="#0700FF" opacity="0.8" stroke="#FFFFFF" stroke-width="1" />
                    <line x1="38" y1="44" x2="44" y2="50" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
                    <line x1="50" y1="44" x2="56" y2="50" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M30 48 C 30 20, 70 20, 70 48" fill="none" stroke="#1C1921" stroke-width="4" />
                    <rect x="26" y="40" width="8" height="16" rx="3" fill="#1C1921" />
                    <rect x="66" y="40" width="8" height="16" rx="3" fill="#1C1921" />
                  </svg>
                </div>
              </div>
              <div class="avatar-tag avatar-tag--top">VFX Pro</div>
              <div class="avatar-tag avatar-tag--bottom">Creative</div>
              <h4 class="avatar-card__name">Luna</h4>
              <p class="avatar-card__role">Video & VFX Director</p>
            </div>

            <!-- Leo (SEO) -->
            <div class="avatar-card">
              <div class="avatar-sphere" style="--avatar-glow-color: rgba(59, 130, 246, 0.25);">
                <div class="avatar-sphere__glow"></div>
                <div class="avatar-sphere__image">
                  <svg viewBox="0 0 100 100" class="avatar-sphere__icon">
                    <defs>
                      <linearGradient id="gradLeo" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#3B82F6" />
                        <stop offset="100%" stop-color="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="url(#gradLeo)" />
                    <path d="M28 40 Q50 20 72 40 L70 85 H30 Z" fill="#334155" />
                    <circle cx="50" cy="47" r="19" fill="#FEE2E2" />
                    <path d="M33 43 H67 V51 H33 Z" fill="rgba(15, 23, 42, 0.9)" stroke="#06B6D4" stroke-width="1" />
                    <line x1="33" y1="47" x2="67" y2="47" stroke="#00F5FF" stroke-width="1.5" />
                    <path d="M46 59 H54" stroke="#334155" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M48 66 L50 85 L52 66" fill="#06B6D4" />
                  </svg>
                </div>
              </div>
              <div class="avatar-tag avatar-tag--top">Rank #1</div>
              <div class="avatar-tag avatar-tag--bottom">SEO</div>
              <h4 class="avatar-card__name">Leo</h4>
              <p class="avatar-card__role">Search Architect</p>
            </div>

            <!-- Aria (Ads) -->
            <div class="avatar-card">
              <div class="avatar-sphere" style="--avatar-glow-color: rgba(212, 238, 54, 0.25);">
                <div class="avatar-sphere__glow"></div>
                <div class="avatar-sphere__image">
                  <svg viewBox="0 0 100 100" class="avatar-sphere__icon">
                    <defs>
                      <linearGradient id="gradAria" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#D4EE36" />
                        <stop offset="100%" stop-color="#84CC16" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="url(#gradAria)" />
                    <path d="M26 40 Q50 15 74 40 L70 80 H30 Z" fill="#0D0C10" />
                    <circle cx="50" cy="46" r="18" fill="#FFF3E0" />
                    <circle cx="42" cy="45" r="7" fill="none" stroke="#0D0C10" stroke-width="2" />
                    <circle cx="58" cy="45" r="7" fill="none" stroke="#0D0C10" stroke-width="2" />
                    <line x1="49" y1="45" x2="51" y2="45" stroke="#0D0C10" stroke-width="2" />
                    <path d="M32 48 Q30 60 42 62" fill="none" stroke="#F55D2D" stroke-width="2" stroke-linecap="round" />
                    <circle cx="42" cy="62" r="2.5" fill="#F55D2D" />
                  </svg>
                </div>
              </div>
              <div class="avatar-tag avatar-tag--top">$1.2M+</div>
              <div class="avatar-tag avatar-tag--bottom">Ads</div>
              <h4 class="avatar-card__name">Aria</h4>
              <p class="avatar-card__role">Performance Director</p>
            </div>
          </div>
        </div>
        `}

        <div class="footer__top">
          
          <div class="footer__brand">
            <a href="${homeUrl}" class="footer__logo">
              <img src="${resolvePath('assets/img/Logo-with-Text-copy.png')}" alt="RiverBird Logo" />
            </a>
            <p>Empowering global enterprises and startups with custom software, marketing growth, and high-performance staffing.</p>
            <div class="footer__socials">
              <a href="https://instagram.com/riverbird.in" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src="${instagramIcon}" alt="Instagram" width="24" height="24" />
              </a>
              <a href="https://www.linkedin.com/company/riverbird-in/" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <img src="${linkedinIcon}" alt="LinkedIn" width="24" height="24" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61559792591988" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src="${facebookIcon}" alt="Facebook" width="24" height="24" />
              </a>
              <a href="https://www.youtube.com/@RiverBirddotin" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <img src="${youtubeIcon}" alt="YouTube" width="24" height="24" />
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
            <a href="#" class="footer__legal-link">Privacy Policy</a>
            <a href="#" class="footer__legal-link">Terms of Service</a>
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
  const firstSection = document.querySelector('main > section:first-of-type');
  const isDarkHero = false;

  const setLogo = (state) => {
    if (!logoImg) return;
    // Always use the logo with text, no switching needed
    logoImg.src = resolvePath('assets/img/Logo-with-Text-copy.png');
  };

  if (isDarkHero) {
    header.classList.add('header--dark-theme');
    setLogo('dark-bg');
  } else {
    setLogo('light-bg');
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 16) {
      header.classList.add('header--scrolled');
      setLogo('scrolled');
    } else {
      header.classList.remove('header--scrolled');
      if (isDarkHero) {
        setLogo('dark-bg');
      } else {
        setLogo('light-bg');
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

