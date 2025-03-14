import {createContext} from 'react';

const TypographyContext = createContext({typography: false, setTypography: ()=>{}});

export default TypographyContext;