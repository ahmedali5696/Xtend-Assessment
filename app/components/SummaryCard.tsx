import { Box, Card, CardContent, Typography } from "@mui/material";
import { type } from "os";
import React from "react";

// Types
type Props = {
  title: string;
  count: number;
  icon: React.ReactNode;
};

const SummaryCard = ({ title, count, icon }: Props) => {
  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{count} EGP</Typography>
        </Box>
        {icon}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
