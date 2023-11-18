import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// ** Types
export type RecordData = {
  id?: number;
  name?: string;
  value?: number;
  type?: "income" | "expense";
  date?: Date;
};

export interface AppData {
  summary: {
    totalIncome: number;
    expenses: number;
    balance: number;
  };
  records: RecordData[];
}

export const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    summary: {
      totalIncome: 0,
      expenses: 0,
      balance: 0,
    },
    records: [],
  } as AppData,
  reducers: {
    setAppData: (state, action: PayloadAction<AppData>) => {
      const data = action.payload;

      state.summary = data.summary;
      state.records = data.records;
    },

    addNewRecord: (state, action: PayloadAction<RecordData>) => {
      const data = action.payload;

      state.records = [
        { id: state.records.length + 1, ...data },
        ...state.records,
      ];

      if (data.type === "income") {
        state.summary.totalIncome += data.value!;
        state.summary.balance += data.value!;
      } else {
        state.summary.expenses += data.value!;
        state.summary.balance -= data.value!;
      }
    },

    editRecord: (state, action: PayloadAction<RecordData>) => {
      const newData = action.payload;
      const existRecord = state.records.find((rec) => rec.id === newData.id)!;

      if (newData.value) {
        const diff = Math.abs(newData.value - existRecord.value!);
        
        if (existRecord.type === "income") {
          if (newData.value > existRecord.value!) {
            state.summary.totalIncome += diff;
            state.summary.balance += diff;
          } else {
            state.summary.totalIncome -= diff;
            state.summary.balance -= diff;
          }
        } else {
          if (newData.value > existRecord.value!) {
            state.summary.expenses += diff;
            state.summary.balance -= diff;
          } else {
            state.summary.expenses -= diff;
            state.summary.balance += diff;
          }
        }
      }

      for (const key in newData) {
        // @ts-ignore
        if (key) existRecord[key] = newData[key];
      }
    },

    deleteRecord: (state, action: PayloadAction<RecordData>) => {
      const data = action.payload;

      state.records = state.records.filter((record) => record.id !== data.id);

      if (data.type === "income") {
        state.summary.totalIncome -= data.value!;
        state.summary.balance -= data.value!;
      } else {
        state.summary.expenses -= data.value!;
        state.summary.balance += data.value!;
      }
    },
  },
});

export const { setAppData, addNewRecord, editRecord, deleteRecord } =
  appDataSlice.actions;

export default appDataSlice.reducer;
