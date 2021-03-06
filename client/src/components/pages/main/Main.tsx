import React, { useState } from 'react';
import withSession, { WithSessionProps } from '../../../hoc/withSession';
import { TicketsProvider } from '../../../hoc/withTickets';
import CreateTicketModal from './modals/CreateTicketModal';
import TicketContainer from './tickets/TicketContainer';

const Main = ({ logout }: WithSessionProps): JSX.Element | null => {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const handleCreateTicketClick = () => {
        setIsShowCreateModal(!isShowCreateModal);
    };

    const handleCloseModal = () => {
        setIsShowCreateModal(false);
    };

    return (
        <TicketsProvider>
            <div className="pt-[4rem]">
                <div className="top-bar">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleCreateTicketClick}
                    >
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

                <CreateTicketModal
                    show={isShowCreateModal}
                    onClose={handleCloseModal}
                />
            </div>
        </TicketsProvider>
    );
};

export default withSession(Main);
