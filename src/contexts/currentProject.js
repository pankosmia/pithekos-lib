import {createContext} from 'react';

const CurrentProjectContext = createContext({currentProject: null, setCurrentProject: () => {}});

export default CurrentProjectContext;