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

// ===== Quote / Feedback form references =====
const tabBtns = document.querySelectorAll('.tab-btn');
const quoteForm = document.getElementById('quote-form');
const feedbackForm = document.getElementById('feedback-form');

// ===== Quote / Feedback tab switch =====
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
const BUSINESS_PHONE_DISPLAY = '(+44) 07459-523113';      // shown to visitors
const BUSINESS_WHATSAPP = '4407459523113';               // digits only: country code + number, no + or spaces

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

// ===== Form submissions =====

// Replace this with your actual email form endpoint
const FORM_ENDPOINT = 'https://formspree.io/f/mjykazpe';


// ================================
// QUOTE FORM
// ================================
if (quoteForm) {

  quoteForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const submitButton =
      quoteForm.querySelector('button[type="submit"]');

    const successEl =
      document.getElementById('quote-success');


    const name =
      document.getElementById('q-name').value.trim();

    const phone =
      document.getElementById('q-phone').value.trim();

    const email =
      document.getElementById('q-email').value.trim();

    const service =
      document.getElementById('q-service').value;

    const propertyType =
      document.getElementById('q-proptype').value;

    const bedrooms =
      document.getElementById('q-bedrooms').value;

    const preferredDate =
      document.getElementById('q-date').value;

    const notes =
      document.getElementById('q-notes').value.trim();


    const areas = Array.from(
      quoteForm.querySelectorAll(
        'input[type="checkbox"]:checked'
      )
    ).map(checkbox =>
      checkbox.closest('label').textContent.trim()
    );


    const data = {

      type: 'quote',

      name: name,

      phone: phone,

      email: email,

      service: service,

      propertyType: propertyType,

      bedrooms: bedrooms,

      preferredDate: preferredDate,

      areas: areas.join(', '),

      notes: notes

    };


    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';


    try {

      const response = await fetch(
        FORM_ENDPOINT,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },

          body: JSON.stringify(data)
        }
      );


      if (!response.ok) {
        throw new Error('Submission failed');
      }


      if (successEl) {
        successEl.classList.add('show');
      }


      quoteForm.reset();


      setTimeout(() => {

        if (successEl) {
          successEl.classList.remove('show');
        }

      }, 6000);


    } catch (error) {

      console.error(
        'Quote submission error:',
        error
      );

      alert(
        'We could not submit your quote request. Please try again.'
      );


    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        'Request Quote';

    }

  });

}


// ================================
// FEEDBACK FORM
// ================================
if (feedbackForm) {

  feedbackForm.addEventListener('submit', async (e) => {

    e.preventDefault();


    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }


    const submitButton =
      feedbackForm.querySelector('button[type="submit"]');

    const successEl =
      document.getElementById('feedback-success');


    const name =
      document.getElementById('f-name').value.trim();

    const visitDate =
      document.getElementById('f-date').value;

    const feedbackType =
      document.getElementById('f-type').value;

    const notes =
      document.getElementById('f-notes').value.trim();


    const selectedRating =
      document.querySelector(
        '#rating-picker button.selected'
      );


    const rating =
      selectedRating
        ? selectedRating.dataset.val
        : 'Not given';


    const data = {

      type: 'feedback',

      name: name,

      visitDate: visitDate,

      rating: rating,

      feedbackType: feedbackType,

      notes: notes

    };


    submitButton.disabled = true;

    submitButton.textContent = 'Sending...';


    try {

      const response = await fetch(
        FORM_ENDPOINT,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },

          body: JSON.stringify(data)
        }
      );


      if (!response.ok) {
        throw new Error('Submission failed');
      }


      if (successEl) {
        successEl.classList.add('show');
      }


      feedbackForm.reset();


      ratingBtns.forEach(btn => {
        btn.classList.remove('selected');
      });


      setTimeout(() => {

        if (successEl) {
          successEl.classList.remove('show');
        }

      }, 6000);


    } catch (error) {

      console.error(
        'Feedback submission error:',
        error
      );

      alert(
        'We could not submit your feedback. Please try again.'
      );


    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        'Send Feedback';

    }

  });

}

// ===== Testimonial carousel (reviews page only) =====
const testiQuote = document.getElementById('testiQuote');
const testiName = document.getElementById('testiName');
const prevTesti = document.getElementById('prevTesti');
const nextTesti = document.getElementById('nextTesti');
if (testiQuote && testiName && prevTesti && nextTesti) {
  const testimonials = [
    { quote: "Chiny&CMK did an amazing job! My home has never been this clean. They are reliable, professional and very thorough.", name: "Maria R." },
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
