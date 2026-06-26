document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (form && formNote) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      formNote.textContent = 'Thanks! Your message has been prepared and is ready to send.';
      form.reset();
    });
  }
});
