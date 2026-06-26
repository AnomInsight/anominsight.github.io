document.addEventListener('DOMContentLoaded', () => {
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = String(new Date().getFullYear());
	}

	const translations = {
		en: {
			'lang.toggle': 'EN',
			'hero.pill': 'New platform in progress',
			'hero.title': 'I am building something powerful for your data.',
			'hero.lead':
				'AnomInsight will be available soon with practical AI analytics, anomaly detection, and clear dashboards for faster decisions.',
			'hero.contactEmail': 'Contact me via email',
			'meta.statusLabel': 'Current status',
			'meta.statusValue': 'Coming Soon',
			'meta.targetLanguagesLabel': 'Target languages',
			'meta.targetLanguagesValue': 'English, Hungarian',
			'meta.emailLabel': 'Email',
			'footer.copy': '© <span id="year"></span> AnomInsight. All rights reserved.',
			pageTitle: 'AnomInsight | Coming Soon',
			statuses: [
				'Preparing launch experience...',
				'Finalizing features and UI polish...',
				'Opening early access requests soon...',
			],
		},
		hu: {
			'lang.toggle': 'HU',
			'hero.pill': 'Az új platform fejlesztés alatt',
			'hero.title': 'Egy rendkívül hatékony adatelemző platformot építek.',
			'hero.lead':
				'Az AnomInsight hamarosan elérhető lesz gyakorlati AI-elemzéssel, anomália-felismeréssel és átlátható dashboardokkal a gyorsabb döntésekhez.',
			'hero.contactEmail': 'Írj e-mailt',
			'meta.statusLabel': 'Jelenlegi állapot',
			'meta.statusValue': 'Hamarosan',
			'meta.targetLanguagesLabel': 'Célzott nyelvek',
			'meta.targetLanguagesValue': 'Magyar, angol',
			'meta.emailLabel': 'E-mail',
			'footer.copy': '© <span id="year"></span> AnomInsight. Minden jog fenntartva.',
			pageTitle: 'AnomInsight | Hamarosan',
			statuses: ['Indulási élmény előkészítése...'],
		},
	};

	const applyTranslations = (lang) => {
		document.documentElement.lang = lang;
		document.title = translations[lang].pageTitle;

		document.querySelectorAll('[data-i18n]').forEach((el) => {
			const key = el.getAttribute('data-i18n');
			if (key && translations[lang][key]) {
				el.textContent = translations[lang][key];
			}
		});

		document.querySelectorAll('[data-i18n-html]').forEach((el) => {
			const key = el.getAttribute('data-i18n-html');
			if (key && translations[lang][key]) {
				el.innerHTML = translations[lang][key];
			}
		});

		const activeYearEl = document.getElementById('year');
		if (activeYearEl) {
			activeYearEl.textContent = String(new Date().getFullYear());
		}
	};

	const statusEl = document.getElementById('statusText');
	let currentLang = 'en';
	let statusIndex = 0;

	if (statusEl) {
		statusEl.textContent = translations[currentLang].statuses[statusIndex];
		setInterval(() => {
			statusIndex = (statusIndex + 1) % translations[currentLang].statuses.length;
			statusEl.textContent = translations[currentLang].statuses[statusIndex];
		}, 2800);
	}

	const langToggle = document.querySelector('.lang-toggle');
	if (langToggle) {
		langToggle.addEventListener('click', () => {
			currentLang = currentLang === 'en' ? 'hu' : 'en';
			statusIndex = 0;
			applyTranslations(currentLang);
			if (statusEl) {
				statusEl.textContent = translations[currentLang].statuses[statusIndex];
			}
		});
	}

	applyTranslations(currentLang);

	const revealItems = document.querySelectorAll('.reveal');
	revealItems.forEach((item, index) => {
		setTimeout(() => {
			item.classList.add('in');
		}, 120 + index * 180);
	});
});
