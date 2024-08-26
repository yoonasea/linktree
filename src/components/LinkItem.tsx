import React from "react";
import { Button } from "@mui/material";

interface LinkItemProps {
  label: string;
  url: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ label, url }) => {
  return (
    <Button
      variant="contained"
      href={url}
      target="_blank"
      sx={{ width: "100%", padding: 2 }}
    >
      {label}
    </Button>
  );
};

export default LinkItem;
