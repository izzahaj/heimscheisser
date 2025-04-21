import Container from "@mui/material/Container";
import { Map } from "../components/Map";
import { useState } from "react";
import { Add, Close, LocationSearching, MyLocation, TuneOutlined } from "@mui/icons-material";
import Fab from "@mui/material/Fab";
import { NAVBAR_HEIGHT_REM } from "../../../common/constants/Dimensions";
import Stack from "@mui/material/Stack";
import { AddToiletDrawer } from "../components/AddToilet";

const ToiletMapPage = () => {
  const [map, setMap] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [addToiletPosition, setAddToiletPosition] = useState(null);
  const [isAddingToilet, setIsAddingToilet] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleFindMyLocation = () => {
    if (map) {
      setIsLocating(true); 
      map.locate().on("locationfound", (e) => {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        setIsLocating(false);
      }).on("locationerror", () => {
        // TODO: handle error in location (e.g. show a snackbar)
        setIsLocating(false);
      });
    }
  };

  const handleCancelToilet = () => {
    setDrawerOpen(false);
    setAddToiletPosition(null)
    setIsAddingToilet(false);
  }

  const handleAddToilet = () => {
    setIsAddingToilet(true)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ bgcolor: 'pink', height: '100%' }}>
      <Map
        position={position}
        map={setMap}
        addToiletPosition={addToiletPosition}
        setAddToiletPosition={setAddToiletPosition}
        isAddingToilet={isAddingToilet}
      />
      <Stack spacing={1} sx={{ bottom: `${NAVBAR_HEIGHT_REM + 1.5}rem`, right: "0.5rem", position: 'absolute' }}>
        <Fab size="medium" color="primary" onClick={handleFindMyLocation} disabled={isLocating}>
          {position ? <MyLocation /> : <LocationSearching />}
        </Fab>
        <Fab size="medium" color="secondary">
          <TuneOutlined />
        </Fab>
        {isAddingToilet &&
          <Fab size="medium" color="default" onClick={handleCancelToilet}>
            <Close />
          </Fab>
        }
        {!isAddingToilet &&
          <Fab size="medium" color="success" onClick={handleAddToilet}>
            <Add />
          </Fab>
        }
      </Stack>
      {isAddingToilet &&
        <AddToiletDrawer
          open={drawerOpen}
          setOpen={setDrawerOpen}
          setAddToiletPosition={setAddToiletPosition}
          setIsAddingToilet={setIsAddingToilet}
        />
      }
    </Container>
  );
};

export default ToiletMapPage;
