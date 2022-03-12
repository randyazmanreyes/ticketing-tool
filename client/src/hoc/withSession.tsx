import React, { ComponentType, createContext, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import LoginBody from '../../../common/login-body';
import LoginError from '../../../common/login-error';
import LoginResponse from '../../../common/login-response';
import useLocalStorage from '../hooks/useLocalStorage';

interface Session {
    user?: string;
}

interface Props {
    children: React.ReactNode;
}

export interface WithSessionProps {
    session: Session;
    isLoggingIn: boolean;
    loginError?: LoginError;
    login(email: string, password: string): Promise<void>;
}

const SessionContext = createContext<WithSessionProps | null>(null);

export const SessionProvider = ({ children }: Props): JSX.Element => {
    const [user, setUser] = useLocalStorage('user');
    const [session, setSession] = useState<Session>({ user });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<LoginError>();

    const login = async (email: string, password: string) => {
        try {
            setIsLoggingIn(true);
            setLoginError(undefined);

            const { data } = await axios.post<
                LoginResponse,
                AxiosResponse<LoginResponse, LoginBody>,
                LoginBody
            >('/login', {
                email,
                password,
            });

            setSession({ user: data.email });
            setUser(data.email);
        } catch (error: any) {
            setIsLoggingIn(false);

            if (
                error.response &&
                error.response.status &&
                error.response.data &&
                error.response.data.message
            ) {
                setLoginError({
                    code: error.response.status,
                    message: error.response.data.message,
                });
            }
        }
    };

    return (
        <SessionContext.Provider
            value={{ session, isLoggingIn, loginError, login }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export default function withSession<
    P extends WithSessionProps = WithSessionProps
>(WrappedComponent: ComponentType<P>) {
    const ComponentWithSession = (props: Omit<P, keyof WithSessionProps>) => {
        return (
            <SessionContext.Consumer>
                {(context) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <WrappedComponent {...props} {...(context as P)} />
                )}
            </SessionContext.Consumer>
        );
    };

    return ComponentWithSession;
}
