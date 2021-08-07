module.exports = class Translator {
    constructor(translations, defaultLang, fallbackLang) {
        this.translations = translations
        this.defaultLang = defaultLang;
        this.fallbackLang = fallbackLang;
    }

    translate(key, options) {
        if (this.translations.size < 1) throw new Error('There are no translation files');

        if (!options) options = {};

        let language;
        let string;

        if (!options.language || options.language == null) language = this.defaultLang;

        string = this.translations.get(language)[key];

        if (!string) string = this.translations.get(this.fallbackLang)[key];

        if (options.variables && options.variables.length) {
            for (const variable of options.variables) {
                string = string.replace(new RegExp(`%${variable.key}%`, 'g'), variable.value);
            }
        }

        return string;
    }
};