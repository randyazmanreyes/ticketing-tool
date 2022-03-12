import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import TicketStatus from '../../../../../../common/constants/TicketStatus';
import TicketData from '../../../../../../common/data/ticket';
import Ticket from './Ticket';
import orderSort from '../../../../../../common/utils/order-sort';
import CircularLoader from '../../../common/CircularLoader';

interface Props {
    status: TicketStatus;
    tickets: TicketData[];
    isDropDisabled: boolean;
    isLoading: boolean;
    title?: string;
}

const defaultProps = {
    title: 'TITLE',
};

const TicketList = ({
    status,
    tickets,
    isDropDisabled,
    isLoading,
    title,
}: Props & typeof defaultProps): JSX.Element => {
    const renderTickets = tickets
        .sort(orderSort)
        .map((ticket, index) => (
            <Ticket
                key={ticket.id}
                id={ticket.id}
                index={index}
                title={ticket.title}
            />
        ));

    return (
        <div className="ticket-list flex flex-col">
            <div className="font-bold mb-2">{title}</div>

            {isLoading && (
                <div className="flex justify-center items-center w-full h-full">
                    <CircularLoader />
                </div>
            )}

            {!isLoading && (
                <Droppable droppableId={status} isDropDisabled={isDropDisabled}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={classNames('grow rounded-md', {
                                'bg-teal-400':
                                    !isDropDisabled && snapshot.isDraggingOver,
                                'bg-rose-400': isDropDisabled,
                            })}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...provided.droppableProps}
                        >
                            {renderTickets}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            )}
        </div>
    );
};

TicketList.defaultProps = defaultProps;

export default TicketList;
