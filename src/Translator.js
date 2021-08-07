const { Logger } = require('lynx-logger');
const { join } = require('path');
const { readdirSync } = require('fs');

module.exports = class Translator {
    constructor(locales, path, options) {
        this.locales = locales; // Empty locale collection
        this.path = path; // Location of the locale files
        this.options = options || {
            defaultLocale: 'en-UK', // Default locale to use if server has not configured it
            fallbackLocale: 'en-UK', // Fallback to this locale if key does not exist in the default or specified locale
            logging: true // Whether logging should be enabled or disabled
        };
        this.logger = new Logger('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Loads locales
	 * @returns {*}
	 */
    load() {
        // Get the locales
        const directory = join(this.path);
        const locales = readdirSync(directory);
        
        if (!locales.length) {
            this.logger.error('There are no locales', { prefix: 'Translator' });
            process.exit(1);
        }
        
        // Load the locales
        for (let i = 0; i < locales.length; i++) {
            const lang = require(`../locales/${locales[i]}`);

            this.locales.set(lang.meta.code, lang);

            if (this.options.logging) this.logger.info(`Locale ${lang.meta.code} has been loaded`, { prefix: 'Translator' });
        }
    }

    translate(key = null, options = {}) {
        if (this.locales.size < 1) {
            this.logger.error('There are no locales', { prefix: 'Translator' });
            process.exit(1);
        }

        // Use default locale if a locale is not specified
        let locale;
        if (options.locale && options.locale != null) locale = this.locales.get(options.locale);
        else locale = this.locales.get(this.options.defaultLocale);

        let translation;
        if (this.locales.get(locale.meta.code)[key]) translation = this.locales.get(locale.meta.code)[key]; // Gets the translation
        else translation = this.locales.get(this.options.fallbackLocale)[key] // Fallbacks to fallback locale if the key does not exist in the locale defined above

        if (!translation) {
            this.logger.error(`Key '${key}' does not exist in '${locale.meta.code}', unable to fallback`, { prefix: 'Translator' });
            process.exit(1);
        }

        // Replace any variables with their value
        if (options.variables && options.variables.length) {
            for (const variable of options.variables) {
                translation = translation.replace(new RegExp(`%${variable.key}%`, 'g'), variable.value);
            }
        }

        return translation;
    }
};
