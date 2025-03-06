import {createContext} from 'react';

const I18nContext = createContext({i18n: {}, setI18n: ()=>{}});

export default I18nContext;
