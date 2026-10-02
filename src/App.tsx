import React, { useLayoutEffect, useRef, useState } from 'react';
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
import { ToastProvider } from './context/ToastContext';

const PAGE_TRANSITION_DURATION = 380;

interface PageSnapshot {
  pageKey: string;
  children: React.ReactNode;
}

const PageTransition: React.FC<{ pageKey: string; children: React.ReactNode }> = ({
  pageKey,
  children,
}) => {
  const previousPage = useRef<PageSnapshot>({ pageKey, children });
  const [outgoingPage, setOutgoingPage] = useState<PageSnapshot | null>(null);

  useLayoutEffect(() => {
    if (previousPage.current.pageKey !== pageKey) {
      setOutgoingPage(previousPage.current);
      previousPage.current = { pageKey, children };
      return;
    }

    previousPage.current.children = children;
  }, [pageKey, children]);

  React.useEffect(() => {
    if (!outgoingPage) return;
    const timeout = window.setTimeout(() => setOutgoingPage(null), PAGE_TRANSITION_DURATION);
    return () => window.clearTimeout(timeout);
  }, [outgoingPage]);

  return (
    <div className="page-transition">
      {outgoingPage && (
        <div
          key={`outgoing-${outgoingPage.pageKey}`}
          className="page-transition__layer page-transition__outgoing"
          aria-hidden="true"
          inert={true}
        >
          {outgoingPage.children}
        </div>
      )}
      <div key={`current-${pageKey}`} className="page-transition__layer page-transition__current">
        {children}
      </div>
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const {
    currentScreen,
    isMaintenance,
    isSessionExpired,
  } = useApp();

  React.useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const textBlocks = document.querySelectorAll<HTMLElement>(
      '.page-transition__current h1, .page-transition__current h2, .page-transition__current h3, .page-transition__current h4, .page-transition__current p'
    );
    textBlocks.forEach((element, index) => {
      element.style.setProperty('--text-reveal-delay', `${Math.min(index * 45, 240)}ms`);
      element.dataset.textReveal = 'enter';
    });

    const cards = document.querySelectorAll<HTMLElement>(
      '.page-transition__current main div[class*="rounded-3xl"][class*="border"]'
    );
    const pendingCards: HTMLElement[] = [];

    cards.forEach((card) => {
      if (card.getBoundingClientRect().top > window.innerHeight * 0.9) {
        card.dataset.scrollReveal = 'pending';
        pendingCards.push(card);
      }
    });

    if (pendingCards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            card.dataset.scrollReveal = 'visible';
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    pendingCards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [currentScreen, isMaintenance]);

  let screenContent: React.ReactNode;

  // Full Screen Special States (Maintenance Screen 56)
  if (isMaintenance || currentScreen === 56) {
    screenContent = (
      <>
        <RoleQuickSwitcher />
        <MaintenanceScreen />
      </>
    );
  } else if (currentScreen === 59) {
    screenContent = (
      <>
        <RoleQuickSwitcher />
        <CommuneSuspendedScreen />
      </>
    );
  } else if (currentScreen === 46) {
    screenContent = (
      <>
        <RoleQuickSwitcher />
        <SysAdminLoginScreen />
      </>
    );
  } else if (currentScreen >= 47 && currentScreen <= 53) {
    screenContent = (
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
  } else if (currentScreen === 16) {
    screenContent = (
      <>
        <RoleQuickSwitcher />
        <ForceChangePasswordScreen />
      </>
    );
  } else {
    // Commune Site (Screens 1 to 45, 54, 55)
    screenContent = (
      <div className="app-canvas min-h-screen bg-white flex flex-col font-sans text-slate-800 antialiased">
        <RoleQuickSwitcher />
        <ConnectionErrorBanner />
        <Navbar />
        <main className="flex-1 screen-canvas">
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
        <Footer />
        {isSessionExpired && <SessionExpiredModal />}
      </div>
    );
  }

  return (
    <PageTransition pageKey={`${currentScreen}-${isMaintenance}`}>
      {screenContent}
    </PageTransition>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ToastProvider>
  );
}
