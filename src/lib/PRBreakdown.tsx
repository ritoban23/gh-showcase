import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitHubPRs } from './useGitHubPRs';
import styles from './PRBreakdown.module.css';

interface PRBreakdownProps {
  username: string;
}

const PRBreakdown = ({ username }: PRBreakdownProps) => {
  const { totalPRs, breakdown, categorizedPRs, loading, error } = useGitHubPRs(username);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (loading) {
    return <div className={styles.container}>Loading PR data...</div>;
  }

  if (error) {
    return <div className={styles.container}>Could not load PR data</div>;
  }

  if (totalPRs === 0) {
    return <div className={styles.container}>No PRs found</div>;
  }

  // Calculate percentages
  const total = Object.values(breakdown).reduce((sum, count) => sum + count, 0);
  
  const percentages = {
    frontend: total > 0 ? (breakdown.frontend / total) * 100 : 0,
    docs: total > 0 ? (breakdown.docs / total) * 100 : 0,
    fix: total > 0 ? (breakdown.fix / total) * 100 : 0,
    feature: total > 0 ? (breakdown.feature / total) * 100 : 0,
    other: total > 0 ? (breakdown.other / total) * 100 : 0,
  };

  // Color mapping
  const colors = {
    frontend: '#3b82f6', // Blue
    docs: '#eab308',     // Yellow
    fix: '#ef4444',      // Red
    feature: '#22c55e',  // Green
    other: '#6b7280',    // Gray
  };

  const categoryLabels = {
    frontend: 'Frontend',
    docs: 'Docs',
    fix: 'Fix',
    feature: 'Feature',
    other: 'Other',
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.sectionTitle}>Open Source Contributions</h2>
      <div className={styles.progressBar}>
        {breakdown.frontend > 0 && (
          <div
            className={styles.segment}
            style={{ width: `${percentages.frontend}%`, backgroundColor: colors.frontend }}
          />
        )}
        {breakdown.docs > 0 && (
          <div
            className={styles.segment}
            style={{ width: `${percentages.docs}%`, backgroundColor: colors.docs }}
          />
        )}
        {breakdown.fix > 0 && (
          <div
            className={styles.segment}
            style={{ width: `${percentages.fix}%`, backgroundColor: colors.fix }}
          />
        )}
        {breakdown.feature > 0 && (
          <div
            className={styles.segment}
            style={{ width: `${percentages.feature}%`, backgroundColor: colors.feature }}
          />
        )}
        {breakdown.other > 0 && (
          <div
            className={styles.segment}
            style={{ width: `${percentages.other}%`, backgroundColor: colors.other }}
          />
        )}
      </div>

      <div className={styles.accordionContainer}>
        {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((category) => {
          if (breakdown[category] === 0) return null;

          const isExpanded = expandedCategory === category;
          const prs = categorizedPRs[category];

          return (
            <motion.div 
              key={category} 
              className={styles.accordionItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <button
                className={styles.accordionHeader}
                onClick={() => toggleCategory(category)}
              >
                <div className={styles.headerContent}>
                  <span className={styles.dot} style={{ backgroundColor: colors[category] }}></span>
                  <span className={styles.categoryTitle}>
                    {categoryLabels[category]} ({breakdown[category]})
                  </span>
                </div>
                <span className={styles.accordionIcon}>
                  {isExpanded ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    className={styles.accordionContent}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {prs.map((pr, index) => {
                      // Extract repo name from repository_url
                      const repoName = pr.repository_url.split('/').slice(-2).join('/');
                      
                      return (
                        <motion.a
                          key={index}
                          href={pr.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.prCard}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className={styles.prContent}>
                            <div>
                              <div className={styles.prTitle}>{pr.title}</div>
                              <div className={styles.prMeta}>
                                Contributed to {repoName.split('/')[1]} • {new Date(pr.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                            <svg className={styles.arrowIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M7 17L17 7" />
                              <path d="M7 7h10v10" />
                            </svg>
                          </div>
                        </motion.a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PRBreakdown;
