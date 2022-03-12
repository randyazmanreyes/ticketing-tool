import React from 'react';
import classNames from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
}

const defaultProps = {
    className: '',
};

const Card = ({ children, className }: Props): JSX.Element => {
    return (
        <div
            className={classNames(
                'rounded-md max-w-xs min-w-[20rem] sm:min-w-[24rem] sm:max-w-md border border-gray-200 p-4',
                className
            )}
        >
            {children}
        </div>
    );
};

Card.defaultProps = defaultProps;

export default Card;
