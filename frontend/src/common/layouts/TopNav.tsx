import Menu from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const TopNav: React.FC = () => {

  return (
    <Box sx={{ flexGrow: 1, p: 0, m: 0. }}>
      <AppBar position="static" elevation={0}>
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Heimscheißer
          </Typography>
          <IconButton
            size="large"
            edge="end"
          >
            <Menu/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopNav;
