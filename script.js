document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const year = document.getElementById('year');

  const updateYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  updateYear();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (form && formNote) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      formNote.textContent = currentLang === 'en'
        ? 'Thanks! Your message has been prepared and is ready to send.'
        : 'Köszönöm! Az üzeneted elkészült és készen áll a küldésre.';
      form.reset();
    });
  }

  const translations = {
    en: {
      'nav.services': 'Services',
      'nav.projects': 'Projects',
      'nav.plans': 'Plans',
      'nav.contact': 'Contact',
      'langToggle': 'EN',
      'hero.eyebrow': 'Data Science • ML/AI • Analytics',
      'hero.heading': 'Turning complex data into clear insight, smarter decisions, and measurable impact.',
      'hero.copy': 'I build data-driven solutions for anomaly detection, predictive modeling, business intelligence, and AI-powered analysis that help teams act faster and with confidence.',
      'hero.ctaPrimary': 'Let’s work together',
      'hero.ctaSecondary': 'Explore my projects',
      'hero.highlight1': 'Anomaly detection',
      'hero.highlight2': 'ML/AI projects',
      'hero.highlight3': 'Data audits & insights',
      'hero.highlight4': 'Basic web development',
      'panel.label': 'Core strengths',
      'panel.score': 'AI',
      'panel.text': 'From data preparation and exploration to modeling, validation, and actionable reporting.',
      'services.eyebrow': 'Services',
      'services.heading': 'Data science and AI solutions tailored to real business needs.',
      'services.card1.title': 'Anomaly Detection',
      'services.card1.text': 'Detect unusual patterns, outliers, and abnormal behavior in systems, data streams, or operations.',
      'services.card2.title': 'ML/AI Projects',
      'services.card2.text': 'Build predictive models, intelligent automation, and AI-driven workflows for practical outcomes.',
      'services.card3.title': 'Web Development',
      'services.card3.text': 'Create basic, responsive websites and web pages to showcase your brand or support data-driven products.',
      'services.card4.title': 'Data Audit & Potential Analysis',
      'services.card4.text': 'Assess data quality, uncover hidden opportunities, and identify growth or risk patterns.',
      'projects.eyebrow': 'Portfolio',
      'projects.heading': 'Selected work in analytics, forecasting, and intelligent systems.',
      'projects.card1.title': 'Anomaly Detection System',
      'projects.card1.text': 'Developed models to identify unusual behavior and highlight important deviations in complex datasets.',
      'projects.card1.tag': 'ML • Detection • Monitoring',
      'projects.card2.title': 'Data Analysis Pipeline',
      'projects.card2.text': 'Built end-to-end analysis workflows for cleaning, transforming, and extracting insights from raw data.',
      'projects.card2.tag': 'Data Science • BI • Reporting',
      'projects.card3.title': 'Opportunity & Risk Analysis',
      'projects.card3.text': 'Delivered structured analysis to uncover potential growth paths, hidden risks, and data-backed recommendations.',
      'projects.card3.tag': 'Audit • Strategy • Insight',
      'plans.eyebrow': 'Plans',
      'plans.heading': 'Flexible engagement options for analytics, automation, and AI-driven growth.',
      'plans.card1.title': 'Discovery',
      'plans.card1.item1': 'Data review and problem framing',
      'plans.card1.item2': 'Initial analysis recommendations',
      'plans.card1.item3': 'Roadmap for next steps',
      'plans.card2.title': 'Delivery',
      'plans.card2.item1': 'ML/AI solution development',
      'plans.card2.item2': 'Data audit and insight reporting',
      'plans.card2.item3': 'Implementation support',
      'plans.card3.title': 'Advanced',
      'plans.card3.item1': 'Custom analytics systems',
      'plans.card3.item2': 'Model monitoring and refinement',
      'plans.card3.item3': 'Strategic opportunity analysis',
      'plans.priceNote': '*Prices converted using 310 HUF/USD.',
      'contact.eyebrow': 'Contact',
      'contact.heading': 'Let’s turn your data into a real advantage.',
      'contact.copy': 'I’m available for data science consulting, anomaly detection projects, ML/AI development, data audits, and business opportunity analysis. Send a message and I’ll get back to you soon.',
      'contact.email': 'Email: hello@anominsight.dev',
      'contact.location': 'Location: Remote / Worldwide',
      'contact.form.name': 'Name',
      'contact.form.email': 'Email',
      'contact.form.details': 'Project details',
      'contact.form.placeholderName': 'Your name',
      'contact.form.placeholderEmail': 'you@example.com',
      'contact.form.placeholderDetails': 'Tell me about your idea, goals, and timeline.',
      'contact.form.submit': 'Send Message',
      'contact.form.note': 'Thanks! Your message is ready to send.',
      'footer.text': '© <span id="year"></span> AnomInsight. Built for modern brands.',
    },
    hu: {
      'nav.services': 'Szolgáltatások',
      'nav.projects': 'Projektek',
      'nav.plans': 'Tervek',
      'nav.contact': 'Kapcsolat',
      'langToggle': 'HU',
      'hero.eyebrow': 'Adattudomány • ML/AI • Elemzés',
      'hero.heading': 'A komplex adatokat világos betekintéssé, okosabb döntésekké és mérhető hatássá alakítom.',
      'hero.copy': 'Adatvezérelt megoldásokat készítek anomáliafelismeréshez, prediktív modellezéshez, üzleti intelligenciához és AI-alapú elemzéshez, hogy a csapatok gyorsabban és magabiztosabban léphessenek.',
      'hero.ctaPrimary': 'Dolgozzunk együtt',
      'hero.ctaSecondary': 'Nézd meg a projektjeimet',
      'hero.highlight1': 'Anomáliafelismerés',
      'hero.highlight2': 'ML/AI projektek',
      'hero.highlight3': 'Adatellenőrzés és betekintés',
      'hero.highlight4': 'Alap webfejlesztés',
      'panel.label': 'Fő erősségek',
      'panel.score': 'AI',
      'panel.text': 'Az adatelőkészítéstől és feltárástól a modellezésen, validáción és működő jelentéskészítésen át.',
      'services.eyebrow': 'Szolgáltatások',
      'services.heading': 'Adattudományi és AI megoldások valódi üzleti igényekre szabva.',
      'services.card1.title': 'Anomáliafelismerés',
      'services.card1.text': 'Szokatlan mintázatok, kiugró értékek és rendellenes viselkedés észlelése rendszerekben, adatfolyamokban vagy műveletekben.',
      'services.card2.title': 'ML/AI projektek',
      'services.card2.text': 'Prediktív modelleket, intelligens automatizálást és AI-alapú munkafolyamatokat építek gyakorlati eredményekhez.',
      'services.card3.title': 'Webfejlesztés',
      'services.card3.text': 'Alap, reszponzív weboldalakat és weblapokat készítek a márkád bemutatásához vagy adatvezérelt termékek támogatásához.',
      'services.card4.title': 'Adatellenőrzés és potenciál elemzés',
      'services.card4.text': 'Adatminőséget értékelek, rejtett lehetőségeket tár fel és növekedési vagy kockázati mintázatokat azonosítok.',
      'projects.eyebrow': 'Portfólió',
      'projects.heading': 'Kiválasztott munkák elemzés, előrejelzés és intelligens rendszerek terén.',
      'projects.card1.title': 'Anomáliafelismerő rendszer',
      'projects.card1.text': 'Olyan modelleket fejlesztettem, amelyek felismerik a szokatlan viselkedést és kiemelik a fontos eltéréseket összetett adatkészletekben.',
      'projects.card1.tag': 'ML • Felismerés • Megfigyelés',
      'projects.card2.title': 'Adatfeldolgozó csővezeték',
      'projects.card2.text': 'Teljes körű elemzési munkafolyamatokat építettem a tisztításhoz, transzformáláshoz és az alapadatokból történő betekintések kinyeréséhez.',
      'projects.card2.tag': 'Adattudomány • BI • Jelentés',
      'projects.card3.title': 'Lehetőség- és kockázatelemzés',
      'projects.card3.text': 'Strukturált elemzést készítettem a lehetséges növekedési utak, rejtett kockázatok és adatvezérelt ajánlások feltárásához.',
      'projects.card3.tag': 'Ellenőrzés • Stratégia • Betekintés',
      'plans.eyebrow': 'Tervek',
      'plans.heading': 'Rugalmas együttműködési lehetőségek elemzéshez, automatizáláshoz és AI-alapú növekedéshez.',
      'plans.card1.title': 'Felfedezés',
      'plans.card1.item1': 'Adatáttekintés és problémakeretezés',
      'plans.card1.item2': 'Kezdeti elemzési javaslatok',
      'plans.card1.item3': 'Következő lépések ütemterve',
      'plans.card2.title': 'Megvalósítás',
      'plans.card2.item1': 'ML/AI megoldásfejlesztés',
      'plans.card2.item2': 'Adatellenőrzés és betekintési jelentés',
      'plans.card2.item3': 'Megvalósítási támogatás',
      'plans.card3.title': 'Haladó',
      'plans.card3.item1': 'Egyedi elemzési rendszerek',
      'plans.card3.item2': 'Modellfigyelés és finomhangolás',
      'plans.card3.item3': 'Stratégiai lehetőség-elemzés',
      'plans.priceNote': '*Az árfolyam átváltásához 310 HUF/USD értéket használtunk.',
      'contact.eyebrow': 'Kapcsolat',
      'contact.heading': 'Tegyük adataidat valódi előnnyé.',
      'contact.copy': 'Elérhető vagyok adattudományi tanácsadásra, anomáliafelismerési projektekre, ML/AI fejlesztésre, adatelemzésre és üzleti lehetőség feltárására. Küldj üzenetet, és hamarosan válaszolok.',
      'contact.email': 'Email: hello@anominsight.dev',
      'contact.location': 'Helyszín: Távoli / Világszerte',
      'contact.form.name': 'Név',
      'contact.form.email': 'Email',
      'contact.form.details': 'Projekt részletei',
      'contact.form.placeholderName': 'A neved',
      'contact.form.placeholderEmail': 'te@example.com',
      'contact.form.placeholderDetails': 'Mesélj az ötletedről, céljaidról és idővonaladról.',
      'contact.form.submit': 'Üzenet küldése',
      'contact.form.note': 'Köszönöm! Az üzeneted elkészült és készen áll a küldésre.',
      'footer.text': '© <span id="year"></span> AnomInsight. Modern márkák számára készült.',
    },
  };

  const langToggle = document.querySelector('.lang-toggle');
  const translatePage = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    document.querySelectorAll('.price[data-price-usd]').forEach((el) => {
      const usd = Number(el.getAttribute('data-price-usd'));
      if (!Number.isNaN(usd)) {
        if (lang === 'hu') {
          const huf = Math.round(usd * 310);
          el.textContent = `${huf.toLocaleString('hu-HU')} Ft*`;
        } else {
          el.textContent = `$${usd.toLocaleString('en-US')}`;
        }
      }
    });
    updateYear();
  };

  let currentLang = 'en';
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hu' : 'en';
      translatePage(currentLang);
    });
  }

  translatePage(currentLang);
});
