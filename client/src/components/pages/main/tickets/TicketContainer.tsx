import React, { useEffect, useState } from 'react';
import { DragDropContext, DragStart, DropResult } from 'react-beautiful-dnd';
import TicketStatus from '../../../../../../common/constants/TicketStatus';
import withTickets, { WithTicketsProps } from '../../../../hoc/withTickets';
import TicketList from './TicketList';

const TicketContainer = ({
    openTickets,
    inProgressTickets,
    completedTickets,
    isFetchingTickets,
    fetchTickets,
    reorderTickets,
    moveTicket,
}: WithTicketsProps): JSX.Element => {
    const [isOpenDropDisabled, setIsOpenDropDisabled] = useState(false);
    const [isInProgressDropDisabled, setIsInProgressDropDisabled] =
        useState(false);
    const [isCompletedDropDisabled, setIsCompletedDropDisabled] =
        useState(false);

    const handleDragStart = (initial: DragStart) => {
        const { source } = initial;
        const sourceStatus = source.droppableId;

        switch (sourceStatus) {
            case TicketStatus.Completed:
                setIsInProgressDropDisabled(true);
                break;

            default:
        }
    };

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        setIsOpenDropDisabled(false);
        setIsInProgressDropDisabled(false);
        setIsCompletedDropDisabled(false);

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

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className="flex justify-start sm:justify-center px-4">
            <DragDropContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <TicketList
                    tickets={openTickets}
                    status={TicketStatus.Open}
                    isDropDisabled={isOpenDropDisabled}
                    isLoading={isFetchingTickets}
                    title="OPEN"
                />

                <TicketList
                    tickets={inProgressTickets}
                    status={TicketStatus.InProgress}
                    isDropDisabled={isInProgressDropDisabled}
                    isLoading={isFetchingTickets}
                    title="IN PROGRESS"
                />

                <TicketList
                    tickets={completedTickets}
                    status={TicketStatus.Completed}
                    isDropDisabled={isCompletedDropDisabled}
                    isLoading={isFetchingTickets}
                    title="COMPLETED"
                />
            </DragDropContext>
        </div>
    );
};

export default withTickets(TicketContainer);
