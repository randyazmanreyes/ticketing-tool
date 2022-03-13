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

const RADIO_BUTTON_GROUP_DATA: RadioButtonData[] = [
    {
        value: TicketStatus.Open,
        label: 'OPEN',
        isDisabled: false,
    },
    {
        value: TicketStatus.InProgress,
        label: 'IN PROGRESS',
        isDisabled: false,
    },
    {
        value: TicketStatus.Completed,
        label: 'COMPLETED',
        isDisabled: false,
    },
];

const TicketDetails = ({
    fetchTicketById,
    updateTicketbyId,
}: WithTicketsProps): JSX.Element => {
    const { ticketId } = useParams<TicketParams>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus | undefined>();
    const [initialTitle, setInitialTitle] = useState('');
    const [initialDescription, stInitialDescription] = useState('');
    const [initialStatus, setInitialStatus] = useState<
        TicketStatus | undefined
    >();
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

                    if (!initialTitle) {
                        setInitialTitle(ticket.title);
                    }

                    if (!initialDescription) {
                        stInitialDescription(ticket.description);
                    }

                    if (!initialStatus) {
                        setInitialStatus(ticket.status);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    const getRadioGroupData = () => {
        switch (initialStatus) {
            case TicketStatus.Completed:
                return RADIO_BUTTON_GROUP_DATA.map((pData) => ({
                    ...pData,
                    isDisabled: pData.value === TicketStatus.InProgress,
                }));

            default:
                return RADIO_BUTTON_GROUP_DATA;
        }
    };

    const getRadioSelectedData = () => {
        const data = RADIO_BUTTON_GROUP_DATA.find(
            (pData) => pData.value === status
        );

        return data;
    };

    const saveDisabled = () => {
        return (
            isSaving ||
            isFetching ||
            (title === initialTitle &&
                description === initialDescription &&
                status === initialStatus)
        );
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
        setStatus(data.value as TicketStatus);
    };

    const handleSaveClick = async () => {
        if (!ticketId || !status) {
            return;
        }

        try {
            setIsSaving(true);

            await updateTicketbyId(+ticketId, title, description, status);

            setIsSaving(false);
        } catch (error) {
            console.log(error);
        }
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
                    data={getRadioGroupData()}
                    selectedData={getRadioSelectedData()}
                    isDisabled={isFetching || isSaving}
                    onChange={handleRadioButtonGroupChange}
                />

                <button
                    type="submit"
                    disabled={saveDisabled()}
                    className="btn-primary w-full mt-6"
                    onClick={handleSaveClick}
                >
                    {isSaving && <CircularLoader className="border-lime-400" />}
                    SAVE
                </button>
            </form>
        </Card>
    );
};

export default withTickets(TicketDetails);
