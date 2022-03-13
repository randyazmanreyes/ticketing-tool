import axios, { AxiosResponse } from 'axios';
import React, {
    ComponentType,
    createContext,
    useContext,
    useState,
} from 'react';
import TicketStatus from '../../../common/constants/TicketStatus';
import Ticket from '../../../common/data/ticket';
import CreateTicketBody from '../../../common/request/create-ticket-body';
import CreateTicketResponse from '../../../common/request/create-ticket-response';
import GetTicketByIdResponse from '../../../common/request/get-ticketbyid-response';
import GetTicketsResponse from '../../../common/request/get-tickets-response';
import MoveTicketBody from '../../../common/request/move-ticket-body';
import ReorderTicketsBody from '../../../common/request/reorder-tickets-body';
import SuccessResponse from '../../../common/request/success-response';
import UpdateTicketBody from '../../../common/request/update-ticket-body';

interface Props {
    children: React.ReactNode;
}

export interface TicketsContextData {
    tickets: Ticket[];
    openTickets: Ticket[];
    inProgressTickets: Ticket[];
    completedTickets: Ticket[];
    isFetchingTickets: boolean;
    createTicket(title: string, description: string): Promise<void>;
    fetchTickets(): Promise<void>;
    fetchTicketById(id: number): Promise<Ticket>;
    updateTicketbyId(
        id: number,
        title: string,
        description: string,
        status: TicketStatus
    ): Promise<void>;
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

const TicketsContext = createContext<TicketsContextData>(
    {} as TicketsContextData
);

export const useTickets = () => {
    return useContext(TicketsContext);
};

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

    const fetchTicketById = async (id: number) => {
        const {
            data: { ticket },
        } = await axios.get<GetTicketByIdResponse>(`/tickets/${id}`);

        return ticket;
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

    const updateTicketbyId = async (
        id: number,
        title: string,
        description: string,
        status: TicketStatus
    ) => {
        const { data } = await axios.patch<
            SuccessResponse,
            AxiosResponse<SuccessResponse, UpdateTicketBody>,
            UpdateTicketBody
        >(`/tickets/${id}`, { title, description, status });

        console.log('ticket updated:', data.success);
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
        createTicket,
        fetchTickets,
        fetchTicketById,
        updateTicketbyId,
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
    P extends TicketsContextData = TicketsContextData
>(WrappedComponent: ComponentType<P>) {
    const ComponentWithTickets = (props: Omit<P, keyof TicketsContextData>) => {
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
