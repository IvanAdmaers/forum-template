import PropTypes from 'prop-types';
import { Box, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Policy = ({ markdown }) => (
  <Paper>
    <Box p={1}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </Box>
  </Paper>
);

Policy.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Policy;
