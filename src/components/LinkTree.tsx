import React from "react";
import { Container, Typography, Stack } from "@mui/material";
import LinkItem from "./LinkItem";

interface Link {
  label: string;
  url: string;
}

const LinkTree: React.FC = () => {
  const links: Link[] = [
    { label: "My Portfolio", url: "https://myportfolio.com" },
    { label: "GitHub", url: "https://github.com/myprofile" },
    { label: "LinkedIn", url: "https://linkedin.com/in/myprofile" },
    { label: "Twitter", url: "https://twitter.com/myprofile" },
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
