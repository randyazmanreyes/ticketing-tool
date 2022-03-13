import React, { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import Card from '../../../common/Card';
import { useTickets } from '../../../../hoc/withTickets';
import CircularLoader from '../../../common/CircularLoader';

/**
 * NOTE!!!
 * THIS COMPONENT IS NOT USING THE TICKETS HOC
 * INSTEAD IT USES CUSTOM HOOKS TO ACCESS THE
 * CONTEXT API
 */

interface Props {
    show?: boolean;
    onClose?(): void;
}

const defaultProps = {
    show: false,
    onClose: undefined,
};

const CreateTicketModal = ({ show, onClose }: Props): JSX.Element => {
    const { createTicket, fetchTickets } = useTickets();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsCreating(true);

        try {
            await createTicket(title, description);

            await fetchTickets();

            setTitle('');
            setDescription('');

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        }

        setIsCreating(false);
    };

    const handleCloseClick = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(event.target.value);
    };

    return (
        <div
            className={classNames(
                'flex justify-center items-center h-screen w-screen z-[1000] backdrop-blur-sm fixed top-0 left-0 overflow-hidden',
                { hidden: !show }
            )}
        >
            <Card className="bg-white drop-shadow-md">
                <button
                    type="button"
                    disabled={isCreating}
                    className="absolute top-2 right-2 hover:bg-gray-200 p-1 rounded-md disabled:opacity-40 disabled:pointer-events-none"
                    onClick={handleCloseClick}
                >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <form onSubmit={handleFormSubmit}>
                    <div className="text-xl text-center font-bold">
                        CREATE TICKET
                    </div>

                    <input
                        required
                        value={title}
                        disabled={isCreating}
                        placeholder="ENTER TITLE"
                        className="form-input mt-8"
                        onChange={handleTitleChange}
                    />

                    <textarea
                        required
                        rows={4}
                        value={description}
                        disabled={isCreating}
                        placeholder="ENTER DESCRIPTION"
                        className="form-input mt-4"
                        onChange={handleDescriptionChange}
                    />

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="btn-primary w-full mt-6"
                    >
                        {isCreating && (
                            <CircularLoader className="border-lime-400" />
                        )}
                        CREATE
                    </button>
                </form>
            </Card>
        </div>
    );
};

CreateTicketModal.defaultProps = defaultProps;

export default CreateTicketModal;
