import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { CategoryPage } from './pages/CategoryPage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { RandomPracticePage } from './pages/RandomPracticePage';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { MistakeReviewPage } from './pages/MistakeReviewPage';
import { ExamPage } from './pages/ExamPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { SourcesPage } from './pages/SourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminContentPage } from './pages/AdminContentPage';

function App() {
  return (
    <Routes>
      {/* Dev-only content curation tool (content spec §15) — never shipped in production builds. */}
      {import.meta.env.DEV && <Route path="/admin/content" element={<AdminContentPage />} />}
      <Route path="/" element={<HomePage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/learn/:categoryId" element={<CategoryPage />} />
      <Route path="/learn/:categoryId/lesson/:subcategoryId" element={<LessonPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/practice/random" element={<RandomPracticePage />} />
      <Route path="/practice/daily" element={<DailyChallengePage />} />
      <Route path="/practice/mistakes" element={<MistakeReviewPage />} />
      <Route path="/practice/exam/:mode" element={<ExamPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/sources" element={<SourcesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
