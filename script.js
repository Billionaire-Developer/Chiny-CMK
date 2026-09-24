// ===== Mobile menu toggle =====
const menuToggle = document.getElementById('menuToggle');
const navlinks = document.querySelector('.navlinks');
if (menuToggle && navlinks) {
  function closeMobileMenu() {
    navlinks.classList.remove('open');
    navlinks.style.display = '';
  }
  menuToggle.addEventListener('click', () => {
    const isOpen = navlinks.classList.toggle('open');
    if (isOpen) {
      navlinks.style.display = 'flex';
      navlinks.style.position = 'absolute';
      navlinks.style.top = '100%';
      navlinks.style.left = '0';
      navlinks.style.right = '0';
      navlinks.style.background = '#fff';
      navlinks.style.flexDirection = 'column';
      navlinks.style.padding = '18px 24px';
      navlinks.style.borderBottom = '1px solid #DDE5EA';
      navlinks.style.gap = '14px';
    } else {
      navlinks.style.display = 'none';
    }
  });
  navlinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// ===== Quote / Feedback tab switch (contact page only) =====
const tabBtns = document.querySelectorAll('.tab-btn');
const quoteForm = document.getElementById('quote-form');
const feedbackForm = document.getElementById('feedback-form');
if (tabBtns.length && quoteForm && feedbackForm) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.tab === 'quote') {
        quoteForm.style.display = 'block';
        feedbackForm.style.display = 'none';
      } else {
        quoteForm.style.display = 'none';
        feedbackForm.style.display = 'block';
      }
    });
  });
}

// ===== Star rating picker (contact page only) =====
const ratingBtns = document.querySelectorAll('#rating-picker button');
if (ratingBtns.length) {
  ratingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ratingBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

// ===== Business contact placeholders =====
// Replace these three lines with real details before going live.
const BUSINESS_EMAIL = 'hello@cleanex.com';
const BUSINESS_PHONE_DISPLAY = '(555) 123-4567';      // shown to visitors
const BUSINESS_WHATSAPP = '15551234567';               // digits only: country code + number, no + or spaces

// Rewrites every tel:, mailto:, and wa.me link on the page from the constants above,
// so updating contact info only ever needs to happen in one place, across every page.
function applyBusinessContact() {
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.href = `tel:+${BUSINESS_WHATSAPP}`;
    if (a.textContent.includes('(555)')) a.textContent = a.textContent.replace('(555) 123-4567', BUSINESS_PHONE_DISPLAY);
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.href = `mailto:${BUSINESS_EMAIL}`;
  });
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    const url = new URL(a.href);
    url.pathname = `/${BUSINESS_WHATSAPP}`;
    a.href = url.toString();
  });
  document.querySelectorAll('.contact-methods .contact-method').forEach(el => {
    if (el.textContent.includes('Call:')) el.innerHTML = `<strong>Call:</strong> ${BUSINESS_PHONE_DISPLAY}`;
    if (el.textContent.includes('Email:')) el.innerHTML = `<strong>Email:</strong> ${BUSINESS_EMAIL}`;
  });
}
applyBusinessContact();

// ===== FAQ accordion (resources page only) =====
document.querySelectorAll('.faq-item .faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const icon = btn.querySelector('.faq-icon');
    const isOpen = item.classList.toggle('open');
    icon.textContent = isOpen ? '−' : '+';
  });
});

// ===== Footer year (every page) =====
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ===== Form submissions (contact page only) =====
function buildMailto(toEmail, subject, bodyLines) {
  const body = bodyLines.filter(Boolean).join('\n');
  return `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (quoteForm) {
  quoteForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }
    const name = document.getElementById('q-name').value.trim();
    const phone = document.getElementById('q-phone').value.trim();
    const email = document.getElementById('q-email').value.trim();
    const service = document.getElementById('q-service').value;
    const proptypeEl = document.getElementById('q-proptype');
    const bedroomsEl = document.getElementById('q-bedrooms');
    const proptype = proptypeEl ? proptypeEl.value : '';
    const bedrooms = bedroomsEl ? bedroomsEl.value : '';
    const date = document.getElementById('q-date').value;
    const notes = document.getElementById('q-notes').value.trim();
    const areaLabels = Array.from(document.querySelectorAll('#quote-form .form-grid input[type="checkbox"]:checked'))
      .map(cb => cb.closest('label').textContent.trim());

    const mailto = buildMailto(
      BUSINESS_EMAIL,
      `Quote Request — ${service}`,
      [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Service: ${service}`,
        proptype ? `Property type: ${proptype}` : null,
        bedrooms ? `Bedrooms: ${bedrooms}` : null,
        areaLabels.length ? `Areas to include: ${areaLabels.join(', ')}` : null,
        date ? `Preferred date: ${date}` : null,
        notes ? `Notes: ${notes}` : null
      ]
    );
    window.location.href = mailto;

    const successEl = document.getElementById('quote-success');
    if (successEl) successEl.classList.add('show');
    quoteForm.reset();
  });
}

if (feedbackForm) {
  feedbackForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }
    const name = document.getElementById('f-name').value.trim();
    const date = document.getElementById('f-date').value;
    const type = document.getElementById('f-type').value;
    const notes = document.getElementById('f-notes').value.trim();
    const rating = document.querySelector('#rating-picker button.selected');
    const ratingVal = rating ? rating.dataset.val : 'Not given';

    const mailto = buildMailto(
      BUSINESS_EMAIL,
      `${type} — Cleanex Feedback`,
      [
        `Name: ${name}`,
        date ? `Visit date: ${date}` : null,
        `Type: ${type}`,
        `Rating: ${ratingVal}/5`,
        `Details: ${notes}`
      ]
    );
    window.location.href = mailto;

    const successEl = document.getElementById('feedback-success');
    if (successEl) successEl.classList.add('show');
    feedbackForm.reset();
    ratingBtns.forEach(b => b.classList.remove('selected'));
  });
}

// ===== Testimonial carousel (reviews page only) =====
const testiQuote = document.getElementById('testiQuote');
const testiName = document.getElementById('testiName');
const prevTesti = document.getElementById('prevTesti');
const nextTesti = document.getElementById('nextTesti');
if (testiQuote && testiName && prevTesti && nextTesti) {
  const testimonials = [
    { quote: "Cleanex did an amazing job! My home has never been this clean. They are reliable, professional and very thorough.", name: "Maria R." },
    { quote: "Booked same-day before hosting family and the quote matched the final price exactly. Couldn't ask for more.", name: "David K." },
    { quote: "Office cleaning after hours has been consistent for six months straight, no complaints from the team.", name: "Sade N." }
  ];
  let testiIndex = 0;
  function renderTesti() {
    testiQuote.textContent = testimonials[testiIndex].quote;
    testiName.textContent = testimonials[testiIndex].name;
  }
  prevTesti.addEventListener('click', () => {
    testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
    renderTesti();
  });
  nextTesti.addEventListener('click', () => {
    testiIndex = (testiIndex + 1) % testimonials.length;
    renderTesti();
  });
}
