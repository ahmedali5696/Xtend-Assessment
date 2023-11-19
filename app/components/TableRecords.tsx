"use client";

import { Box, Button, Card, Chip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridCsvExportMenuItem,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import AddRecord from "./AddRecord";
import { RecordData } from "../store/dataSlice";
import { useAppSelector } from "../store/redux";
import dayjs from "dayjs";
import DeleteRecord from "./DeleteRecord";
import EditRecord from "./EditRecoerd";

// Types
type CustomToolbarProps = {
  handleAddRecord: () => void;
};

function CustomToolbar({ handleAddRecord }: CustomToolbarProps) {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <Box>
        <Button sx={{ mr: 1 }} onClick={handleAddRecord} variant="contained">
          Add Record
        </Button>
        <GridToolbarExportContainer sx={{ marginBottom: 0.3 }}>
          <GridCsvExportMenuItem
            options={{
              fileName: "All Records",
              delimiter: ";",
              utf8WithBom: true,
            }}
          />
        </GridToolbarExportContainer>
      </Box>
      <Box sx={{ marginLeft: "auto" }}>
        <GridToolbarQuickFilter variant="outlined" size="small" />
      </Box>
    </GridToolbarContainer>
  );
}

const TableRecords = () => {
  // ** Store
  const { records } = useAppSelector((store) => store.appData);

  // ** States
  const [openAddRecord, setOpenAddRecord] = useState(false);
  const [openEditRecord, setOpenEditRecord] = useState(false);
  const [openDeleteRecord, setOpenDeleteRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordData>();

  // ** Handlers
  const handleAddRecord = () => {
    setOpenAddRecord(true);
  };

  const handleEditRecord = (row: RecordData) => {
    setSelectedRecord(row);
    setOpenEditRecord(true);
  };

  const handleDeleteRecord = (row: RecordData) => {
    setSelectedRecord(row);
    setOpenDeleteRecord(true);
  };

  // ** Table Column
  const columns: GridColDef<RecordData>[] = [
    {
      flex: 0.1,
      minWidth: 70,
      sortable: false,
      filterable: false,
      field: "actions",
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<FaEdit />}
          label="Edit"
          showInMenu
          onClick={() => handleEditRecord(row)}
        />,
        <GridActionsCellItem
          icon={<IoTrashBinSharp />}
          label="Delete"
          showInMenu
          onClick={() => handleDeleteRecord(row)}
        />,
      ],
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: "id",
      headerName: "#",
    },
    {
      flex: 0.15,
      minWidth: 250,
      field: "name",
      headerName: "Record Name",
    },
    {
      flex: 0.15,
      minWidth: 250,
      field: "value",
      headerName: "Record Value",
      valueGetter: ({ row }) => `${row.value} EGP`,
    },
    {
      flex: 0.15,
      minWidth: 250,
      field: "type",
      headerName: "Type",
      renderCell: ({ row }) => (
        <Chip
          size="small"
          label={row.type}
          color={row.type === "income" ? "success" : "error"}
        />
      ),
    },
    {
      flex: 0.15,
      minWidth: 250,
      field: "date",
      headerName: "Date",
      valueGetter: ({ row }) => dayjs(row.date).format("MMM DD, YYYY"),
    },
  ];

  return (
    <Box>
      <Card variant="outlined">
        <DataGrid
          hideFooter
          rows={records}
          columns={columns}
          sx={{
            height: "70vh",
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              borderRadius: 0,
              background: "#e1e1e1",
            },
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              handleAddRecord,
            },
          }}
        />
      </Card>

      <AddRecord open={openAddRecord} setOpen={setOpenAddRecord} />
      <EditRecord open={openEditRecord} setOpen={setOpenEditRecord} record={selectedRecord!} />
      <DeleteRecord open={openDeleteRecord} setOpen={setOpenDeleteRecord} record={selectedRecord} />
    </Box>
  );
};

export default TableRecords;
