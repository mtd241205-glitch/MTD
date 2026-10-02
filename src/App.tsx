import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleQuickSwitcher } from './components/common/RoleQuickSwitcher';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationPage } from './components/common/NotificationPage';

// Public screens
import { HomeScreen } from './components/public/HomeScreen';
import { AboutScreen } from './components/public/AboutScreen';
import { ContactScreen } from './components/public/ContactScreen';
import { DocumentsScreen } from './components/public/DocumentsScreen';
import { DocumentDetailScreen } from './components/public/DocumentDetailScreen';
import { ProceduresScreen } from './components/public/ProceduresScreen';
import { ProcedureDetailScreen } from './components/public/ProcedureDetailScreen';
import { TermsScreen } from './components/public/TermsScreen';
import { PrivacyScreen } from './components/public/PrivacyScreen';

// Auth screens
import { RegisterScreen } from './components/auth/RegisterScreen';
import { RegisterResultScreen } from './components/auth/RegisterResultScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { CommuneAdminResetRequestScreen } from './components/auth/CommuneAdminResetRequestScreen';
import { ForceChangePasswordScreen } from './components/auth/ForceChangePasswordScreen';
import { ProfileScreen } from './components/auth/ProfileScreen';

// AI screens
import { ChatbotScreen } from './components/ai/ChatbotScreen';
import { SharedChatScreen } from './components/ai/SharedChatScreen';
import { AiDocumentsScreen } from './components/ai/AiDocumentsScreen';

// Commune Admin screens
import { UserManagementScreen } from './components/communeAdmin/UserManagementScreen';
import { UserDetailScreen } from './components/communeAdmin/UserDetailScreen';
import { DataManagementScreen } from './components/communeAdmin/DataManagementScreen';
import { AddDocumentScreen } from './components/communeAdmin/AddDocumentScreen';
import { CommuneDocDetailScreen } from './components/communeAdmin/CommuneDocDetailScreen';
import { EditDocumentScreen } from './components/communeAdmin/EditDocumentScreen';
import { CommuneDashboardScreen } from './components/communeAdmin/CommuneDashboardScreen';
import { FeedbackManagementScreen } from './components/communeAdmin/FeedbackManagementScreen';
import { ServiceInfoScreen } from './components/communeAdmin/ServiceInfoScreen';

// System Admin screens
import { SysAdminLayout } from './components/systemAdmin/SysAdminLayout';
import { SysAdminLoginScreen } from './components/systemAdmin/SysAdminLoginScreen';
import { SysAdminDashboardScreen } from './components/systemAdmin/SysAdminDashboardScreen';
import { CommuneListScreen } from './components/systemAdmin/CommuneListScreen';
import { AddCommuneScreen } from './components/systemAdmin/AddCommuneScreen';
import { CommuneSysDetailScreen } from './components/systemAdmin/CommuneSysDetailScreen';
import { SupportRequestsScreen } from './components/systemAdmin/SupportRequestsScreen';
import { SharedDataScreen } from './components/systemAdmin/SharedDataScreen';
import { SystemLogsScreen } from './components/systemAdmin/SystemLogsScreen';

// System & Error screens
import { NotFoundScreen } from './components/system/NotFoundScreen';
import { ForbiddenScreen } from './components/system/ForbiddenScreen';
import { MaintenanceScreen } from './components/system/MaintenanceScreen';
import { SessionExpiredModal } from './components/system/SessionExpiredModal';
import { ConnectionErrorBanner } from './components/system/ConnectionErrorBanner';
import { CommuneSuspendedScreen } from './components/system/CommuneSuspendedScreen';

