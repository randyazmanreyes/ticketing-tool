import React from 'react';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

interface Props {
    id: number;
    index: number;
    title: string;
}

const Ticket = ({ id, index, title }: Props): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/ticket/${id}`);
    };

    return (
        <Draggable draggableId={id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={classNames('ticket', {
                        'bg-teal-200': snapshot.isDragging,
                        'border-teal-400': snapshot.isDragging,
                    })}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...provided.draggableProps}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...provided.dragHandleProps}
                    onClick={handleClick}
                    onKeyPress={() => {}}
                    role="none"
                >
                    {title}
                </div>
            )}
        </Draggable>
    );
};

export default Ticket;
