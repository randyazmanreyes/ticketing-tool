import TicketStatus from '../../common/constants/TicketStatus';
import Ticket from '../../common/data/ticket';
import orderSort from '../../common/utils/order-sort';

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
        };

        const openTickets = this.tickets.filter(
            (pTicket) => pTicket.status === TicketStatus.Open
        );

        openTickets.sort((a, b) => a.order - b.order);

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

            tickets.forEach((pTicket, index) => {
                // fix for no-param-reassign error
                const aTicket = pTicket;
                aTicket.order = index;
            });
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
    }
}

const ticketService = new TicketService();

export default ticketService;
