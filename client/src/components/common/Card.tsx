import React from 'react';

interface Props {
    children: React.ReactNode;
}

const Card = ({ children }: Props): JSX.Element => {
    return (
        <div className="rounded-md max-w-xs min-w-[20rem] sm:max-w-sm border border-gray-200 p-4">
            {children}
        </div>
    );
};

export default Card;
