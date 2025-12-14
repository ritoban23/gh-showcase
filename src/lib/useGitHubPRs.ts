import { useState, useEffect } from 'react';

// TypeScript interface for GitHub PR data
export interface GitHubPR {
  title: string;
  body: string | null;
  html_url: string;
  number: number;
  repository_url: string;
  created_at: string;
}

interface SearchResponse {
  total_count: number;
  items: GitHubPR[];
}

// Category breakdown
export interface PRBreakdown {
  docs: number;
  frontend: number;
  fix: number;
  feature: number;
  other: number;
}

// Categorized PRs
export interface CategorizedPRs {
  docs: GitHubPR[];
  frontend: GitHubPR[];
  fix: GitHubPR[];
  feature: GitHubPR[];
  other: GitHubPR[];
}

// Return type for the hook
interface UseGitHubPRsReturn {
  totalPRs: number;
  breakdown: PRBreakdown;
  categorizedPRs: CategorizedPRs;
  loading: boolean;
  error: string | null;
}

// Function to classify PR based on title and body
const classifyPR = (title: string, body: string | null): keyof PRBreakdown => {
  const titleLower = title.toLowerCase();
  const text = `${title} ${body || ''}`.toLowerCase();

  // Priority 1: Check title prefix patterns (most reliable)
  if (titleLower.match(/^(fix|bugfix|hotfix)[\s:(]/i)) {
    return 'fix';
  }
  
  if (titleLower.match(/^(feat|feature|add)[\s:(]/i)) {
    return 'feature';
  }
  
  if (titleLower.match(/^(docs|doc|documentation)[\s:(]/i)) {
    return 'docs';
  }

  if (titleLower.match(/^(style|ui|refactor\(ui|feat\(ui)[\s:(]/i)) {
    return 'frontend';
  }

  // Priority 2: Check for strong fix indicators in title
  if (titleLower.match(/\b(fix|bug|bugfix|hotfix|patch|resolve|correct)\b/)) {
    // But exclude if it's clearly docs
    if (!titleLower.match(/\b(readme|documentation|guide|comment)\b/)) {
      return 'fix';
    }
  }

  // Priority 3: Check for feature indicators in title
  if (titleLower.match(/\b(feat|feature|add|new|implement|enhance|improvement)\b/)) {
    return 'feature';
  }

  // Priority 4: Check for docs indicators (must be clear docs-only)
  if (text.match(/\b(docs?|documentation|readme|guide|typo|comment|docstring)\b/)) {
    // Only classify as docs if it's clearly documentation work
    if (titleLower.match(/\b(docs?|documentation|readme|guide|typo|comment|docstring)\b/) ||
        titleLower.match(/^(update|add|fix).*\.(md|rst|txt)$/)) {
      return 'docs';
    }
  }

  // Priority 5: Check for frontend/UI keywords
  if (text.match(/\b(ui|css|style|styles|component|react|vue|angular|mobile|frontend|design|tailwind|scss|sass)\b/)) {
    return 'frontend';
  }

  // Priority 6: Check for refactor/chore (often "other")
  if (titleLower.match(/^(chore|refactor|test|ci|build|perf)[\s:(]/i)) {
    return 'other';
  }

  // Default to other
  return 'other';
};
// Custom hook for fetching and classifying GitHub PRs
export const useGitHubPRs = (username: string): UseGitHubPRsReturn => {
  const [totalPRs, setTotalPRs] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<PRBreakdown>({
    docs: 0,
    frontend: 0,
    fix: 0,
    feature: 0,
    other: 0,
  });
  const [categorizedPRs, setCategorizedPRs] = useState<CategorizedPRs>({
    docs: [],
    frontend: [],
    fix: [],
    feature: [],
    other: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if username is empty
    if (!username) {
      setTotalPRs(0);
      setBreakdown({ docs: 0, frontend: 0, fix: 0, feature: 0, other: 0 });
      setCategorizedPRs({ docs: [], frontend: [], fix: [], feature: [], other: [] });
      setError(null);
      setLoading(false);
      return;
    }

    // Start fetching
    setLoading(true);
    setError(null);

    const url = `https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged&per_page=100`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: SearchResponse) => {
        const newBreakdown: PRBreakdown = {
          docs: 0,
          frontend: 0,
          fix: 0,
          feature: 0,
          other: 0,
        };

        const newCategorizedPRs: CategorizedPRs = {
          docs: [],
          frontend: [],
          fix: [],
          feature: [],
          other: [],
        };

        // Classify each PR
        data.items.forEach((pr) => {
          const category = classifyPR(pr.title, pr.body);
          newBreakdown[category]++;
          newCategorizedPRs[category].push(pr);
        });

        setTotalPRs(data.total_count);
        setBreakdown(newBreakdown);
        setCategorizedPRs(newCategorizedPRs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch PR data');
        setTotalPRs(0);
        setBreakdown({ docs: 0, frontend: 0, fix: 0, feature: 0, other: 0 });
        setCategorizedPRs({ docs: [], frontend: [], fix: [], feature: [], other: [] });
        setLoading(false);
      });
  }, [username]);

  return { totalPRs, breakdown, categorizedPRs, loading, error };
};
