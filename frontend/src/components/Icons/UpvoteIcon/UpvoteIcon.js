import PropTypes from 'prop-types';

const upvoteIconAttributes = {
  dInactive:
    'm8 .200001c.17143 0 .33468.073332.44854.201491l7.19996 8.103998c.157.17662.1956.42887.0988.64437-.0968.21551-.3111.35414-.5473.35414h-3.4v5.496c0 .3314-.2686.6-.6.6h-6.4c-.33137 0-.6-.2686-.6-.6v-5.496h-3.4c-.236249 0-.450507-.13863-.547314-.35414-.096807-.2155-.058141-.46775.09877-.64437l7.200004-8.103998c.11386-.128159.27711-.201491.44854-.201491zm-5.86433 8.103999h2.66433c.33137 0 .6.26863.6.6v5.496h5.2v-5.496c0-.33137.2686-.6.6-.6h2.6643l-5.8643-6.60063',
  dActive:
    'M8.44857 0.401443C8.3347 0.273284 8.17146 0.199951 8.00002 0.199951C7.82859 0.199951 7.66534 0.273284 7.55148 0.401443L0.351479 8.50544C0.194568 8.68206 0.155902 8.93431 0.252709 9.14981C0.349516 9.36532 0.563774 9.50395 0.800023 9.50395H4.20002V15C4.20002 15.3313 4.46865 15.6 4.80002 15.6H11.2C11.5314 15.6 11.8 15.3313 11.8 15V9.50395H15.2C15.4363 9.50395 15.6505 9.36532 15.7473 9.14981C15.8441 8.93431 15.8055 8.68206 15.6486 8.50544L8.44857 0.401443Z',
  fillActive: '#ff4500',
  fillInactive: '#e0e0e0',
};

const UpvoteIcon = ({ active, ...params }) => {
  return (
    <svg
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      fill={
        active
          ? upvoteIconAttributes.fillActive
          : upvoteIconAttributes.fillInactive
      }
      {...params}
    >
      <path
        clipRule="evenodd"
        d={
          !active
            ? upvoteIconAttributes.dInactive
            : upvoteIconAttributes.dActive
        }
        fillRule="evenodd"
      ></path>
    </svg>
  );
};

UpvoteIcon.defaultProps = {
  active: false,
};

UpvoteIcon.propTypes = {
  active: PropTypes.bool,
};

export default UpvoteIcon;
