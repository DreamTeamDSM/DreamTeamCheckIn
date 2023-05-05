import { Button as MuiButton } from "@mui/material"
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    button: {
        backgroundColor: '#849CC2',
        borderRadius: '100px'
    },
});

const Button = ({ ...props }) => {
    const styles = useStyles()

    return (<MuiButton className={styles.button} {...props} />)
}

export { Button }