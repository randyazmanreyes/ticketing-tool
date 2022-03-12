import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import withSession, { WithSessionProps } from '../../../hoc/withSession';
import { TicketsProvider } from '../../../hoc/withTickets';
import TicketContainer from './tickets/TicketContainer';

const Main = ({ session, logout }: WithSessionProps): JSX.Element | null => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!session.user) {
            navigate('/login');
        }
    }, [session]);

    const handleLogout = () => {
        logout();
    };

    if (!session.user) {
        return null;
    }

    return (
        <TicketsProvider>
            <div className="inline-block sm:block p-4 pt-[4rem]">
                <div className="top-bar">
                    <button type="button" className="btn-primary">
                        CREATE TICKET
                    </button>

                    <div className="grow" />

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleLogout}
                    >
                        LOG OUT
                    </button>
                </div>

                <TicketContainer />
            </div>
        </TicketsProvider>
    );
};

export default withSession(Main);
