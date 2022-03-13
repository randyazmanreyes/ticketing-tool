import React, { ChangeEvent, useEffect } from 'react';
import classNames from 'classnames';
import RadioButton from './RadioButton';

export interface RadioButtonData {
    value: string;
    label: string;
}

interface Props {
    name: string;
    data: RadioButtonData[];
    selectedData?: RadioButtonData;
    isDisabled?: boolean;
    className?: string;
    radioButtonClassName?: string;
    radioButtonLabelClassName?: string;
    radioButtonInputClassName?: string;
    onChange?(data: RadioButtonData): void;
}

const defaultProps = {
    selectedData: undefined,
    isDisabled: false,
    className: '',
    radioButtonClassName: '',
    radioButtonLabelClassName: '',
    radioButtonInputClassName: '',
    onChange: undefined,
};

const RadioButtonGroup = ({
    name,
    data,
    selectedData,
    isDisabled,
    className,
    radioButtonClassName,
    radioButtonLabelClassName,
    radioButtonInputClassName,
    onChange,
}: Props): JSX.Element => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const aData = data.find(
            (pData) => pData.value === event.currentTarget.value
        );

        if (onChange && aData) {
            onChange(aData);
        }
    };

    const isRadioButtonChecked = (pData: RadioButtonData) => {
        if (selectedData) {
            return selectedData.value === pData.value;
        }

        return false;
    };

    const radioButtonRender = data.map((pData) => (
        <RadioButton
            key={pData.value}
            name={name}
            value={pData.value}
            label={pData.label}
            isChecked={isRadioButtonChecked(pData)}
            isDisabled={isDisabled}
            className={classNames('mt-1', radioButtonClassName)}
            labelClassName={classNames('mt-1', radioButtonLabelClassName)}
            inputClassName={classNames('mt-1', radioButtonInputClassName)}
            onChange={handleChange}
        />
    ));

    useEffect(() => {
        if (onChange && selectedData) {
            onChange(selectedData);
        }
    }, [selectedData, onChange]);

    return <div className={classNames('', className)}>{radioButtonRender}</div>;
};

RadioButtonGroup.defaultProps = defaultProps;

export default RadioButtonGroup;
