import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, makeStyles, IconButton } from '@material-ui/core'
import Controls from "./controls/Controls";
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';


const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: '#193498',
        color: '#69DADB',
        '&:hover': {
            backgroundColor: '#193498',
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '7rem',
        },
    }
}))

export default function ConfirmDialog(props) {

    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles()

    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h5">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
            {
                confirmDialog.noCancel 
               ?
                    ''
                    :
                    <Controls.Button
                    text="Cancelar"
                    color="default"
                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
             }       
                <Controls.Button
                    text="Aceptar"
                    color="primary"
                    onClick={confirmDialog.onConfirm} />
            </DialogActions>
        </Dialog>
    )
}