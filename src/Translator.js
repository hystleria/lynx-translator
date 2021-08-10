const { Logger } = require('lynx-logger');
const { join } = require('path');
const { readdirSync } = require('fs');

module.exports = class Translator {
    constructor(locales, options) {
        this.locales = locales; // Empty locale collection
        this.options = options || {
            defaultLocale: 'en-GB', // Default locale to use if server has not configured it
            fallbackLocale: 'en-GB', // Fallback to this locale if key does not exist in the default or specified locale
        };
        this.logger = new Logger('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Registers locales
	 * @returns {*}
	 */
    register() {
        this.logger.debug('Registering locales', { prefix: 'Translator' });
        
        const directory = join(__dirname.substring(0, __dirname.length - 3), 'locales');
        const locales = readdirSync(directory);
        
        if (!locales.length) {
            this.logger.error('There are no locales', { prefix: 'Translator' });
            process.exit(1);
        }

        for (let i = 0; i < locales.length; i++) {
            if (locales[i] == 'template.json') return;
            const locale = require(`../locales/${locales[i]}`);
            
            // Cache locale
            this.locales.set(locale.meta.iso, locale);
        }

        return this.locales;
    }

    /**
     * Translates a string
	 * @returns {String}
	 */
    translate(key = null, options = {}) {
        if (this.locales.size < 1) {
            this.logger.error('There are no locales', { prefix: 'Translator' });
            process.exit(1);
        }

        if (!this.locales.has(this.options.defaultLocale)) {
            this.logger.error('The specified default locale does not exist', { prefix: 'Translator' });
            process.exit(1);
        }

        if (!this.locales.has(this.options.fallbackLocale)) {
            this.logger.error('The specified fallback locale does not exist', { prefix: 'Translator' });
            process.exit(1);
        }

        // Use default locale if a locale is not specified
        let locale;
        if (options.locale && options.locale != null) locale = this.locales.get(options.locale);
        else locale = this.locales.get(this.options.defaultLocale);

        let translation;
        if (this.locales.get(locale.meta.iso)[key]) translation = this.locales.get(locale.meta.iso)[key]; // Gets the translation
        else translation = this.locales.get(this.options.fallbackLocale)[key] // Fallbacks to fallback locale if the key does not exist in the locale defined above

        if (!translation) {
            this.logger.error(`Key '${key}' does not exist in '${locale.meta.iso}', unable to fallback`, { prefix: 'Translator' });
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
