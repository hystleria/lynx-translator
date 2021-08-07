module.exports = class Loader {
    constructor(translations) {
        this.translations = translations;

        this.langs = ['en-UK', 'fi-FI'];
        this.loaded = false;
    }

    /**
     * Loads translations
	 * @returns {*}
	 */
    load() {
        for (const lang of langs) {
            const translation = require(`../translations/${lang}.json`);
        
            this.translations.set(lang, translation);
        }
    }
};