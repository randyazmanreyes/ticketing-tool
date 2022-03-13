import TicketStatus from '../../common/constants/TicketStatus';
import Ticket from '../../common/data/ticket';
import orderSort from '../../common/utils/order-sort';
import updateOrder from '../../common/utils/update-order';

let ticketIdIncrement = 0;

class TicketService {
    mTickets!: Ticket[];

    constructor() {
        this.mTickets = [];
    }

    public get tickets() {
        return this.mTickets;
    }

    public create(title: string, description: string) {
        ticketIdIncrement += 1;

        const ticket: Ticket = {
            id: ticketIdIncrement,
            title,
            description,
            status: TicketStatus.Open,
            order: 0, // temporarily set this to zero
            createdAt: new Date().toISOString(),
        };

        const openTickets = this.tickets
            .filter((pTicket) => pTicket.status === TicketStatus.Open)
            .sort(orderSort);

        const lastOpenTicket = openTickets[openTickets.length - 1];
        ticket.order = lastOpenTicket ? lastOpenTicket.order + 1 : 0;

        this.mTickets.push(ticket);

        return ticket;
    }

    public reorder(id: number, startIndex: number, endIndex: number) {
        const foundTicket = this.tickets.find((pTicket) => pTicket.id === id);

        if (foundTicket) {
            const tickets = this.tickets
                .filter((pTicket) => pTicket.status === foundTicket.status)
                .sort(orderSort);
            const [removedTicket] = tickets.splice(startIndex, 1);

            tickets.splice(endIndex, 0, removedTicket);
            updateOrder(tickets);
        }
    }

    public move(
        sourceStatus: TicketStatus,
        destinationStatus: TicketStatus,
        sourceIndex: number,
        destinationIndex: number
    ) {
        const sourceTickets = this.tickets.filter(
            (pTicket) => pTicket.status === sourceStatus
        );
        const [removedTicket] = sourceTickets.splice(sourceIndex, 1);
        const destinationTickets = this.tickets.filter(
            (pTicket) => pTicket.status === destinationStatus
        );

        removedTicket.status = destinationStatus;

        destinationTickets.splice(destinationIndex, 0, removedTicket);
        updateOrder(sourceTickets);
        updateOrder(destinationTickets);
    }

    public getById(id: number) {
        const ticket = this.tickets.find((pTicket) => pTicket.id === id);

        return ticket;
    }

    public updateById(
        id: number,
        title: string,
        description: string,
        status: TicketStatus
    ) {
        const ticket = this.tickets.find((pTicket) => pTicket.id === id);

        if (ticket) {
            const prevStatus = ticket.status;

            ticket.title = title;
            ticket.description = description;
            ticket.status = status;

            // status has changed, reorder tickets
            if (prevStatus !== status) {
                // update order of previous status tickets
                let tickets = this.mTickets
                    .filter((pTicket) => pTicket.status === prevStatus)
                    .sort(orderSort);

                updateOrder(tickets);

                // update order of the target status
                tickets = this.mTickets
                    .filter((pTicket) => pTicket.status === status)
                    .sort(orderSort);

                updateOrder(tickets);
            }
        }
    }
}

const ticketService = new TicketService();

export default ticketService;
