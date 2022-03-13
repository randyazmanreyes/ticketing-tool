import React from 'react';
import withSession, { WithSessionProps } from '../../../hoc/withSession';
import { TicketsProvider } from '../../../hoc/withTickets';
import PrivateRoute from '../PrivateRoute';
import TicketDetails from './TicketDetails';

/**
 * NOTE!!!
 * YOU CAN ALSO WRAP THE PAGE COMPONENT HERE
 * WITH THE PRIVATE ROUTE COMPONENT
 */

const Details = ({ logout }: WithSessionProps): JSX.Element | null => {
    const handleLogout = () => {
        logout();
    };

    return (
        <PrivateRoute>
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
        </PrivateRoute>
    );
};

export default withSession(Details);
