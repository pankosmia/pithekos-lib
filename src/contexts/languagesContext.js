import {createContext} from 'react';

const LanguagesContext = createContext({languages: false, setLanguages: ()=>{}});

export default LanguagesContext;