export const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const pageview = (url = '') => {
  window.gtag('config', id, {
    page_path: url,
  });
};
