import { motion } from 'framer-motion';
import { useGitHubContributions } from './useGitHubContributions';
import styles from './ContributionGraph.module.css';

interface ContributionGraphProps {
  username: string;
}

const ContributionGraph = ({ username }: ContributionGraphProps) => {
  const { weeks, loading, error } = useGitHubContributions(username);

  if (loading) {
    return <div className={styles.loading}>Loading contributions...</div>;
  }

  if (error) {
    return null; // Silently fail
  }

  if (weeks.length === 0) {
    return null;
  }

  // Calculate total contributions (only for displayed weeks)
  const totalContributions = weeks.reduce(
    (total, week) => total + week.days.reduce((sum, day) => sum + day.count, 0),
    0
  );

  // Calculate the time period being shown
  const getTimePeriod = () => {
    if (weeks.length === 0) return '';
    const firstDay = weeks[0]?.days[0]?.date;
    const lastDay = weeks[weeks.length - 1]?.days[weeks[weeks.length - 1].days.length - 1]?.date;
    if (firstDay && lastDay) {
      const start = new Date(firstDay);
      const end = new Date(lastDay);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 60) {
        return `in the last ${diffDays} days`;
      } else if (diffDays < 365) {
        return `in the last ${Math.floor(diffDays / 30)} months`;
      } else {
        return 'in the last year';
      }
    }
    return 'in the last year';
  };

  // Get month labels for the top
  const getMonthLabel = (weekIndex: number) => {
    if (weekIndex === 0 || weekIndex % 4 === 0) {
      const firstDay = weeks[weekIndex]?.days[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        return date.toLocaleDateString('en-US', { month: 'short' });
      }
    }
    return '';
  };

  const getLevelColor = (level: number): string => {
    const colors = {
      0: '#ebedf0',
      1: '#9be9a8',
      2: '#40c463',
      3: '#30a14e',
      4: '#216e39',
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <span className={styles.contributionCount}>
          {totalContributions} contributions {getTimePeriod()}
        </span>
      </div>

      <div className={styles.graphWrapper}>
        <div className={styles.monthLabels}>
          {weeks.map((_, index) => (
            <div key={index} className={styles.monthLabel}>
              {getMonthLabel(index)}
            </div>
          ))}
        </div>

        <div className={styles.graph}>
          <div className={styles.dayLabels}>
            <span className={styles.dayLabel}>Mon</span>
            <span className={styles.dayLabel}>Wed</span>
            <span className={styles.dayLabel}>Fri</span>
          </div>

          <div className={styles.weeks}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={styles.day}
                    style={{ backgroundColor: getLevelColor(day.level) }}
                    title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={styles.legendSquare}
              style={{ backgroundColor: getLevelColor(level) }}
            />
          ))}
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContributionGraph;
