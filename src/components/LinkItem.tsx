import React from "react";
import { Button } from "@mui/material";

interface LinkItemProps {
  label: string;
  url: string;
  icon: React.ReactNode;
  className?: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ label, url, icon, className }) => {
  return (
    <Button
      variant="contained"
      href={url}
      target="_blank"
      startIcon={icon}
      sx={{ width: "100%", padding: 2 }}
      className={className}
    >
      {label}
    </Button>
  );
};

export default LinkItem;
