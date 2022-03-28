import React from 'react';
import { render, screen } from '@testing-library/react';

import ChristmasLights from 'components/designs/Winter/ChristmasLights';

describe('component ChristmasLights', () => {
  it('should render a correct length of Christmas lights', () => {
    const length = 21;

    render(<ChristmasLights length={length} />);

    const lengthOfChristmasLights = screen.getAllByTestId('lightrope-item');

    expect(lengthOfChristmasLights).toHaveLength(length);
  });
});
