// Formspree submission shared by the alternative design directions. Posts via
// fetch so the visitor never leaves the page, and reports status inline in the
// language currently selected.

export function initContactForm(form, { t, statusEl }) {
  if (!form || !statusEl) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    statusEl.textContent = t('contact.formSending');
    statusEl.dataset.state = 'pending';
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        statusEl.textContent = t('contact.formSuccess');
        statusEl.dataset.state = 'success';
        form.reset();
      } else {
        statusEl.textContent = t('contact.formError');
        statusEl.dataset.state = 'error';
      }
    } catch {
      statusEl.textContent = t('contact.formError');
      statusEl.dataset.state = 'error';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
