import Ticket from '../data/ticket';

const orderSort = (ticketA: Ticket, ticketB: Ticket) => {
    if (ticketA.order < ticketB.order) {
        return -1;
    }

    if (ticketA.order > ticketB.order) {
        return 1;
    }

    return 0;
};

export default orderSort;
