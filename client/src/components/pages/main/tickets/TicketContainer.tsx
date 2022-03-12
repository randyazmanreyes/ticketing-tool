import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import TicketStatus from '../../../../../../common/constants/TicketStatus';
import withTickets, { WithTicketsProps } from '../../../../hoc/withTickets';
import TicketList from './TicketList';

const TicketContainer = ({
    openTickets,
    inProgressTickets,
    completedTickets,
    reorderTickets,
    moveTicket,
}: WithTicketsProps) => {
    const handleDragEnd = (result: DropResult) => {
        console.log(result);
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            reorderTickets(
                destination.droppableId as TicketStatus,
                source.index,
                destination.index
            );
        } else {
            moveTicket(
                source.droppableId as TicketStatus,
                destination.droppableId as TicketStatus,
                source.index,
                destination.index
            );
        }
    };

    return (
        <div className="flex justify-start sm:justify-center px-4">
            <DragDropContext onDragEnd={handleDragEnd}>
                <TicketList
                    tickets={openTickets}
                    status={TicketStatus.Open}
                    title="OPEN"
                />

                <TicketList
                    tickets={inProgressTickets}
                    status={TicketStatus.InProgress}
                    title="IN PROGRESS"
                />

                <TicketList
                    tickets={completedTickets}
                    status={TicketStatus.Completed}
                    title="COMPLETED"
                />
            </DragDropContext>
        </div>
    );
};

export default withTickets(TicketContainer);
