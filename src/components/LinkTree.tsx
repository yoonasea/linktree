import React from "react";
import { Container, Typography, Stack } from "@mui/material";
import LinkItem from "./LinkItem";

interface Link {
  label: string;
  url: string;
}

const LinkTree: React.FC = () => {
  const links: Link[] = [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/phuazaiwei/" },
    { label: "GitHub", url: "https://github.com/yoonasea" },
    { label: "Bus Timing App", url: "https://transport-887be.web.app/" },
    { label: "Drawing App", url: "https://transport-887be.web.app/paint" },
    { label: "Weather App >wip<", url: "" },
    { label: "Task Management App >wip<", url: "" },
    { label: "3D Printing", url: "https://www.instagram.com/phuazaiwei/" },
    { label: "Chrome Extension", url: "https://chromewebstore.google.com/detail/new-tab-league-of-legends/nokfioegpdopldlbbbhglnjjbgddbcjk" },
  ];

  return (
    <Container sx={{ textAlign: "center", marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Linktree
      </Typography>
      <Stack spacing={2}>
        {links.map((link, index) => (
          <LinkItem key={index} label={link.label} url={link.url} />
        ))}
      </Stack>
    </Container>
  );
};

export default LinkTree;
