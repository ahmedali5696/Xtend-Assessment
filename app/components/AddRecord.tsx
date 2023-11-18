import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { PiVinylRecordBold } from "react-icons/pi";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AppData, RecordData, addNewRecord } from "../store/dataSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/redux";

// Types
type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

const AddRecord = ({ open, setOpen }: Props) => {
  // ** States
  const [recordData, setRecordData] = useState<RecordData>({
    date: dayjs().toDate(),
  });

  // ** Hooks
  const dispatch = useAppDispatch();

  // ** Handlers
  const handleClose = () => {
    setOpen(false);
    setRecordData({
      date: dayjs().toDate(),
    });
  };

  const  saveInLocalStorage = () => {
    const existLocalStorageData = JSON.parse(
      localStorage.getItem("data")!
    ) as AppData;

    localStorage.setItem(
      "data",
      JSON.stringify({
        ...(recordData.type === 'income' ? {summary: {
          ...existLocalStorageData.summary,
          totalIncome: existLocalStorageData.summary.totalIncome + recordData.value!,
          balance: existLocalStorageData.summary.balance + recordData.value!
        }} 
        : {summary: {
          ...existLocalStorageData.summary,
          expenses: existLocalStorageData.summary.expenses + recordData.value!,
          balance: existLocalStorageData.summary.balance - recordData.value!
        }} ),
        records: [
          { id: existLocalStorageData.records.length + 1, ...recordData },
          ...existLocalStorageData.records,
        ],
      })
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recordData.name) return toast.error("The name field is required");
    if (!recordData.type) return toast.error("The type is required");
    if (!recordData.value) return toast.error("The value is required");

    dispatch(addNewRecord(recordData));
    toast.success("The Record Submitted");
    saveInLocalStorage()
    handleClose();
  };

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth="sm"
        onClose={handleClose}
        onBackdropClick={handleClose}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              pb: 2,
              px: { xs: 3, sm: 5 },
              pt: { xs: 3, sm: 4 },
              position: "relative",
            }}
          >
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <RxCross2 />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: "center" }}>
              <Typography variant="h6">Add Record</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  label="Record Name *"
                  onChange={(e) =>
                    setRecordData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Record Value (EGP) *"
                  onKeyPress={(e) => {
                    if (e.which < 48 || e.which > 57) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    setRecordData((prev) => ({
                      ...prev,
                      value: Number(e.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    defaultValue={dayjs()}
                    onChange={(date) =>
                      setRecordData((prev) => ({
                        ...prev,
                        date: date?.toDate()!,
                      }))
                    }
                    sx={{
                      "& .MuiInputBase-input": {
                        py: 1,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Type *</FormLabel>
                  <RadioGroup
                    sx={{ display: "flex", flexDirection: "row" }}
                    onChange={(e) =>
                      setRecordData((prev) => ({
                        ...prev,
                        type: e.target.value as "income" | "expense",
                      }))
                    }
                  >
                    <FormControlLabel
                      value="income"
                      control={<Radio />}
                      label="Income"
                    />
                    <FormControlLabel
                      value="expense"
                      control={<Radio />}
                      label="Expense"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ pb: { xs: 3, sm: 4 }, justifyContent: "center" }}
          >
            <Button variant="contained" sx={{ mr: 2 }} type="submit">
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Discard
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Card>
  );
};

export default AddRecord;
