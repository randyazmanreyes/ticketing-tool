import TicketStatus from '../constants/TicketStatus';

export default interface UpdateTicketBody {
    title: string;
    description: string;
    status: TicketStatus;
}
