// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
	messagesDirectory: 'src/translations/messages/',
	translationsDirectory: 'src/translations/locales/',
	languages: ['en', 'nb'] // any language you need
});
