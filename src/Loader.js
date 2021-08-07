module.exports = class Loader {
    constructor(translations) {
        this.translations = translations;

        this.langs = ['en-UK', 'fi-FI', 'sv-SE'];
        this.loaded = false;
    }

    /**
     * Loads translations
	 * @returns {*}
	 */
    load() {
        for (const lang of this.langs) {
            const translation = require(`../translations/${lang}.json`);
            this.translations.set(lang, translation);
        }
	
	if (this.translations.length == langs.length) this.loaded = true;
    }
};
