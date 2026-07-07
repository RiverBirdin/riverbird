import { testimonials } from '../../../data/testimonials.js';
import { caseStudies } from '../../../data/case_studies.js';
import { jobListings } from '../../../data/jobs.js';
import { blogs } from '../../../data/blogs.js';
import { developmentSolutions } from '../../../data/services.js';
import { resolvePath } from '../utils/paths.js';
import { getIcon } from './icons.js';

export function renderTestimonials(containerId) {
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

export function renderCaseStudies(containerId, limit = 3) {
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

export function renderJobs(containerId, filterDept = 'all') {
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

export function renderBlogs(containerId) {
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

export function renderDevServices(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = developmentSolutions.services.map(svc => `
    <div id="${svc.id}" class="card reveal">
      <div class="card__icon">${getIcon(svc.icon)}</div>
      <h3 class="card__title">${svc.title}</h3>
      <p class="card__desc">${svc.description}</p>
      <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem; color: var(--color-text-dark); margin-bottom: var(--space-16);">
        ${svc.bullets.map(b => `<li style="display: flex; gap: 8px; align-items: center;"><span style="color: var(--color-primary);">✓</span> ${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

export function renderProcessSteps(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = developmentSolutions.process.map((step, index) => `
    <div class="process-step reveal stagger-item">
     
      <div class="process-step__header">
        <span class="process-step__num">${step.step}</span>
        <h3 class="process-step__title h4">${step.title}</h3>
      </div>
      <div class="process-step__body">
        <p class="body-text body-small">${step.description}</p>
      </div>
    </div>
  `).join('');
}

export function renderTechStack(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = developmentSolutions.techStack.map(tech => `
    <div class="tech-item reveal">
      <div class="tech-item__icon">${getIcon(tech.icon)}</div>
      <div class="tech-item__name">${tech.name}</div>
    </div>
  `).join('');
}

export function renderFaqs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = developmentSolutions.faqs.map(faq => `
    <div class="faq-item reveal">
      <button class="faq-question">
        ${faq.question}
        <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="faq-answer">
        <p class="body-text">${faq.answer}</p>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('faq-item--open');

      container.querySelectorAll('.faq-item').forEach(el => el.classList.remove('faq-item--open'));
      
      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });
}
