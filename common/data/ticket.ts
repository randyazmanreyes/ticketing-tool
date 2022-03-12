import TicketStatus from '../constants/TicketStatus';

export default interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    order: number;
}
