import {
  Typography,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeDesignTheme,
  changeWinterDesignSnowflareCount,
  changeWinterDesignSnowflareSpeed,
  changeWinterDesignSnowflareWind,
  changeWinterDesignSnowflareRadius,
  changeWinterDesignSnowflareColor,
  resetWinterDesignChanges,
  changeWinterDesignShowChristmasLights,
} from 'actions/settingsActions';

// We have to do it because of the bug https://github.com/mui-org/material-ui/issues/28466
const getUnfrozenArray = (array = []) => [...array];

const Design = () => {
  const design = useSelector(({ settings }) => settings.design);

  const dispatch = useDispatch();

  const { type: designType } = design;
  const {
    snowflakeCount,
    speed,
    wind,
    radius,
    color,
    shouldShowChristmasLights,
  } = design.winter;

  const [minSpeed, maxSpeed] = speed;
  const [minWind, maxWind] = wind;
  const [minRadius, maxRadius] = radius;

  const handleChangeDesignTheme = (e) => {
    const type = e.target.value;

    return dispatch(changeDesignTheme(type));
  };

  const handleChangeWinterDesignSnowflareCount = (_, count) =>
    dispatch(changeWinterDesignSnowflareCount(count));

  const handleChangeWinterDesignSnowflareSpeed = (_, speed) =>
    dispatch(changeWinterDesignSnowflareSpeed(speed));

  const handleChangeWinterDesignSnowflareWind = (_, wind) =>
    dispatch(changeWinterDesignSnowflareWind(wind));

  const handleChangeWinterDesignSnowflareRadius = (_, radius) =>
    dispatch(changeWinterDesignSnowflareRadius(radius));

  const handleChangeWinterDesignSnowflareColor = (e) => {
    const color = e.target.value;

    return dispatch(changeWinterDesignSnowflareColor(color));
  };

  const handleResetWinterDesignChanges = () =>
    dispatch(resetWinterDesignChanges());

  const handleChangeWinterDesignShowChristmasLights = (e) => {
    const status = e.target.checked;

    return dispatch(changeWinterDesignShowChristmasLights(status));
  };

  return <>
    <Typography component="h2" variant="h6" align="center" gutterBottom>
      Design
    </Typography>
    <Container maxWidth="xs">
      <Grid container justifyContent="center">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            value={designType}
            label="type"
            onChange={handleChangeDesignTheme}
          >
            <MenuItem value="regular">Usual</MenuItem>
            <MenuItem value="winter">Winter</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <Typography gutterBottom>
            Number of snowflakes - {snowflakeCount}
          </Typography>
          <Slider
            value={snowflakeCount}
            min={1}
            max={750}
            step={1}
            onChange={handleChangeWinterDesignSnowflareCount}
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControl fullWidth>
          <Typography gutterBottom>
            Speed - Min. {minSpeed} Max. {maxSpeed}
          </Typography>
          <Slider
            value={getUnfrozenArray(speed)}
            min={0}
            max={10}
            step={0.5}
            onChange={handleChangeWinterDesignSnowflareSpeed}
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControl fullWidth>
          <Typography gutterBottom>
          Wind - Min. {minWind} Max. {maxWind}
          </Typography>
          <Slider
            value={getUnfrozenArray(wind)}
            min={-1}
            max={10}
            step={0.5}
            onChange={handleChangeWinterDesignSnowflareWind}
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControl fullWidth>
          <Typography gutterBottom>
            Radius - Min. {minRadius} Max. {maxRadius}
          </Typography>
          <Slider
            value={getUnfrozenArray(radius)}
            min={0.5}
            max={5}
            step={0.5}
            onChange={handleChangeWinterDesignSnowflareRadius}
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControl fullWidth>
          <Grid container alignItems="center">
            <Typography gutterBottom>Color</Typography>
            <Box ml={1}>
              <input
                type="color"
                value={color}
                onChange={handleChangeWinterDesignSnowflareColor}
              />
            </Box>
          </Grid>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldShowChristmasLights}
              onChange={handleChangeWinterDesignShowChristmasLights}
            />
          }
          label="Show garland"
        />
        <Box mt={1}>
          <Button variant="outlined" onClick={handleResetWinterDesignChanges}>
            Reset winter design settings
          </Button>
        </Box>
      </Grid>
    </Container>
  </>;
};

export default Design;
