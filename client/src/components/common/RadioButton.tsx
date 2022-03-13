import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

interface Props {
    name: string;
    value: string;
    label: string;
    isChecked?: boolean;
    isDisabled?: boolean;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    onChange?(event: ChangeEvent<HTMLInputElement>): void;
}

const defaultProps = {
    isChecked: false,
    isDisabled: false,
    className: '',
    labelClassName: '',
    inputClassName: '',
    onChange: undefined,
};

const RadioButton = ({
    name,
    value,
    label,
    isChecked,
    isDisabled,
    className,
    labelClassName,
    inputClassName,
    onChange,
}: Props): JSX.Element => {
    const inputId = `${name}-${value}`;

    return (
        <div className={classNames('flex items-center h-6', className)}>
            <input
                id={inputId}
                type="radio"
                name={name}
                value={value}
                checked={isChecked}
                disabled={isDisabled}
                className={classNames(
                    'w-4 h-4 focus:ring-2 accent-teal-800 hover:accent-teal-600 focus:ring-transparent disabled:opacity-60 mr-1',
                    inputClassName
                )}
                aria-labelledby={inputId}
                aria-describedby={inputId}
                onChange={onChange}
            />

            <label
                htmlFor={inputId}
                className={classNames(
                    'h-6 pt-[1px]',
                    { 'opacity-60': isDisabled },
                    labelClassName
                )}
            >
                {label}
            </label>
        </div>
    );
};

RadioButton.defaultProps = defaultProps;

export default RadioButton;
