import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen Component', () => {
  test('renders loading screen when isLoading is true', () => {
    render(<LoadingScreen isLoading={true} />);
    
    // Check if the CircularProgress is rendered (including hidden elements)
    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
  });

  test('does not render loading screen when isLoading is false', () => {
    render(<LoadingScreen isLoading={false} />);
    
    // The backdrop should be hidden when isLoading is false
    const backdrop = screen.getByRole('progressbar', { hidden: true }).closest('.MuiBackdrop-root');
    expect(backdrop).toHaveStyle({ visibility: 'hidden' });
  });

  test('has proper accessibility attributes', () => {
    render(<LoadingScreen isLoading={true} />);
    
    // Check if the progress bar has proper ARIA attributes (including hidden elements)
    const progressBar = screen.getByRole('progressbar', { hidden: true });
    expect(progressBar).toBeInTheDocument();
  });

  test('uses primary color for CircularProgress', () => {
    render(<LoadingScreen isLoading={true} />);
    
    const progressBar = screen.getByRole('progressbar', { hidden: true });
    expect(progressBar).toHaveClass('MuiCircularProgress-colorPrimary');
  });
}); 