import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

// export const StyledTextField = styled(TextField)`
// width: 20%;
// font-size: 11px;
// `;

export const StyledTextField = withStyles({
    root: {
         // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        // borderRadius: 3,
        // border: 0,
        width: "40%",
        // height: 48,
        // padding: '0 30px',
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
})(TextField);

export default StyledTextField;