import React , {createContext, useState} from 'react';

/*
    - Context pour gerer l'état du loader
*/

export const ContextChargement = createContext();

const ContextChargementProvider = (props) => {
    const [chargement, setChargement] = useState(true)
    const [role, setRole] = useState('');

    const stopChargement = () => {
        setChargement(false);
    }

    const startChargement = () => {
        setChargement(true);
    }
    
    return (
        <ContextChargement.Provider value={{chargement, stopChargement, startChargement, role, setRole }}>
            {props.children}
        </ContextChargement.Provider>
    )
}

export default ContextChargementProvider;