const MainAppContent: React.FC = () => {
  const {
    currentScreen,
    isMaintenance,
    isSessionExpired,
  } = useApp();

  // Full Screen Special States (Maintenance Screen 56)
  if (isMaintenance || currentScreen === 56) {
    return (
      <>
        <RoleQuickSwitcher />
        <MaintenanceScreen />
      </>
    );
  }

  // Commune Suspended Screen 59
  if (currentScreen === 59) {
    return (
      <>
        <RoleQuickSwitcher />
        <CommuneSuspendedScreen />
      </>
    );
  }

  // SysAdmin Login Screen 46
  if (currentScreen === 46) {
    return (
      <>
        <RoleQuickSwitcher />
        <SysAdminLoginScreen />
      </>
    );
  }

  // SysAdmin Area (Screens 47 through 53)
  if (currentScreen >= 47 && currentScreen <= 53) {
    return (
      <>
        <RoleQuickSwitcher />
        <SysAdminLayout>
          {currentScreen === 47 && <SysAdminDashboardScreen />}
          {currentScreen === 48 && <CommuneListScreen />}
          {currentScreen === 49 && <AddCommuneScreen />}
          {currentScreen === 50 && <CommuneSysDetailScreen />}
          {currentScreen === 51 && <SupportRequestsScreen />}
          {currentScreen === 52 && <SharedDataScreen />}
          {currentScreen === 53 && <SystemLogsScreen />}
        </SysAdminLayout>
        {isSessionExpired && <SessionExpiredModal />}
      </>
    );
  }

  // Force Change Password on First Login (Screen 16) - without full standard navbar per spec
  if (currentScreen === 16) {
    return (
      <>
        <RoleQuickSwitcher />
        <ForceChangePasswordScreen />
      </>
    );
  }

  // Commune Site (Screens 1 to 45, 54, 55)
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 antialiased">
      {/* Test Toolbar with Role Switcher & Screen status */}
      <RoleQuickSwitcher />

      {/* Screen 58: Connection error banner */}
      <ConnectionErrorBanner />

      {/* Screen 0.1: Top Navigation Bar */}
      <Navbar />

      {/* Main Screen Renderer */}
      <main className="flex-1">
        {currentScreen === 1 && <HomeScreen />}
        {currentScreen === 2 && <AboutScreen />}
        {currentScreen === 3 && <ContactScreen />}
        {currentScreen === 4 && <DocumentsScreen />}
        {currentScreen === 5 && <DocumentDetailScreen />}
        {currentScreen === 6 && <ProceduresScreen />}
        {currentScreen === 7 && <ProcedureDetailScreen />}
        {currentScreen === 8 && <TermsScreen />}
        {currentScreen === 9 && <PrivacyScreen />}
        {currentScreen === 10 && <RegisterScreen />}
        {currentScreen === 12 && <RegisterResultScreen />}
        {currentScreen === 13 && <LoginScreen />}
        {currentScreen === 14 && <ForgotPasswordScreen />}
        {currentScreen === 15 && <CommuneAdminResetRequestScreen />}
        {currentScreen === 17 && <ProfileScreen />}
        {currentScreen === 21 && <NotificationPage />}
        {currentScreen === 22 && <ChatbotScreen />}
        {currentScreen === 24 && <SharedChatScreen />}
        {currentScreen === 26 && <AiDocumentsScreen />}
        {currentScreen === 30 && <UserManagementScreen />}
        {currentScreen === 32 && <UserDetailScreen />}
        {currentScreen === 34 && <DataManagementScreen />}
        {currentScreen === 35 && <AddDocumentScreen />}
        {currentScreen === 36 && <CommuneDocDetailScreen />}
        {currentScreen === 37 && <EditDocumentScreen />}
        {currentScreen === 41 && <CommuneDashboardScreen />}
        {currentScreen === 44 && <FeedbackManagementScreen />}
        {currentScreen === 45 && <ServiceInfoScreen />}
        {currentScreen === 54 && <NotFoundScreen />}
        {currentScreen === 55 && <ForbiddenScreen />}
      </main>

      {/* Screen 0.3: Footer */}
      <Footer />

      {/* Screen 57: Session expired modal */}
      {isSessionExpired && <SessionExpiredModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
