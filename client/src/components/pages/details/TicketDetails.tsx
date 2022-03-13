import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TicketStatus from '../../../../../common/constants/TicketStatus';
import withTickets, { WithTicketsProps } from '../../../hoc/withTickets';
import Card from '../../common/Card';
import CircularLoader from '../../common/CircularLoader';
import RadioButtonGroup, {
    RadioButtonData,
} from '../../common/RadioButtonGroup';

type TicketParams = {
    ticketId: string;
};

const radioButtonGroupData: RadioButtonData[] = [
    {
        value: TicketStatus.Open,
        label: 'OPEN',
    },
    {
        value: TicketStatus.InProgress,
        label: 'IN PROGRESS',
    },
    {
        value: TicketStatus.Completed,
        label: 'COMPLETED',
    },
];

const TicketDetails = ({ fetchTicketById }: WithTicketsProps): JSX.Element => {
    const { ticketId } = useParams<TicketParams>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus | undefined>();
    const [isFetching, setIsFetching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchTicket = async () => {
        try {
            if (ticketId) {
                setIsFetching(true);

                const ticket = await fetchTicketById(+ticketId);

                if (ticket) {
                    setTitle(ticket.title);
                    setDescription(ticket.description);
                    setStatus(ticket.status);
                }
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    const getRadioSelectedData = () => {
        const data = radioButtonGroupData.find(
            (pData) => pData.value === status
        );

        return data;
    };

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(event.target.value);
    };

    const handleRadioButtonGroupChange = (data: RadioButtonData) => {
        console.log(data);
    };

    useEffect(() => {
        fetchTicket();
    }, []);

    return (
        <Card>
            <form onSubmit={handleFormSubmit}>
                <div className="text-xl text-center font-bold">
                    TICKET DETAILS
                </div>

                <div className="text-sm font-bold mt-8">TITLE</div>

                <input
                    required
                    value={title}
                    disabled={isFetching || isSaving}
                    className="form-input mt-1"
                    onChange={handleTitleChange}
                />

                <div className="text-sm font-bold mt-4">DESCRIPTION</div>

                <textarea
                    required
                    rows={4}
                    value={description}
                    disabled={isFetching || isSaving}
                    className="form-input mt-1"
                    onChange={handleDescriptionChange}
                />

                <div className="text-sm font-bold mt-2">STATUS</div>

                <RadioButtonGroup
                    name="ticketStatus"
                    data={radioButtonGroupData}
                    selectedData={getRadioSelectedData()}
                    isDisabled={isFetching || isSaving}
                    onChange={handleRadioButtonGroupChange}
                />

                <button
                    type="submit"
                    disabled={isFetching || isSaving}
                    className="btn-primary w-full mt-6"
                >
                    {isSaving && <CircularLoader className="border-lime-400" />}
                    SAVE
                </button>
            </form>
        </Card>
    );
};

export default withTickets(TicketDetails);
