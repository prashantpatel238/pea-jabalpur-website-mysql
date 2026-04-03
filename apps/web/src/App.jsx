
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

import HomePage from '@/pages/HomePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ImportantMembersPage from '@/pages/ImportantMembersPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import RegistrationPage from '@/pages/RegistrationPage.jsx';
import NoticesPublicPage from '@/pages/NoticesPublicPage.jsx';

import TechnicalStandardsPage from '@/pages/TechnicalStandardsPage.jsx';
import IndustryGuidelinesPage from '@/pages/IndustryGuidelinesPage.jsx';
import BestPracticesPage from '@/pages/BestPracticesPage.jsx';
import ResearchPapersPage from '@/pages/ResearchPapersPage.jsx';
import CaseStudiesPage from '@/pages/CaseStudiesPage.jsx';
import WebinarsPage from '@/pages/WebinarsPage.jsx';

import MemberDashboard from '@/pages/MemberDashboard.jsx';
import MemberDirectory from '@/pages/MemberDirectory.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import EditProfilePage from '@/pages/EditProfilePage.jsx';
import NoticeBoard from '@/pages/NoticeBoard.jsx';

import AdminDashboard from '@/pages/AdminDashboard.jsx';
import MemberManagement from '@/pages/MemberManagement.jsx';
import PageContentManagerPage from '@/pages/PageContentManagerPage.jsx';
import ImportantMembersManager from '@/pages/ImportantMembersManager.jsx';
import LeadershipManagementPage from '@/pages/LeadershipManagementPage.jsx';
import CustomFieldsManager from '@/pages/CustomFieldsManager.jsx';
import DirectoryConfigManager from '@/pages/DirectoryConfigManager.jsx';
import AdminEventDashboard from '@/pages/AdminEventDashboard.jsx';
import ApprovalDashboard from '@/pages/ApprovalDashboard.jsx';
import NoticesAdminPage from '@/pages/NoticesAdminPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/important-members" element={<ImportantMembersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/notices" element={<NoticesPublicPage />} />
          
          <Route path="/resources/technical-standards" element={<TechnicalStandardsPage />} />
          <Route path="/resources/industry-guidelines" element={<IndustryGuidelinesPage />} />
          <Route path="/resources/best-practices" element={<BestPracticesPage />} />
          <Route path="/resources/research-papers" element={<ResearchPapersPage />} />
          <Route path="/resources/case-studies" element={<CaseStudiesPage />} />
          <Route path="/resources/webinars" element={<WebinarsPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireApproved>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/directory"
            element={
              <ProtectedRoute requireApproved>
                <MemberDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/noticeboard"
            element={
              <ProtectedRoute requireApproved>
                <NoticeBoard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireApproved>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute requireApproved>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:memberId"
            element={
              <ProtectedRoute requireApproved>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute requireAdmin>
                <MemberManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute requireAdmin>
                <PageContentManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/page-content"
            element={
              <ProtectedRoute requireAdmin>
                <PageContentManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <ProtectedRoute requireAdmin>
                <NoticesAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leadership"
            element={
              <ProtectedRoute requireAdmin>
                <ImportantMembersManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/important-members"
            element={
              <ProtectedRoute requireAdmin>
                <LeadershipManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/custom-fields"
            element={
              <ProtectedRoute requireAdmin>
                <CustomFieldsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/directory-config"
            element={
              <ProtectedRoute requireAdmin>
                <DirectoryConfigManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requireAdmin>
                <AdminEventDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute requireAdmin>
                <ApprovalDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-foreground">404 - Page Not Found</h1>
                <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-primary font-medium hover:underline">Back to Home</a>
              </div>
            </div>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
