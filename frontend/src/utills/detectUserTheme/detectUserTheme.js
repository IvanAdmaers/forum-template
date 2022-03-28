/**
 * This function detects prefer user theme
 *
 * @function detectUserTheme
 * @returns {string} Light or dark theme
 */
const detectUserTheme = () => {
  const themes = {
    light: 'light',
    dark: 'dark',
  };

  if (typeof window === 'undefined') return themes.light;

  try {
    const userPrefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const userPrefersLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;

    if (userPrefersDark) return themes.dark;
    if (userPrefersLight) return themes.light;

    return themes.light;
  } catch (e) {
    console.log(e);
    return themes.light;
  }
};

export default detectUserTheme;
