import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb Component', () => {
  it('renders all breadcrumb links and text', () => {
    render(<Breadcrumb />);
    expect(screen.getByText('Hub')).toBeInTheDocument();
    expect(screen.getByText('Master Data')).toBeInTheDocument();
    expect(screen.getByText('Airport')).toBeInTheDocument();
  });

  it('contains links with correct hrefs', () => {
    render(<Breadcrumb />);
    expect(screen.getByText('Hub').closest('a')).toHaveAttribute('href', '#');
    expect(screen.getByText('Master Data').closest('a')).toHaveAttribute('href', '#');
  });

  it('last breadcrumb is plain text (Typography)', () => {
    render(<Breadcrumb />);
    expect(screen.getByText('Airport').tagName).toBe('P');
  });
});
