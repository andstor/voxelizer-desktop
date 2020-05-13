import React, {Component} from 'react';
import {connect} from "react-redux";
import {setLocale} from "./../../actions/locale";
import {addLocaleData, IntlProvider} from 'react-intl';
// Our translated strings
import localeLv from './../../translations/locales/lv';
import localeRu from './../../translations/locales/ru';
/* Import basic support for another locale if needed
 ('en' is included by default) */
import en from 'react-intl/locale-data/en';
import lv from 'react-intl/locale-data/lv';
import ru from 'react-intl/locale-data/ru';
/* react-intl imports */
addLocaleData([...en, ...lv, ...ru]);

let messages = {
  lv: localeLv,
  ru: localeRu
};

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
// const messagesold = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;


// Render our root component into the div with id "root"
// We select the messages to pass to IntlProvider based on the user's locale
class IntlWrapper extends Component {
  componentDidMount() {
    if (localStorage.getItem("language")) {
      this.props.setLocale(localStorage.getItem("language"));

    } else {
      this.props.setLocale(languageWithoutRegionCode);
      localStorage.setItem("language", languageWithoutRegionCode);
    }
  }

  render() {
    const {lang} = this.props;
    return (
      <IntlProvider locale={lang} messages={messages[lang]}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.locale.lang
  };
};

function mapDispatchToProps(dispatch) {
  return {
    setLocale: lang => dispatch(setLocale(lang))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntlWrapper);
