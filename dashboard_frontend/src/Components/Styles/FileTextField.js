import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';

export const StyledTextField = styled(TextField)`
width: 90%;
`;

const txFile = (props) => {
    return (
        < StyledTextField
            variant="outlined"
            size="small"
            value={props.txValFile}
            label={props.txLabFile}
            onChange={props.txChFile}
            onKeyDown={props.txSbFile}
        />
    );
}

export default React.memo(txFile);