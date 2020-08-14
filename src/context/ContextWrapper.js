import React, { useState } from 'react';
import { store } from './store';

const ViewerContext = React.createContext(null);

const ViewerProvider = (props) => {
    const [state, setState] = useState(store);
    return (
        <ViewerContext.Provider value={[state, setState]}>
            {props.children}
        </ViewerContext.Provider>
    );
};

export { ViewerContext, ViewerProvider };