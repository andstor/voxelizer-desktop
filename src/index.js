import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { IntlProvider } from "react-intl";
import './index.css';
import root from './screens/root';
import translations from './translations/locales';
const { api } = window;

(async () => {
	let locale = await api.invoke('APP_GET_LOCALE');
	const messages = translations[locale];
	ReactDOM.render(
			<IntlProvider locale={locale} messages={messages}>
				<HashRouter>
					<Route component={root} />
				</HashRouter >
			</IntlProvider>,
		document.getElementById('root')
	);
})();
