import axios, { AxiosResponse } from 'axios';
import React, { ComponentType, createContext, useState } from 'react';
import TicketStatus from '../../../common/constants/TicketStatus';
import Ticket from '../../../common/data/ticket';
import CreateTicketBody from '../../../common/request/create-ticket-body';
import CreateTicketResponse from '../../../common/request/create-ticket-response';
import GetTicketsResponse from '../../../common/request/get-tickets-response';
import MoveTicketBody from '../../../common/request/move-ticket-body';
import ReorderTicketsBody from '../../../common/request/reorder-tickets-body';
import SuccessResponse from '../../../common/request/success-response';

interface Props {
    children: React.ReactNode;
}

export interface WithTicketsProps {
    tickets: Ticket[];
    openTickets: Ticket[];
    inProgressTickets: Ticket[];
    completedTickets: Ticket[];
    isFetchingTickets: boolean;
    fetchTickets(): Promise<void>;
    createTicket(title: string, description: string): Promise<void>;
    reorderTickets(
        status: TicketStatus,
        startIndex: number,
        endIndex: number
    ): void;
    moveTicket(
        sourceStatus: TicketStatus,
        destinationStatus: TicketStatus,
        sourceIndex: number,
        destinationIndex: number
    ): void;
}

const TicketsContext = createContext<WithTicketsProps | null>(null);

/**
 * TODO:
 * MAKE THIS USE CUSTOM HOOKS
 * SHOW ANOTHER WAY OF USING CONTEXT API
 * DIFFERENT FROM HOW SESSION IS HANDLED
 */
export const TicketsProvider = ({ children }: Props): JSX.Element => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
    const [inProgressTickets, setInProgressTickets] = useState<Ticket[]>([]);
    const [completedTickets, setCompletedTickets] = useState<Ticket[]>([]);
    const [isFetchingTickets, setIsFetchingTickets] = useState(false);

    const fetchTickets = async () => {
        setIsFetchingTickets(true);

        const {
            data: { tickets: allTickets },
        } = await axios.get<GetTicketsResponse>('/tickets');

        setTickets(allTickets);
        setOpenTickets(
            allTickets.filter((ticket) => ticket.status === TicketStatus.Open)
        );
        setInProgressTickets(
            allTickets.filter(
                (ticket) => ticket.status === TicketStatus.InProgress
            )
        );
        setCompletedTickets(
            allTickets.filter(
                (ticket) => ticket.status === TicketStatus.Completed
            )
        );

        setIsFetchingTickets(false);
    };

    const getTicketsByStatus = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.InProgress:
                return inProgressTickets;

            case TicketStatus.Completed:
                return completedTickets;

            default:
                return openTickets;
        }
    };

    const setTicketsByStatus = (status: TicketStatus, pTickets: Ticket[]) => {
        switch (status) {
            case TicketStatus.InProgress:
                setInProgressTickets(pTickets);
                break;

            case TicketStatus.Completed:
                setCompletedTickets(pTickets);
                break;

            default:
                setOpenTickets(pTickets);
        }
    };

    const createTicket = async (title: string, description: string) => {
        // NOTE:
        // error is not handled here in purpose
        // so that UI will handle it
        const {
            data: { ticket },
        } = await axios.post<
            CreateTicketResponse,
            AxiosResponse<CreateTicketResponse, CreateTicketBody>,
            CreateTicketBody
        >('/tickets', {
            title,
            description,
        });

        console.log(`ticket ${ticket.id} created`);
    };

    const reorderTickets = async (
        status: TicketStatus,
        startIndex: number,
        endIndex: number
    ) => {
        const aTickets = Array.from(getTicketsByStatus(status));
        const [removedTicket] = aTickets.splice(startIndex, 1);

        aTickets.splice(endIndex, 0, removedTicket);
        aTickets.forEach((pTicket, index) => {
            // fix for no-param-reassign error
            const aTicket = pTicket;
            aTicket.order = index;
        });
        setTicketsByStatus(status, aTickets);

        try {
            await axios.post<
                SuccessResponse,
                AxiosResponse<SuccessResponse, ReorderTicketsBody>,
                ReorderTicketsBody
            >('/reorder-tickets', {
                id: removedTicket.id,
                startIndex,
                endIndex,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const moveTicket = async (
        sourceStatus: TicketStatus,
        destinationStatus: TicketStatus,
        sourceIndex: number,
        destinationIndex: number
    ) => {
        console.log(`move ticket from ${sourceStatus} to ${destinationStatus}`);
        const sourceTickets = Array.from(getTicketsByStatus(sourceStatus));
        const [removedTicket] = sourceTickets.splice(sourceIndex, 1);
        const destinationTickets = Array.from(
            getTicketsByStatus(destinationStatus)
        );

        removedTicket.status = destinationStatus;

        destinationTickets.splice(destinationIndex, 0, removedTicket);
        sourceTickets.forEach((pTicket, index) => {
            // fix for no-param-reassign error
            const aTicket = pTicket;
            aTicket.order = index;
        });
        destinationTickets.forEach((pTicket, index) => {
            // fix for no-param-reassign error
            const aTicket = pTicket;
            aTicket.order = index;
        });

        setTicketsByStatus(sourceStatus, sourceTickets);
        setTicketsByStatus(destinationStatus, destinationTickets);

        try {
            await axios.post<
                SuccessResponse,
                AxiosResponse<SuccessResponse, MoveTicketBody>,
                MoveTicketBody
            >('/move-ticket', {
                sourceStatus,
                destinationStatus,
                sourceIndex,
                destinationIndex,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const value = {
        tickets,
        openTickets,
        inProgressTickets,
        completedTickets,
        isFetchingTickets,
        fetchTickets,
        createTicket,
        reorderTickets,
        moveTicket,
    };

    return (
        <TicketsContext.Provider value={value}>
            {children}
        </TicketsContext.Provider>
    );
};

export default function withTickets<
    P extends WithTicketsProps = WithTicketsProps
>(WrappedComponent: ComponentType<P>) {
    const ComponentWithTickets = (props: Omit<P, keyof WithTicketsProps>) => {
        return (
            <TicketsContext.Consumer>
                {(context) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <WrappedComponent {...props} {...(context as P)} />
                )}
            </TicketsContext.Consumer>
        );
    };

    return ComponentWithTickets;
}
