import {createContext} from 'react';

const TypographyContext = createContext({systemTypography: false, setSystemTypography: ()=>{}});

export default TypographyContext;