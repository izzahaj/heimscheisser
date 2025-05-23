import AddBoxOutlined from "@mui/icons-material/AddBoxOutlined";
import Search from "@mui/icons-material/Search";
import TuneOutlined from "@mui/icons-material/TuneOutlined";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { useState } from "react";
import { NAVBAR_HEIGHT_REM } from "../../../../common/constants/Dimensions";

const BottomNav = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  return (
    <Box sx={{ height: `${NAVBAR_HEIGHT_REM}rem`, position: 'fixed', bottom: 0, right: 0, left: 0, p: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{ height: '100%' }}
      >
        <BottomNavigationAction label="Add Toilet" icon={<AddBoxOutlined />} />
        <BottomNavigationAction label="Search" icon={<Search />}/>
        <BottomNavigationAction label="Filter" icon={<TuneOutlined />}/>
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
