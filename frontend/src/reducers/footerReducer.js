import { HYDRATE } from 'next-redux-wrapper';

const supportURL = process.env.NEXT_PUBLIC_SUPPORT_URL;

const initialState = {
  items: [
    { link: '/', label: 'Home' },
    { link: '/contacts', label: 'Contacts' },
    { link: '/feedback', label: 'Feedback' },
    { link: supportURL, label: 'Support' },
    { link: '/global-chat', label: 'General chat' },
  ],
};

const footerReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.footer };

    default:
      return state;
  }
};

export default footerReducer;
