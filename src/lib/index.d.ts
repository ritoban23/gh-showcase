declare module 'gh-showcase' {
  import { FC } from 'react';
  
  export interface ShowcaseProps {
    username: string;
    theme?: 'light' | 'dark';
  }
  
  export const Showcase: FC<ShowcaseProps>;
  
  export function useGitHubProfile(username: string): {
    user: any;
    loading: boolean;
    error: string | null;
  };
  
  export function useGitHubPRs(username: string): {
    totalPRs: number;
    breakdown: Record<string, number>;
    categorizedPRs: Record<string, any[]>;
    loading: boolean;
    error: string | null;
  };
}

declare module 'gh-showcase/style.css' {
  const styles: string;
  export default styles;
}
