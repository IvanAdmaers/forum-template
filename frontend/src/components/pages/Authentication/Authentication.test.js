import React from 'react';
import { render, screen } from '@testing-library/react';

import testingSetUp from 'helpers/testing/testingSetUp';

import Authentication from 'components/pages/Authentication';

describe('Authentication page', () => {
  it('should shows a heading with authorization text', () => {
    render(testingSetUp(<Authentication isLogIn />));

    const heading = screen.getByRole('heading', {
      level: 1,
      name: /login/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('should shows a heading with registration text', () => {
    render(testingSetUp(<Authentication />));

    const heading = screen.getByRole('heading', {
      level: 1,
      name: /sign up/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
