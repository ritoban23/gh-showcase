import { useState, useEffect } from 'react';

// TypeScript interface for GitHub user data
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

// Return type for the hook
interface UseGitHubProfileReturn {
  user: GitHubUser | null;
  loading: boolean;
  error: string | null;
}

// Custom hook for fetching GitHub profile data
export const useGitHubProfile = (username: string): UseGitHubProfileReturn => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if username is empty
    if (!username) {
      setUser(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Start fetching
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: GitHubUser) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch user data');
        setUser(null);
        setLoading(false);
      });
  }, [username]);

  return { user, loading, error };
};
