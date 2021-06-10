import React, {
    useState,
    useEffect,
    useContext,
    createContext
} from 'react';

import Router from 'next/router';
import cookie from 'js-cookie';

import firebase from './firebase';
import { createUser } from './db';

const authContext = createContext();

export function AuthProvider({ children }) {
    const auth = userProviderAuth();
    return <authContext.Provider value={auth}>
        {children}
    </authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function userProviderAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleUser = async (rawUser) => {
        if (rawUser) {
            const user = await formatUser(rawUser);
            const { token, ...useWithoutToken } = user;

            createUser(user.uid, userWithoutToken);
            setUser(user);

            cookie.set('fast-feeback-auth', true, {
                expires: 1
            });

            setLoading(false);
            return user;
        } else {
            setUser(false);
            cookie.remove('fast-feedback-auth');

            setLoading(false);
            return false;
        }
    };

    const signinWithEmail = (email, password) => {
        setLoading(true);
        return firebase
            .auth()
            .signinWithEmailAndPassword(email, password)
            .then((response) => {
                handleUser(response.user);
                Router.push('/sites');
            });
    };







}