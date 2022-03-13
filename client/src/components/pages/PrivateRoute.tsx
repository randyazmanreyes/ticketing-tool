import React from 'react';
import { Navigate } from 'react-router-dom';
import withSession, { WithSessionProps } from '../../hoc/withSession';

interface Props extends WithSessionProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children, session }: Props): JSX.Element => {
    if (!session.user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default withSession(PrivateRoute);
