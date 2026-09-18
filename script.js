document.addEventListener('DOMContentLoaded', () => {
	const navigationEntry = performance.getEntriesByType('navigation')[0];
	const isReload = navigationEntry ? navigationEntry.type === 'reload' : false;

	if ('scrollRestoration' in window.history) {
		window.history.scrollRestoration = 'manual';
	}
	if (isReload) {
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	}

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
			'status.text': 'Actively in development.',
			'footer.copy': '© <span id="year"></span> AnomInsight. All rights reserved.',
			pageTitle: 'AnomInsight | Coming Soon',
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
			'status.text': 'Aktívan fejlesztés alatt.',
			'footer.copy': '© <span id="year"></span> AnomInsight. Minden jog fenntartva.',
			pageTitle: 'AnomInsight | Hamarosan',
		},
	};

	const LANG_STORAGE_KEY = 'anominsight:lang';

	// Returns a stored choice first, then a browser-language guess, so a
	// Hungarian visitor doesn't land on English by default every single time.
	const getPreferredLang = () => {
		try {
			const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
			if (stored === 'en' || stored === 'hu') {
				return stored;
			}
		} catch {
			// Storage blocked (private mode, disabled site data) - fall through.
		}

		const browserLangs = navigator.languages || [navigator.language];
		return browserLangs.some((lang) => lang.toLowerCase().startsWith('hu')) ? 'hu' : 'en';
	};

	const storeLangPreference = (lang) => {
		try {
			window.localStorage.setItem(LANG_STORAGE_KEY, lang);
		} catch {
			// Storage blocked - the choice just won't survive a reload this time.
		}
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

	let currentLang = getPreferredLang();

	const langToggle = document.querySelector('.lang-toggle');
	if (langToggle) {
		langToggle.addEventListener('click', () => {
			currentLang = currentLang === 'en' ? 'hu' : 'en';
			storeLangPreference(currentLang);
			applyTranslations(currentLang);
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
