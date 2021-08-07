const { readdirSync } = require('fs');

module.exports = class Loader {
    constructor(translations) {
        this.translations = translations;
        this.loaded = false;
    }

    /**
     * Loads all translations
	 * @returns {*}
	 */
    loadAll() {
        const translations = readdirSync('./translations');
        translations.filter((t) => t.split('.').pop() == 'json').forEach((file) => {
            this.load(file.split('.')[0]);
            this.loaded = true;
        });
    }

    /**
     * Loads a translation
     * @param {String} lang Language code
	 * @returns {*}
	 */
    load(lang) {
        const translation = require(`../translations/${lang}.json`);
        
        this.translations.set(lang, translation);
    }
};