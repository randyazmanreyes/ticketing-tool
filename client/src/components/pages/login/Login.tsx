import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../common/Card';
import withSession, { WithSessionProps } from '../../../hoc/withSession';

const Login = ({
    session,
    isLoggingIn,
    loginError,
    login,
}: WithSessionProps): JSX.Element => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await login(email, password);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const getSubmitButtonLabel = () => {
        let label = 'LOG IN';

        if (isLoggingIn) {
            label = 'LOGGING IN...';
        }

        if (session.user) {
            label = 'LOG IN SUCCESSFUL';
        }

        return label;
    };

    useEffect(() => {
        if (session.user) {
            navigate('/');
        }
    }, [session]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Card>
                <form onSubmit={handleFormSubmit}>
                    <div className="w-full h-full sm:p-2">
                        <div className="font-bold text-center text-xl">
                            LOG IN
                        </div>

                        <input
                            value={email}
                            disabled={isLoggingIn}
                            required
                            placeholder="ENTER EMAIL"
                            className="form-input w-full mt-8"
                            onChange={handleEmailChange}
                        />

                        <input
                            value={password}
                            disabled={isLoggingIn}
                            required
                            type="password"
                            placeholder="PASSWORD"
                            className="form-input w-full mt-4"
                            onChange={handlePasswordChange}
                        />

                        <button
                            disabled={isLoggingIn}
                            type="submit"
                            className="btn-primary w-full mt-8"
                        >
                            {getSubmitButtonLabel()}
                        </button>

                        {loginError && (
                            <div className="text-red-800 font-bold text-center mt-4">
                                {loginError.message}
                            </div>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default withSession(Login);
