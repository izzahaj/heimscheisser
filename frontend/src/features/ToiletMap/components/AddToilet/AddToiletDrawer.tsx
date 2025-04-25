import { Global } from "@emotion/react";
import { Close } from "@mui/icons-material";
import { CssBaseline, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AddToiletForm from "./AddToiletForm";

const DRAWER_BLEEDING = 50;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.background.default,
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800],
  }),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900],
  }),
}));

const AddToiletDrawer = ({ open, setOpen, setIsAddingToilet, addToiletPosition, setAddToiletPosition }) => {
  const handleExit = () => {
    setOpen(false);
    setAddToiletPosition(null);
    setIsAddingToilet(false);
  }

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(85% - ${DRAWER_BLEEDING}px)`,
            overflow: 'visible',
          },
        }}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        swipeAreaWidth={DRAWER_BLEEDING}
        keepMounted
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -DRAWER_BLEEDING,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              mx: 2
            }}
          >
            <Typography variant="h6" component="div" sx={{ py: 2, fontWeight: 600 }}>Add Toilet</Typography>
            {open &&
              <IconButton
                size="small"
                onClick={handleExit}
                aria-label="close drawer"
              >
                <Close fontSize="medium" />
              </IconButton>
            }
          </Stack>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          <AddToiletForm handleExit={handleExit} addToiletPosition={addToiletPosition} />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

export default AddToiletDrawer;
