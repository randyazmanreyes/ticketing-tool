import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import withSession, { WithSessionProps } from '../../../hoc/withSession';
import { TicketsProvider } from '../../../hoc/withTickets';
import TicketDetails from './TicketDetails';

const Details = ({ session, logout }: WithSessionProps): JSX.Element | null => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        if (!session.user) {
            navigate('/login');
        }
    }, [session]);

    if (!session.user) {
        return null;
    }

    return (
        <TicketsProvider>
            <div className="p-4 pt-[4rem]">
                <div className="top-bar">
                    <div className="grow" />

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleLogout}
                    >
                        LOG OUT
                    </button>
                </div>

                <div className="flex justify-center pt-4">
                    <TicketDetails />
                </div>
            </div>
        </TicketsProvider>
    );
};

export default withSession(Details);
