import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from './Container';
import { useMediaQuery } from '@mui/material';

jest.mock('@mui/material', () => {
  const actualMUI = jest.requireActual('@mui/material');
  return {
    ...actualMUI,
    useMediaQuery: jest.fn(),
  };
});

describe('Container Component', () => {
  const mockUseMediaQuery = useMediaQuery as jest.Mock;

  test('renders children content', () => {
    mockUseMediaQuery.mockReturnValue(false);

    render(<Container>Test Content</Container>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies padding (desktop view)', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { container } = render(<Container>Desktop</Container>);

    expect(container.firstChild).toHaveStyle('padding: 32px');
    expect(container.firstChild).toMatchSnapshot(); // ✅ Snapshot
  });

  test('removes padding on mobile view', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { container } = render(<Container>Mobile</Container>);

    expect(container.firstChild).toHaveStyle('padding: 0px');
    expect(container.firstChild).toMatchSnapshot(); // ✅ Snapshot
  });
});
