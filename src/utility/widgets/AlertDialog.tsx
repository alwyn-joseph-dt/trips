import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { createRoot } from "react-dom/client";

const showAlertDialog = (title: string, description: string, isMobileView?: boolean): Promise<boolean> => {;
    return new Promise((resolve) => {
        const containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
        const root = createRoot(containerElement);

        const AlertDialogComponent = () => {
            const [open, setOpen] = useState(true);

            const handleClose = (result: boolean) => {
                setOpen(false);
                resolve(result);
            };

            useEffect(() => {
                if (!open) {
                    setTimeout(() => {
                        root.unmount();
                        containerElement.remove();
                    }, 0);
                }
            }, [open, root, containerElement]);


            return (
                <Dialog
                    open={open}
                    onClose={() => handleClose(false)}
                    id="alert-dialog"
                    sx={{
                        zIndex: '99999 !important',
                        '& .MuiDialog-root': {
                            zIndex: '99999 !important',
                        },
                        '& .MuiPaper-root': {
                            minWidth: {xs:200,sm:400},
                            height: isMobileView ? '120px !important' : '160px !important',
                            borderRadius: '18px',
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title" sx={{ fontSize: 16, fontWeight: 600, p:isMobileView ? '6px 0px 6px 11px' : '16px 24px 10px 24px', }}>
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" sx={{ fontSize: 12, fontWeight: 400, color: "#6d6d6d" }}>
                            {description}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose(false)} sx={{ color: "#676767", textTransform: 'none', fontSize: 16, fontWeight: 500 }}>
                            No
                        </Button>
                        <Button onClick={() => handleClose(true)} autoFocus sx={{ color: "#0087fa", textTransform: 'none', fontSize: 16, fontWeight: 500 }}>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };

        root.render(<AlertDialogComponent />);
    });
};

export default showAlertDialog;
