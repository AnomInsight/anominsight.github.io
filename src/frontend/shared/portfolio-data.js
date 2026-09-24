// Portfolio case-study data, split out of content.js so pages without a
// portfolio (e.g. versions/a/services.html) don't download it. UI strings for
// the portfolio section stay in content.js; only the data lives here.

// The three real case studies. Facts, metrics and repository links are taken
// verbatim from the baseline build - no claim here may be invented or inflated.
export const portfolioProjects = [
  {
    id: 'cnc-predictive-maintenance',
    kind: { en: 'Manufacturing', hu: 'Gyártás' },
    status: 'caseStudy',
    title: {
      en: 'Predictive maintenance for CNC operations',
      hu: 'Prediktív karbantartás CNC-üzemekhez',
    },
    description: {
      en: 'A machine learning model that watches CNC machine sensors and flags the ones likely to break down soon. In testing, it caught 96% of real failures before they happened.',
      hu: 'Gépi tanulási modell, amely a CNC-gépek szenzoradatait figyeli, és jelzi, mely gépeknél várható hamarosan meghibásodás. A tesztelés során a valós meghibásodások 96%-át még bekövetkezésük előtt felismerte.',
    },
    overview: {
      en: 'Unplanned breakdowns are costly on a 24/7 CNC production line, so this project builds an early-warning system for machine failure. It looks at real sensor readings, such as temperature, power draw, and torque, to flag machines likely to fail within the next day or two, before anything actually breaks. After comparing a few different approaches, I settled on a LightGBM model (a fast, tree-based machine learning method) tuned to catch as many real failures as possible: in testing it caught 96% of actual breakdowns, at the cost of roughly two false alarms for every real one it found. The idea isn\'t to replace maintenance engineers. It\'s to hand them a prioritized daily list so they can focus their attention where it matters, with the alert sensitivity adjustable to match how many false alarms the team can realistically handle.',
      hu: 'A váratlan leállások sokba kerülnek egy folyamatosan üzemelő CNC-gyártásban, ezért ez a projekt korai figyelmeztető rendszert épít a gépleállások előrejelzésére. A modell valós szenzoradatokat figyel, például hőmérsékletet, teljesítményfelvételt és nyomatékot, hogy jelezze, mely gépek állhatnak le a következő egy-két napban, még mielőtt bármi elromlana. Több módszer kipróbálása után egy LightGBM modell mellett döntöttem (ez egy gyors, fákra épülő gépi tanulási módszer), amelyet úgy hangoltam, hogy a lehető legtöbb valós meghibásodást elkapja: a tesztelés során az esetek 96%-ában időben jelzett, cserébe nagyjából két téves riasztás valódi meghibásodásonként. A cél nem az, hogy kiváltsa a karbantartó mérnököket, hanem hogy egy priorizált napi listát adjon a kezükbe, amelyre érdemes figyelniük. A riasztási küszöb pedig állítható, hogy illeszkedjen ahhoz, mennyi téves riasztást bír el a csapat.',
    },
    metrics: [
      {
        value: '96%',
        label: { en: 'of real failures caught in testing', hu: 'valós meghibásodás elkapva teszteléskor' },
      },
      {
        value: '~2:1',
        label: { en: 'false alarms per true catch', hu: 'téves riasztás valós találatonként' },
      },
      {
        value: 'LightGBM',
        label: { en: 'model selected after comparison', hu: 'modell összehasonlítás után kiválasztva' },
      },
    ],
    categories: ['predictiveMaintenance', 'anomalyDetection', 'decisionSupport'],
    // 02_Portfolio_Project is the ai4i2020 predictive-maintenance repo; 01 is the
    // MNIST one. The two were previously swapped here (and still are in the
    // untouched ORIGINAL reference copy).
    githubUrl: 'https://github.com/AnomInsight/02_Portfolio_Project',
  },
  {
    id: 'digit-classifier-mail-sorting',
    kind: { en: 'Logistics', hu: 'Logisztika' },
    status: 'caseStudy',
    title: {
      en: 'Handwritten digit classifier for mail sorting',
      hu: 'Kézzel írt számjegyek osztályozása levélválogatáshoz',
    },
    description: {
      en: 'Compared five different AI models for reading handwritten ZIP codes automatically. The best one, a neural network, got it right 99.27% of the time.',
      hu: 'Öt különböző MI-modellt hasonlítottam össze kézzel írt irányítószámok automatikus felismerésére. A legjobb, egy neurális háló, az esetek 99,27%-ában helyesen ismerte fel a számjegyeket.',
    },
    overview: {
      en: 'Sorting mail by handwritten ZIP code is slow and error-prone when done by hand at scale, so this project explores whether AI can take over that job reliably. Starting from a simple baseline and working up through logistic regression, random forests, and support vector machines, I landed on a convolutional neural network (a type of model built specifically for recognizing images), which correctly read digits 99.27% of the time. Beyond just accuracy, I checked which digits the model tends to confuse with each other, looked closely at its most confident mistakes, and tested how well it holds up against rotated, noisy, or poorly lit scans. The practical takeaway: send anything the model isn\'t confident about to a human for a second look, and keep monitoring its mistakes after it goes live.',
      hu: 'A kézzel írt irányítószámok kézi feldolgozása lassú és hibalehetőségekkel teli, ha nagy mennyiségű küldeményt kell feldolgozni. Ez a projekt azt vizsgálja, hogy egy MI megbízhatóan át tudja-e venni ezt a feladatot. Egy egyszerű alapmodellből kiindulva, logisztikus regresszión, random forest modellen és support vector machine (SVM) modelleken keresztül végül egy konvolúciós neurális hálónál kötöttem ki (ez egy kifejezetten képfelismerésre kitalált modelltípus), amely az esetek 99,27%-ában helyesen ismerte fel a számjegyeket. A pontosságon túl azt is megvizsgáltam, mely számjegyeket keveri össze a modell egymással, alaposan átnéztem azokat a hibás előrejelzéseket, amelyekben a modell a legbiztosabb volt, és teszteltem, hogyan teljesít elforgatott, zajos vagy rosszul megvilágított képeken. A gyakorlati tanulság: azokat az eseteket, amelyekben a modell bizonytalan, azt küldjük emberi ellenőrzésre, és élesben is érdemes folyamatosan figyelni a hibáit.',
    },
    metrics: [
      {
        value: '99.27%',
        label: { en: 'accuracy, best model (CNN)', hu: 'pontosság, legjobb modell (CNN)' },
      },
      {
        value: '5',
        label: { en: 'model families compared', hu: 'összehasonlított modellcsalád' },
      },
      {
        value: 'CNN',
        label: { en: 'architecture selected', hu: 'kiválasztott architektúra' },
      },
    ],
    categories: ['imageClassification', 'deepLearning', 'computerVision'],
    githubUrl: 'https://github.com/AnomInsight/01_Portfolio_Project',
  },
  {
    id: 'restaurant-ai-chatbot',
    kind: { en: 'Hospitality', hu: 'Vendéglátás' },
    status: 'caseStudy',
    title: {
      en: 'AI chatbot for restaurant ordering and support',
      hu: 'MI-chatbot éttermi rendeléshez és ügyfélszolgálathoz',
    },
    description: {
      en: 'An AI chat widget built for a demo pizzeria website that answers questions about the menu, hours, and orders. It is designed to stick to food that is actually on the menu.',
      hu: 'MI-alapú chatwidget egy demó pizzéria weboldalához, amely válaszol a menüvel, a nyitvatartással és a rendelésekkel kapcsolatos kérdésekre. Úgy készült, hogy csak a menüben ténylegesen szereplő ételekről beszéljen.',
    },
    overview: {
      en: 'Small businesses often lose customers simply because nobody\'s around to answer a quick question like "are you open right now?" or "what\'s your best-selling pizza?". This project shows how a lightweight AI chatbot can fill that gap. I built a demo pizzeria website with a chat widget powered by a fast large language model (via Groq), and kept it honest by only letting it talk about real menu items, prices, and hours pulled straight from the business\'s own data, which keeps it grounded and much less likely to make up a dish that doesn\'t exist. It remembers the conversation while you\'re chatting, keeps track of which items get ordered most, and includes basic safeguards like rate limiting and API key protection. The widget itself is just plain HTML, CSS, and JavaScript, so it can be dropped into almost any existing website.',
      hu: 'A kisvállalkozások gyakran veszítenek el ügyfeleket csak azért, mert senki sincs ott, hogy megválaszoljon egy egyszerű kérdést, mint például „nyitva vannak most?” vagy „melyik a legnépszerűbb pizzájuk?”. Ez a projekt azt mutatja be, hogyan tud egy könnyű MI-chatbot pótolni ezt a hiányt. Egy demó pizzéria weboldalt építettem egy chat widgettel, amely egy gyors nagy nyelvi modellre épül (Groq-on keresztül), és úgy állítottam be, hogy kizárólag a vállalkozás saját adataira, étlapjára, áraira és nyitvatartására támaszkodjon, ami sokkal kisebb eséllyel eredményez nem létező ételeket. A beszélgetés során figyelembe veszi a korábbi üzeneteket, nyomon követi, mely ételeket rendelik a leggyakrabban, és alapvető védelmi mechanizmusokat is alkalmaz, például a kérések számának korlátozását és az API-kulcs védelmét. Maga a widget egyszerű HTML, CSS és JavaScript, így szinte bármelyik meglévő weboldalba beilleszthető.',
    },
    metrics: [
      {
        value: 'Groq',
        label: { en: 'LLM provider behind the widget', hu: 'a widget mögötti LLM-szolgáltató' },
      },
      {
        value: 'Demo',
        label: { en: 'project, not a paying client', hu: 'projekt, nem fizető ügyfél' },
      },
      {
        value: 'HTML/CSS/JS',
        label: { en: 'drop-in, no framework needed', hu: 'beilleszthető, keretrendszer nélkül' },
      },
    ],
    categories: ['chatbot', 'llmIntegration', 'customerExperience'],
    githubUrl: 'https://github.com/AnomInsight/03_Portfolio_Project',
  },
];

