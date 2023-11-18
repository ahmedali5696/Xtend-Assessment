/* eslint-disable padding-line-between-statements */
// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  CircularProgress,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { deleteRecord } from "../store/dataSlice";
import { useDispatch } from "react-redux";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteRecord = ({ open, setOpen, record }) => {
  // ** Hooks
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const saveInLocalStorage = () => {
    const existLocalStorageData = JSON.parse(localStorage.getItem("data"));

    localStorage.setItem(
      "data",
      JSON.stringify({
        ...(record.type === "income"
          ? {
              summary: {
                ...existLocalStorageData.summary,
                totalIncome:
                  existLocalStorageData.summary.totalIncome - record.value,
                balance: existLocalStorageData.summary.balance - record.value,
              },
            }
          : {
              summary: {
                ...existLocalStorageData.summary,
                expenses: existLocalStorageData.summary.expenses - record.value,
                balance: existLocalStorageData.summary.balance + record.value,
              },
            }),
        records: existLocalStorageData.records.filter(
          (localRec) => localRec.id !== record.id
        ),
      })
    );
  };

  const handleSubmit = (e) => {
    dispatch(deleteRecord(record));
    saveInLocalStorage();
    handleClose();
  };
  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth="sm"
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure to delete <strong>{record?.name}</strong>?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            The item will delete permanently from your database.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleSubmit}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DeleteRecord;
