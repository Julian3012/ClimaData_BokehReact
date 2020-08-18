import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

export const StyledButton = withStyles({
    root: {
        borderRadius: 3,
        border: 0,
        color: 'black',
        width: "100%",
        marginTop: 5,
        backgroundColor: "#fff",
        boxShadow: "1px 2px 1px -1px rgba(0,0,0,0.2)",
        fontFamily: "sans-serif",
        // height: 48,
        // padding: '0 30px',
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
        textTransform: "capitalize",
    },
})(Button);

export default StyledButton;