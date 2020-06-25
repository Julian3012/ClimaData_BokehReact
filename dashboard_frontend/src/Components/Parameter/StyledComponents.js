import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

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