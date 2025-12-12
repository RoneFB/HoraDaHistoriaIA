import { createI18n } from 'vue-i18n';
import pt from './pt.json';
import en from './en.json';

const i18n = createI18n({
    legacy: false, // Composition API
    locale: 'pt-BR', // Default locale
    fallbackLocale: 'en',
    messages: {
        'pt-BR': pt,
        en
    }
});

export default i18n;
