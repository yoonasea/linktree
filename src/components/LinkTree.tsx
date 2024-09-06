import React from "react";
import { Container, Typography, Stack } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloudIcon from "@mui/icons-material/Cloud";
import BrushIcon from "@mui/icons-material/Brush";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import InstagramIcon from "@mui/icons-material/Instagram";
import ExtensionIcon from "@mui/icons-material/Extension";
import LinkItem from "./LinkItem";

interface Link {
  label: string;
  url: string;
  icon: React.ReactNode; // Add icon property
}

const LinkTree: React.FC = () => {
  const links: Link[] = [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/phuazaiwei/", icon: <LinkedInIcon /> },
    { label: "GitHub", url: "https://github.com/yoonasea", icon: <GitHubIcon /> },
    { label: "Weather App", url: "https://transport-887be.firebaseapp.com/weather", icon: <CloudIcon /> },
    { label: "Drawing App", url: "https://transport-887be.firebaseapp.com/paint", icon: <BrushIcon /> },
    { label: "Bus Timing App", url: "https://transport-887be.firebaseapp.com/", icon: <DirectionsBusIcon /> },
    { label: "3D Printing", url: "https://www.instagram.com/phuazaiwei/", icon: <InstagramIcon /> },
    { label: "Chrome Extension", url: "https://chromewebstore.google.com/detail/new-tab-league-of-legends/nokfioegpdopldlbbbhglnjjbgddbcjk", icon: <ExtensionIcon /> },
  ];

  return (
    <Container sx={{ textAlign: "center", marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Playground
      </Typography>
      <Stack spacing={2}>
        {links.map((link, index) => (
          <LinkItem key={index} label={link.label} url={link.url} icon={link.icon} />
        ))}
      </Stack>
    </Container>
  );
};

export default LinkTree;
