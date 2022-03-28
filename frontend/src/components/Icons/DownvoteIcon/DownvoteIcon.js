import PropTypes from 'prop-types';

const downvoteIconAttributes = {
  dInactive:
    'M4.2 0.799997C4.2 0.468626 4.46863 0.199997 4.8 0.199997H11.2C11.5314 0.199997 11.8 0.468626 11.8 0.799997V6.304H15.2C15.4363 6.304 15.6506 6.44269 15.7474 6.65827C15.8441 6.87385 15.8054 7.12615 15.6483 7.30273L8.44835 15.3987C8.33449 15.5268 8.17133 15.6 8 15.6C7.82867 15.6 7.66551 15.5268 7.55165 15.3987L0.351652 7.30273C0.194618 7.12615 0.15585 6.87385 0.252626 6.65827C0.349402 6.44269 0.563698 6.304 0.8 6.304H4.2V0.799997ZM5.4 1.4V6.904C5.4 7.23537 5.13137 7.504 4.8 7.504H2.13654L8 14.0971L13.8635 7.504H11.2C10.8686 7.504 10.6 7.23537 10.6 6.904V1.4H5.4Z',
  dActive:
    'M4.80002 0.199951C4.46865 0.199951 4.20002 0.46858 4.20002 0.799951V6.30395H0.800023C0.563721 6.30395 0.349425 6.44265 0.252649 6.65822C0.155872 6.8738 0.194641 7.1261 0.351675 7.30268L7.55168 15.3987C7.66553 15.5267 7.82869 15.6 8.00002 15.6C8.17135 15.6 8.33451 15.5267 8.44837 15.3987L15.6484 7.30268C15.8054 7.1261 15.8442 6.8738 15.7474 6.65822C15.6506 6.44265 15.4363 6.30395 15.2 6.30395H11.8V0.799951C11.8 0.46858 11.5314 0.199951 11.2 0.199951H4.80002Z',
  fillActive: '#7193ff',
  fillInactive: '#e0e0e0',
};

const DownvoteIcon = ({ active, ...params }) => {
  return (
    <svg
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      fill={
        active
          ? downvoteIconAttributes.fillActive
          : downvoteIconAttributes.fillInactive
      }
      {...params}
    >
      <path
        clipRule="evenodd"
        d={
          !active
            ? downvoteIconAttributes.dInactive
            : downvoteIconAttributes.dActive
        }
        fillRule="evenodd"
      ></path>
    </svg>
  );
};

DownvoteIcon.defaultProps = {
  active: false,
};

DownvoteIcon.propTypes = {
  active: PropTypes.bool,
};

export default DownvoteIcon;
