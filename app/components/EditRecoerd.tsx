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
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { PiVinylRecordBold } from "react-icons/pi";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  AppData,
  RecordData,
  addNewRecord,
  editRecord,
} from "../store/dataSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/redux";

// Types
type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  record: RecordData;
};

interface ExistData {
  summary?: {
    totalIncome?: number;
    expenses?: number;
    balance?: number;
  };
  records?: RecordData[];
}

const EditRecord = ({ open, setOpen, record }: Props) => {
  // ** Store
  const { records, summary } = useAppSelector((store) => store.appData);

  // ** States
  const [recordData, setRecordData] = useState<RecordData>({});
  const [existData, setExistData] = useState<ExistData>({});

  // ** Hooks
  const dispatch = useAppDispatch();

  // ** Handlers
  const handleClose = () => {
    setOpen(false);
    setRecordData({});
  };

  const saveInLocalStorage = () => {
    setExistData((prev) => {
      const state = {...prev}
      const existRecord = state.records!.find((rec: any) => rec.id === record.id)!

      if (recordData.value) {
        const diff = Math.abs(recordData.value - existRecord.value!);
        
        if (existRecord.type === "income") {
          if (recordData.value > existRecord.value!) {
            state.summary!.totalIncome! += diff;
            state.summary!.balance! += diff;
          } else {
            state.summary!.totalIncome! -= diff;
            state.summary!.balance! -= diff;
          }
        } else {
          if (recordData.value > existRecord.value!) {
            state.summary!.expenses! += diff;
            state.summary!.balance! -= diff;
          } else {
            state.summary!.expenses! -= diff;
            state.summary!.balance! += diff;
          }
        }
      }

      for (const key in recordData) {
        // @ts-ignore
        if (key) existRecord[key] = recordData[key];
      }

      localStorage.setItem('data', JSON.stringify(state))

      return state
    })
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!Object.keys(recordData).length)
      return toast.error("No Data changed for update");

    dispatch(editRecord({ id: record.id, ...recordData }));
    toast.success("The Record updated");
    saveInLocalStorage();
    handleClose();
  };

  useEffect(() => {
    setExistData(JSON.parse(localStorage.getItem("data")!))
  }, [open])
  
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
                  defaultValue={record?.name}
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
                  defaultValue={record?.value}
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
                    defaultValue={dayjs(record?.date)}
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

export default EditRecord;
