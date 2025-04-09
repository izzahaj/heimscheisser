import Container from "@mui/material/Container";
import { Map } from "../components/Map";

const ToiletMapPage = ({ map, position }) => {

  return (
    <Container disableGutters maxWidth={false} sx={{ bgcolor: 'pink', height: '100%' }}>
      <Map position={position} map={map} />
    </Container>
  );
};

export default ToiletMapPage;
