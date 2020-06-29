import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

export const StyledTextField = styled(TextField)`
width: 90%;
`;

export const StyledSlider = withStyles({
    root: {
        marginTop: 8,
        width: "90%",
        color: '#404863',
    },
    active: {},
})(Slider);

export const ValueLabelComponent = (props) => {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
};
