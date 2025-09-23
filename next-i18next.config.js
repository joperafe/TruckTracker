import path from 'path';

const i18nConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
  },
  localePath: path.resolve('./public/locales'),
};

export default i18nConfig;