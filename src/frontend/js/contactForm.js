// Submits the "Get in touch" form to Formspree via fetch so the page never
// navigates away, and shows an inline status message in the current language.

import { translations } from './i18n.js';

export function initContactForm(getLang) {
  const form = document.getElementById('contactForm');
  if (!form) {
    return;
  }

  const status = document.getElementById('contactFormStatus');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const t = translations[getLang()] || translations.en;

    status.textContent = t['contact.formSending'];
    status.className = 'form-status form-status-pending';
    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = t['contact.formSuccess'];
        status.className = 'form-status form-status-success';
        form.reset();
      } else {
        status.textContent = t['contact.formError'];
        status.className = 'form-status form-status-error';
      }
    } catch (error) {
      status.textContent = t['contact.formError'];
      status.className = 'form-status form-status-error';
    } finally {
      submitButton.disabled = false;
    }
  });
}
