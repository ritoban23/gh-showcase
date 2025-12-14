import { motion } from 'framer-motion';
import { useGitHubProfile } from './useGitHubProfile';
import PRBreakdown from './PRBreakdown';
import ContributionGraph from './ContributionGraph';
import { ThemeToggle } from './ThemeToggle';
import styles from './Showcase.module.css';

interface ShowcaseProps {
  username: string;
  theme?: string;
}

const Showcase = ({ username, theme = 'light' }: ShowcaseProps) => {
  const { user, loading, error } = useGitHubProfile(username);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div 
      className={styles.card} 
      data-theme={theme}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.themeToggleWrapper}>
        <ThemeToggle />
      </div>
      <motion.img 
        src={user.avatar_url} 
        alt={user.name} 
        className={styles.avatar}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.h3 
        className={styles.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {user.name}
      </motion.h3>
      <motion.p 
        className={styles.username}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        @{user.login}
      </motion.p>
      <motion.p 
        className={styles.bio}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {user.bio}
      </motion.p>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>{user.public_repos}</div>
          <div className={styles.statLabel}>Repos</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>{user.followers}</div>
          <div className={styles.statLabel}>Followers</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>{user.following}</div>
          <div className={styles.statLabel}>Following</div>
        </div>
      </div>

      <ContributionGraph username={username} />

      <PRBreakdown username={username} />

      <motion.a 
        href={user.html_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.button}
        whileHover={{ scale: 1.02, backgroundColor: '#40464e' }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        View Profile
      </motion.a>
    </motion.div>
  );
};

export default Showcase;
