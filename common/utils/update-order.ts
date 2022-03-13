import Ticket from '../data/ticket';

const updateOrder = (tickets: Ticket[]) => {
    tickets.forEach((ticket, index) => {
        // fix for no-param-reassign error
        const aTicket = ticket;
        aTicket.order = index;
    });
};

export default updateOrder;
