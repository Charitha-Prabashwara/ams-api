const fs = require('fs');
const path = require('path');

class Strings {
  constructor() {
    if (Strings._instance) return Strings._instance;

    this.currentLang = 'en';
    this.fallback = 'en';
    this.strings = {};

    this.loadAllLanguages();

    Strings._instance = this;
  }

  loadAllLanguages() {
    const dir = path.join(process.cwd(), '/lang');

    if (!fs.existsSync(dir)) {
      console.error(`[Strings] Language directory not found: ${dir}`);
      return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const lang = file.replace('.json', '');
      const filePath = path.join(dir, file);

      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        this.strings[lang] = JSON.parse(raw);
        console.log(`[Strings] Loaded language: ${lang}`);
      } catch (err) {
        console.error(`[Strings] Failed loading ${file}:`, err);
      }
    }
  }

  setLanguage(lang) {
    if (this.strings[lang]) {
      this.currentLang = lang;
    } else {
      console.warn(
        `[Strings] Missing language '${lang}', using fallback '${this.fallback}'`,
      );
      this.currentLang = this.fallback;
    }
  }

  tDefault(key) {
    const langTable = this.strings[this.currentLang] || {};
    const fallbackTable = this.strings[this.fallback] || {};

    if (key in langTable) return langTable[key];
    if (key in fallbackTable) return fallbackTable[key];

    console.warn(`[Strings] Missing key '${key}' in '${this.currentLang}'`);
    return key;
  }

  t(key, language = null) {
    const langSelect = (language) => {
      if (!language) {
        return this.strings[this.currentLang];
      }
      return this.strings[language];
    };

    const langTable = langSelect(language) || {};
    const fallbackTable = this.strings[this.fallback] || {};

    if (key in langTable) return langTable[key];
    if (key in fallbackTable) return fallbackTable[key];

    console.warn(`[Strings] Missing key '${key}' in '${this.currentLang}'`);
    return key;
  }
}

module.exports = new Strings();
