# gh-showcase

A beautiful React library to showcase GitHub profiles with interactive PR breakdowns.

## 🎯 What We've Built

A complete React component library that displays GitHub user profiles with an interactive visualization of their pull request contributions, categorized by type.

---

## ✨ Features

### 1. **GitHub Profile Card**
- Displays user avatar, name, username, and bio
- Shows key statistics: repositories, followers, and following counts
- Direct link to GitHub profile
- Clean, modern card design with responsive layout

### 2. **PR Breakdown Visualization**
- Fetches and analyzes the last 100 pull requests
- **Interactive Accordion Interface**: Click category headers to expand/collapse
- **Smart Classification**: Automatically categorizes PRs into:
  - 🎨 **Frontend** (UI, CSS, style, component, React, mobile)
  - 📚 **Docs** (documentation, README, typo, guide)
  - 🐛 **Fix** (bug fixes, patches, resolves)
  - ✨ **Feature** (new features, additions, implementations)
  - 🔧 **Other** (everything else)
- **Visual Progress Bar**: Color-coded segmented bar showing PR distribution
- **PR Cards**: Each PR displays as a clickable card with:
  - PR title
  - PR number
  - Creation date
  - Direct link to the GitHub PR

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── useGitHubProfile.ts       # Hook to fetch GitHub user profile data
│   ├── useGitHubPRs.ts           # Hook to fetch and classify PRs
│   ├── Showcase.tsx              # Main profile card component
│   ├── Showcase.module.css       # Styles for profile card
│   ├── PRBreakdown.tsx           # PR accordion component
│   └── PRBreakdown.module.css    # Styles for PR breakdown
├── App.tsx                        # Demo/test component
└── main.tsx                       # Entry point
```

---

## 🛠️ Technical Implementation

### Custom Hooks

#### `useGitHubProfile(username: string)`
- Fetches user profile from GitHub API
- Returns: `{ user, loading, error }`
- Handles empty username and HTTP errors
- TypeScript interface: `GitHubUser`

#### `useGitHubPRs(username: string)`
- Fetches up to 100 PRs using GitHub Search API
- Classifies each PR using keyword matching
- Returns: `{ totalPRs, breakdown, categorizedPRs, loading, error }`
- TypeScript interfaces: `PRBreakdown`, `CategorizedPRs`, `GitHubPR`

### Components

#### `Showcase`
- **Props**: `username` (required), `theme` (optional, defaults to 'light')
- Displays complete GitHub profile card
- Integrates PR breakdown visualization
- Responsive design with CSS modules

#### `PRBreakdown`
- **Props**: `username` (required)
- Interactive accordion interface
- Color-coded categories (Blue, Yellow, Red, Green, Gray)
- Scrollable PR lists with max-height constraint
- Hover effects on PR cards

---

## 🎨 Styling

- **CSS Modules** for scoped, maintainable styles
- **System Fonts** for native look and feel
- **Color Scheme**:
  - Frontend: `#3b82f6` (Blue)
  - Docs: `#eab308` (Yellow)
  - Fix: `#ef4444` (Red)
  - Feature: `#22c55e` (Green)
  - Other: `#6b7280` (Gray)
- Smooth transitions and hover effects
- Responsive and accessible design

---

## 🚀 Usage

```tsx
import Showcase from './lib/Showcase';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Showcase username="ritoban23" />
    </div>
  );
}
```

---

## 📊 How It Works

1. **Profile Fetch**: Component fetches user data from `https://api.github.com/users/{username}`
2. **PR Search**: Simultaneously fetches PRs from `https://api.github.com/search/issues?q=author:{username}+type:pr&per_page=100`
3. **Classification**: Each PR's title and body are analyzed using regex patterns
4. **Visualization**: 
   - Progress bar shows percentage distribution
   - Accordion shows detailed PR list per category
5. **Interaction**: Click any category to expand and view all PRs, click PR cards to open on GitHub

---

## 🔧 Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS Modules** for component-scoped styling
- **GitHub REST API** for data fetching
- **ES6+ Features**: Hooks, async/await, fetch API

---

## 📝 Development Timeline

### Session 1: Foundation
- ✅ Created project structure with `lib/` folder inside `src/`
- ✅ Built `useGitHubProfile` hook with TypeScript interfaces
- ✅ Created test component in `App.tsx`
- ✅ Verified data fetching with JSON display

### Session 2: UI Components
- ✅ Built `Showcase` component with profile card design
- ✅ Created `Showcase.module.css` with modern styling
- ✅ Integrated profile data into visual card layout
- ✅ Added stats display and profile link button

### Session 3: PR Analytics
- ✅ Built `useGitHubPRs` hook with classification logic
- ✅ Created `PRBreakdown` component with progress bar
- ✅ Implemented accordion interface for PR categories
- ✅ Added PR cards with links and metadata
- ✅ Styled with `PRBreakdown.module.css`
- ✅ Integrated PR breakdown into main Showcase card

### Session 4: Bug Fixes & Documentation
- ✅ Fixed syntax errors in `useGitHubPRs.ts`
- ✅ Resolved duplicate state declarations
- ✅ Corrected corrupted code sections
- ✅ Created comprehensive README documentation

---

## 🎯 Current Status

**Fully functional library** with:
- ✅ Complete GitHub profile display
- ✅ Interactive PR categorization and visualization
- ✅ Accordion-style expandable categories
- ✅ Direct links to all PRs
- ✅ Clean, modern UI
- ✅ TypeScript type safety
- ✅ Error handling and loading states

---

## 🚀 Next Steps (Potential Enhancements)

- [ ] Add dark theme support
- [ ] Implement search/filter within PR lists
- [ ] Add more PR metadata (status, labels, comments)
- [ ] Create NPM package for distribution
- [ ] Add unit tests
- [ ] Support for organizations/teams
- [ ] Caching to reduce API calls
- [ ] Customizable color schemes

---

## 📄 License

MIT License - Feel free to use and modify!

---

**Built with ❤️ using React, TypeScript, and the GitHub API**

---

# Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
