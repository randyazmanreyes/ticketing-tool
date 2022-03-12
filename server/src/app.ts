import express, { Request, Response } from 'express';
import Debug from 'debug';
import logger from 'morgan';
import compression from 'compression';
import path from 'path';
import LoginBody from '../../common/request/login-body';
import delay from '../../common/utils/delay';
import ticketService from './ticket-service';
import ReorderTicketsBody from '../../common/request/reorder-tickets-body';
import SuccessResponse from '../../common/request/success-response';
import LoginResponse from '../../common/request/login-response';
import ErrorResponse from '../../common/request/error-response';
import MoveTicketBody from '../../common/request/move-ticket-body';
import CreateTicketResponse from '../../common/request/create-ticket-response';
import CreateTicketBody from '../../common/request/create-ticket-body';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = Debug('ticketing-tool:app');

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    logger(
        ':remote-addr :method :status :url [:res[content-length] :response-time ms :total-time ms] [:date[clf]]'
    )
);

app.post(
    '/login',
    async (req: Request, res: Response<LoginResponse | ErrorResponse>) => {
        const { email, password } = <LoginBody>req.body;
        debug('authenticate credentials:', email, password);

        await delay(1000);

        if (email === 'test@vroom.com.au' && password === 'frontendtest2022') {
            res.status(200).send({ email });
        } else {
            res.status(401).send({
                message: 'Invalid email or password',
            });
        }
    }
);

app.post(
    '/tickets',
    async (req: Request, res: Response<CreateTicketResponse>) => {
        const { title, description } = <CreateTicketBody>req.body;

        await delay(1000);

        const ticket = ticketService.create(title, description);

        res.status(201).send({ ticket });
    }
);

app.post(
    '/reorder-tickets',
    async (req: Request, res: Response<SuccessResponse>) => {
        const { id, startIndex, endIndex } = <ReorderTicketsBody>req.body;
        debug('reorder ticket:', id, startIndex, endIndex);

        ticketService.reorder(id, startIndex, endIndex);

        res.status(200).send({ success: true });
    }
);

app.post(
    '/move-ticket',
    async (req: Request, res: Response<SuccessResponse>) => {
        const {
            sourceStatus,
            destinationStatus,
            sourceIndex,
            destinationIndex,
        } = <MoveTicketBody>req.body;
        debug(`move ticket from ${sourceStatus} to ${destinationStatus}`);

        ticketService.move(
            sourceStatus,
            destinationStatus,
            sourceIndex,
            destinationIndex
        );

        res.status(200).send({ success: true });
    }
);

app.get('/tickets', async (_req: Request, res: Response) => {
    await delay(2000);

    res.status(200).send({ tickets: ticketService.tickets });
});

app.use(express.static(path.join(__dirname, '../../dist')));

app.use('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

export default app;
