import React from 'react';
import classNames from 'classnames';

interface Props {
    className?: string;
}

const defaultProps = {
    className: '',
};

const CircularLoader = ({ className }: Props): JSX.Element => {
    return (
        <div
            className={classNames(
                'absolute w-6 h-6 rounded-full animate-spin border-2 border-solid border-teal-800 border-t-transparent',
                className
            )}
        />
    );
};

CircularLoader.defaultProps = defaultProps;

export default CircularLoader;
