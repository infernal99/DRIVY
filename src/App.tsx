import { Route, Routes } from 'react-router-dom';
import { SyncNoticeToast } from './components/auth/SyncNoticeToast';
import { FriendNotificationWatcher } from './components/friends/FriendNotificationWatcher';
import { IncomingRequestToast } from './components/friends/IncomingRequestToast';
import { PendingFriendInviteHandler } from './components/friends/PendingFriendInviteHandler';
import { PremiumStatusSync } from './components/premium/PremiumStatusSync';
import { InstallBanner } from './components/pwa/InstallBanner';
import { RequireAuth } from './components/auth/RequireAuth';
import { RedirectIfAuthed } from './components/auth/RedirectIfAuthed';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { CategoryPage } from './pages/CategoryPage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { RandomPracticePage } from './pages/RandomPracticePage';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { MistakeReviewPage } from './pages/MistakeReviewPage';
import { ExamPage } from './pages/ExamPage';
import { ExamHistoryPage } from './pages/ExamHistoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { FriendsPage } from './pages/FriendsPage';
import { FriendProfilePage } from './pages/FriendProfilePage';
import { BattlePage } from './pages/BattlePage';
import { SourcesPage } from './pages/SourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminContentPage } from './pages/AdminContentPage';
import { InviteFriendPage } from './pages/InviteFriendPage';

function App() {
  return (
    <>
      <SyncNoticeToast />
      <FriendNotificationWatcher />
      <IncomingRequestToast />
      <PendingFriendInviteHandler />
      <PremiumStatusSync />
      <InstallBanner />
      <Routes>
        {/* Dev-only content curation tool (content spec §15) — never shipped in production builds. */}
        {import.meta.env.DEV && <Route path="/admin/content" element={<AdminContentPage />} />}

        {/* Public, unauthenticated-only: bounce a signed-in user back to "/". */}
        <Route element={<RedirectIfAuthed />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Public regardless of auth state — see RedirectIfAuthed's comment for why. */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/invite/:code" element={<InviteFriendPage />} />

        {/* Everything else requires a signed-in account — no guest mode. */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:categoryId" element={<CategoryPage />} />
          <Route path="/learn/:categoryId/lesson/:subcategoryId" element={<LessonPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/practice/random" element={<RandomPracticePage />} />
          <Route path="/practice/daily" element={<DailyChallengePage />} />
          <Route path="/practice/mistakes" element={<MistakeReviewPage />} />
          <Route path="/practice/exam/:mode" element={<ExamPage />} />
          <Route path="/exams" element={<ExamHistoryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/friends/:userId" element={<FriendProfilePage />} />
          <Route path="/battles/:battleId" element={<BattlePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
