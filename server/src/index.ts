import Debug from 'debug';
import app from './app';
import ticketService from './ticket-service';

const debug = Debug('ticketing-tool:index');

const start = () => {
    ticketService.create('ticket 1', 'this is ticket 1');
    ticketService.create('ticket 2', 'this is ticket 2');
    ticketService.create('ticket 3', 'this is ticket 3');

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        debug(`Server is running in port ${port}`);
    });
};

start();
