import {
  CHANGE_COLOR_THEME,
  CHANGE_DESIGN_THEME,
  CHANGE_WINTER_DESIGN_SNOWFLARE_COUNT,
  CHANGE_WINTER_DESIGN_SNOWFLARE_SPEED,
  CHANGE_WINTER_DESIGN_SNOWFLARE_WIND,
  CHANGE_WINTER_DESIGN_SNOWFLARE_RADIUS,
  CHANGE_WINTER_DESIGN_SNOWFLARE_COLOR,
  RESET_WINTER_DESIGN_CHANGES,
  CHANGE_WINTER_DESIGN_SHOW_CHRISTMAS_LIGHTS,
} from 'constants/actionTypes';

export const changeColorTheme = () => (dispatch) => {
  return dispatch({ type: CHANGE_COLOR_THEME });
};

export const changeDesignTheme = (theme = '') => ({
  type: CHANGE_DESIGN_THEME,
  payload: theme,
});

export const changeWinterDesignSnowflareCount = (count = 0) => ({
  type: CHANGE_WINTER_DESIGN_SNOWFLARE_COUNT,
  payload: count,
});

export const changeWinterDesignSnowflareSpeed = (speed = []) => ({
  type: CHANGE_WINTER_DESIGN_SNOWFLARE_SPEED,
  payload: speed,
});

export const changeWinterDesignSnowflareWind = (wind = []) => ({
  type: CHANGE_WINTER_DESIGN_SNOWFLARE_WIND,
  payload: wind,
});

export const changeWinterDesignSnowflareRadius = (radius = []) => ({
  type: CHANGE_WINTER_DESIGN_SNOWFLARE_RADIUS,
  payload: radius,
});

export const changeWinterDesignSnowflareColor = (color = '') => ({
  type: CHANGE_WINTER_DESIGN_SNOWFLARE_COLOR,
  payload: color,
});

export const resetWinterDesignChanges = () => ({
  type: RESET_WINTER_DESIGN_CHANGES,
});

export const changeWinterDesignShowChristmasLights = (status = false) => ({
  type: CHANGE_WINTER_DESIGN_SHOW_CHRISTMAS_LIGHTS,
  payload: status,
});
