// import { HYDRATE } from 'next-redux-wrapper';
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

import { detectUserTheme } from 'utills';

const getUserTheme = () => {
  return (
    (typeof window !== 'undefined' && localStorage.getItem('theme')) ||
    detectUserTheme()
  );
};

const DESIGN_SETTINGS_LOCAL_STORAGE_KEY = '__design-settings';

const saveNewDesignSettings = (data) =>
  localStorage.setItem(DESIGN_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(data));

const defaultWinterDesignParams = {
  color: '#e5e1e1',
  snowflakeCount: 150,
  speed: [0.5, 3],
  wind: [-0.5, 2.0],
  radius: [0.5, 3.0],
  shouldShowChristmasLights: true,
};

const defaultDesign = {
  type: 'regular', // 'regular', 'winter'
  winter: defaultWinterDesignParams,
};

const getDesignSettings = () => {
  if (typeof window === 'undefined') {
    return defaultDesign;
  }

  const savedDesign = localStorage.getItem(DESIGN_SETTINGS_LOCAL_STORAGE_KEY);

  if (!savedDesign) {
    return defaultDesign;
  }

  const savedDesignSettings = JSON.parse(savedDesign);

  return savedDesignSettings;
};

const initialState = {
  theme: getUserTheme(),
  design: getDesignSettings(),
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    // case HYDRATE:
    // // theme: getUserTheme()
    // return { ...state, ...action.payload.settings };

    case CHANGE_COLOR_THEME: {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', theme);

      return { ...state, theme };
    }

    case CHANGE_DESIGN_THEME: {
      const newDesign = { ...state.design, type: action.payload };
      saveNewDesignSettings(newDesign);

      return { ...state, design: newDesign };
    }

    case CHANGE_WINTER_DESIGN_SNOWFLARE_COUNT: {
      const newDesign = {
        ...state.design,
        winter: { ...state.design.winter, snowflakeCount: action.payload },
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    case CHANGE_WINTER_DESIGN_SNOWFLARE_SPEED: {
      const newDesign = {
        ...state.design,
        winter: { ...state.design.winter, speed: action.payload },
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    case CHANGE_WINTER_DESIGN_SNOWFLARE_WIND: {
      const newDesign = {
        ...state.design,
        winter: { ...state.design.winter, wind: action.payload },
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    case CHANGE_WINTER_DESIGN_SNOWFLARE_RADIUS: {
      const newDesign = {
        ...state.design,
        winter: { ...state.design.winter, radius: action.payload },
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    case CHANGE_WINTER_DESIGN_SNOWFLARE_COLOR: {
      const newDesign = {
        ...state.design,
        winter: { ...state.design.winter, color: action.payload },
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    case RESET_WINTER_DESIGN_CHANGES: {
      const newDesign = {
        ...state.design,
        winter: defaultWinterDesignParams,
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    case CHANGE_WINTER_DESIGN_SHOW_CHRISTMAS_LIGHTS: {
      const newDesign = {
        ...state.design,
        winter: {
          ...state.design.winter,
          shouldShowChristmasLights: action.payload,
        },
      };
      saveNewDesignSettings(newDesign);

      return {
        ...state,
        design: newDesign,
      };
    }

    default:
      return state;
  }
};

export default settingsReducer;
