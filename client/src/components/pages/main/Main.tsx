import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import withSession, { WithSessionProps } from '../../../hoc/withSession';
import { TicketsProvider } from '../../../hoc/withTickets';
import TicketContainer from './tickets/TicketContainer';

const Main = ({ session }: WithSessionProps): JSX.Element | null => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!session.user) {
            navigate('/login');
        }
    }, []);

    if (!session.user) {
        return null;
    }

    return (
        <TicketsProvider>
            <div className="inline-block sm:block p-4">
                <button type="button" className="btn-primary mb-4">
                    CREATE TICKET
                </button>

                <TicketContainer />
            </div>
        </TicketsProvider>
    );
};

export default withSession(Main);
