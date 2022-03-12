import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import TicketStatus from '../../../../../../common/constants/TicketStatus';
import TicketData from '../../../../../../common/data/ticket';
import Ticket from './Ticket';
import orderSort from '../../../../../../common/utils/order-sort';

interface Props {
    status: TicketStatus;
    tickets: TicketData[];
    title?: string;
}

const defaultProps = {
    title: 'HEADER',
};

const TicketList = ({
    status,
    tickets,
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

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={classNames('grow', {
                            'bg-teal-400': snapshot.isDraggingOver,
                        })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...provided.droppableProps}
                    >
                        {renderTickets}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

TicketList.defaultProps = defaultProps;

export default TicketList;
