import React from "react";

import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
} from "@mui/material";

const BaseCard = (props) => {
  return (
    <Card>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        {props.title && <Typography variant="h4">{props.title}</Typography>}
        {props.button && <Button variant="outlined" onClick={props.handleAdd} color={props.buttonType}>{props.button}</Button>}
      </Box>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default BaseCard;
