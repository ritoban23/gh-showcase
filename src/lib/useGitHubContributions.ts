import { useState, useEffect } from 'react';

// TypeScript interface for contribution data
interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 for color intensity
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface UseGitHubContributionsReturn {
  weeks: ContributionWeek[];
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching GitHub contributions
export const useGitHubContributions = (username: string): UseGitHubContributionsReturn => {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setWeeks([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch actual contribution data using GitHub Contributions API v4
    const fetchContributions = async () => {
      try {
        // Fetch from the public API that scrapes GitHub profiles
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch contributions');
        }

        const data = await response.json();
        
        // data.contributions is an array of { date, count, level }
        const contributions = data.contributions || [];
        
        // Group contributions into weeks (Sunday to Saturday)
        const contributionWeeks: ContributionWeek[] = [];
        let currentWeek: ContributionDay[] = [];
        
        contributions.forEach((contribution: any, index: number) => {
          const date = new Date(contribution.date);
          const dayOfWeek = date.getDay();
          
          currentWeek.push({
            date: contribution.date,
            count: contribution.count,
            level: contribution.level,
          });
          
          // End of week (Saturday) or last contribution
          if (dayOfWeek === 6 || index === contributions.length - 1) {
            contributionWeeks.push({ days: [...currentWeek] });
            currentWeek = [];
          }
        });

        // Only show last 52 weeks for better display
        const last52Weeks = contributionWeeks.slice(-52);
        setWeeks(last52Weeks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError('Failed to load contributions');
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  return { weeks, loading, error };
};
