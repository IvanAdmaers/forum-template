import { testingWithRedux } from 'helpers/testing/testingWithRedux';
import { testingWithNotistack } from 'helpers/testing/testingWithNotistack';

const testingSetUp = (children) =>
  testingWithRedux(testingWithNotistack(children));

export default testingSetUp;
