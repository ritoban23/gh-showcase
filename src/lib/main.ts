// Import fonts
import './styles/fonts.css';

// This exports your main component so others can use it
export { default as Showcase } from './Showcase';

// Optional: Export the hooks if developers want to build their own UI
export { useGitHubProfile } from './useGitHubProfile';
export { useGitHubPRs } from './useGitHubPRs';
