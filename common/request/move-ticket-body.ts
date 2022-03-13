import TicketStatus from '../constants/TicketStatus';

export default interface MoveTicketBody {
    sourceStatus: TicketStatus;
    destinationStatus: TicketStatus;
    sourceIndex: number;
    destinationIndex: number;
}