export const portfolioCategoryLabels = {
  predictiveMaintenance: { en: 'Predictive maintenance', hu: 'Prediktív karbantartás' },
  anomalyDetection: { en: 'Anomaly detection', hu: 'Anomáliafelismerés' },
  decisionSupport: { en: 'Decision support', hu: 'Döntéstámogatás' },
  imageClassification: { en: 'Image classification', hu: 'Képosztályozás' },
  deepLearning: { en: 'Deep learning', hu: 'Mélytanulás' },
  computerVision: { en: 'Computer vision', hu: 'Számítógépes látás' },
  chatbot: { en: 'AI chatbot', hu: 'MI-chatbot' },
  llmIntegration: { en: 'LLM integration', hu: 'LLM-integráció' },
  customerExperience: { en: 'Customer experience', hu: 'Ügyfélélmény' },
};

export const portfolioStatusLabels = {
  live: { en: 'Live', hu: 'Aktív' },
  pilot: { en: 'Pilot', hu: 'Próbaüzem' },
  caseStudy: { en: 'Case study', hu: 'Esettanulmány' },
  prototype: { en: 'Prototype', hu: 'Prototípus' },
  workInProgress: { en: 'Work in progress', hu: 'Fejlesztés alatt' },
  ongoing: { en: 'Ongoing', hu: 'Folyamatban' },
  planned: { en: 'Planned', hu: 'Tervezett' },
  testing: { en: 'Testing', hu: 'Tesztelés alatt' },
};

export const getLabel = (dict, id, lang) => {
  const entry = dict[id];
  if (!entry) {
    return id;
  }
  return entry[lang] || entry.en;
};
