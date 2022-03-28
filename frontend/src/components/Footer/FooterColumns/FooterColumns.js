import PropTypes from 'prop-types';
import { Grid, ListItem } from '@mui/material';

import MyLink from 'components/MyLink';

const getColumnItems = (array = []) => {
  const column = array.map(({ link, label }, key) => {
    return (
      <ListItem
        key={`footer-link-${label}-${key}`}
        component={MyLink}
        href={link}
      >
        {label}
      </ListItem>
    );
  });

  return column;
};

const createItemsArray = (list = [], row = 3) => {
  const commonArray = []; // array of arrays

  let breakpoint = 0;

  while (breakpoint < list.length) {
    const arr = list.slice(breakpoint, breakpoint + row);
    breakpoint += row;

    commonArray.push(arr);
  }

  return commonArray;
};

const FooterColumns = ({ footerList, rowItems }) => {
  const row = rowItems || Math.round(footerList.length / 2);

  const list = createItemsArray(footerList, row);

  return (
    <Grid container justifyContent="space-between">
      {list.map((column, key) => {
        return (
          <Grid key={`footer-column-${key}`} item>
            {getColumnItems(column)}
          </Grid>
        );
      })}
    </Grid>
  );
};

FooterColumns.defaultProps = {
  footerList: [],
  rowItems: 3,
};

FooterColumns.propTypes = {
  footerList: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  rowItems: PropTypes.number,
};

export default FooterColumns;
