"use client";

import { Box, CircularProgress, Grid } from "@mui/material";
import SummaryCard from "./components/SummaryCard";
import {
  FcMoneyTransfer,
  FcSalesPerformance,
  FcCalculator,
} from "react-icons/fc";
import TableRecords from "./components/TableRecords";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/redux";
import { setAppData } from "./store/dataSlice";
import { Suspense } from "react";

const Loading = () => {
  return (
    <Box sx={{width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgress size={50} />
    </Box>
  )
}

export default function Home() {
  // ** Store
  const { summary } = useAppSelector((store) => store.appData);
  const defaultStoreData = useAppSelector((store) => store.appData);
  
  // ** Vars
  const defaultStorageData = {
    summary: {
      totalIncome: 0,
      expenses: 0,
      balance: 0,
    },
    records: [],
  };

  // ** Hooks
  const dispatch = useAppDispatch();

  // ** Effects
  useEffect(() => {
    const storageData = localStorage.getItem("data");

    if (storageData) {
      dispatch(setAppData(JSON.parse(storageData)));
    } else {
      localStorage.setItem("data", JSON.stringify(defaultStoreData));
    }
  }, []);

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <SummaryCard
              title="Total Income"
              count={summary.totalIncome}
              icon={<FcMoneyTransfer fontSize="1.5rem" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              title="Expenses"
              count={summary.expenses}
              icon={<FcCalculator fontSize="1.5rem" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              title="Balance"
              count={summary.balance}
              icon={<FcSalesPerformance fontSize="1.5rem" />}
            />
          </Grid>
          <Grid item xs={12}>
            <TableRecords />
            {/* <TableRecords /> */}
          </Grid>
        </Grid>
      </Suspense>
    </main>
  );
}
