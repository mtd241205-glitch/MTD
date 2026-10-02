import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  Commune,
  DocumentItem,
  PersonalDoc,
  TagItem,
  CitizenFeedback,
  SupportRequest,
  AuditLog,
  AppNotification,
  LoginHistoryItem,
  ChatSession,
  ChatMessage,
  DataScope,
} from '../types';
import {
  INITIAL_COMMUNES,
  INITIAL_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_PERSONAL_DOCS,
  INITIAL_TAGS,
  INITIAL_FEEDBACKS,
  INITIAL_SUPPORT_REQUESTS,
  INITIAL_COMMUNE_AUDIT_LOGS,
  INITIAL_SYSTEM_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LOGIN_HISTORY,
} from '../data/mockData';

interface AppContextType {
  // Navigation
  currentScreen: number;
  screenParam: string;
  navigateTo: (screenNumber: number, param?: string) => void;
  goBack: () => void;
  historyStack: { screen: number; param: string }[];

  // User & Commune
  currentUser: User | null;
  currentRole: UserRole;
  currentCommune: Commune | null;
  users: User[];
  communes: Commune[];
  switchRole: (role: UserRole, specificUserId?: string, targetCommuneId?: string) => void;
  logout: () => void;
  loginAs: (emailOrPhone: string, password?: string) => { success: boolean; message?: string; targetScreen?: number };

  // Data & Documents
  documents: DocumentItem[];
  personalDocs: PersonalDoc[];
  tags: TagItem[];
  getVisibleDocuments: () => DocumentItem[];
  addDocument: (doc: Partial<DocumentItem>, notifyUsers?: boolean) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  changeDocScope: (id: string, newScope: DataScope) => void;
  reprocessDoc: (id: string) => void;

  // Personal Docs (AI Tài liệu)
  addPersonalDoc: (doc: Omit<PersonalDoc, 'id' | 'anonCode'>) => void;
  deletePersonalDoc: (id: string) => void;
  updatePersonalDocTags: (id: string, tags: string[]) => void;
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;

  // Commune Admin Management
  approveOfficer: (userId: string) => void;
  rejectOfficer: (userId: string, reason: string) => void;
  lockUnlockUser: (userId: string) => void;
  resetUserPassword: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  deleteCurrentAccount: (password: string) => boolean;

  // Commune Service & Technical Support
  toggleSupportSession: (communeId: string, duration: '24h' | '3d' | '7d', active: boolean) => void;
  feedbacks: CitizenFeedback[];
  submitFeedback: (content: string, senderContact: string, senderName?: string) => void;
  replyFeedback: (id: string, reply: string) => void;
  updateFeedbackStatus: (id: string, status: 'new' | 'processing' | 'resolved') => void;

  // System Admin (Dev team)
  supportRequests: SupportRequest[];
  communeAuditLogs: AuditLog[];
  systemAuditLogs: AuditLog[];
  loginHistory: LoginHistoryItem[];
  createCommune: (communeData: Partial<Commune>, adminData: Partial<User>) => void;
  updateCommune: (communeId: string, updates: Partial<Commune>) => void;
  renewCommune: (communeId: string, newExpiryDate: string) => void;
  lockUnlockCommune: (communeId: string) => void;
  resetCommuneAdminPassword: (communeId: string) => string;
  transferCommuneAdmin: (communeId: string, newAdminData: Partial<User>) => void;
  submitSupportRequest: (req: Partial<SupportRequest>) => void;
  resolveSupportRequest: (id: string, replyNotes?: string) => void;
  addSystemSharedDoc: (doc: Partial<DocumentItem>, notifyAll?: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  getUnreadNotificationCount: () => number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Chatbot AI
  chatSessions: ChatSession[];
  activeChatSessionId: string | null;
  setActiveChatSessionId: (id: string | null) => void;
  createNewChatSession: (initialPrompt?: string, attachedDocId?: string) => string;
  sendChatMessage: (content: string, usePersonalDocsOnly?: boolean) => Promise<void>;
  pinChatSession: (sessionId: string) => void;
  deleteChatSession: (sessionId: string) => void;
  renameChatSession: (sessionId: string, newTitle: string) => void;
  reactToMessage: (messageId: string, reaction: 'like' | 'dislike', reason?: string, feedback?: string) => void;
  shareChatSession: (sessionId: string) => string;

  // System Simulation States (for previewing screens 56, 57, 58)
  isMaintenance: boolean;
  setIsMaintenance: (v: boolean) => void;
  isSessionExpired: boolean;
  setIsSessionExpired: (v: boolean) => void;
  isConnectionError: boolean;
  setIsConnectionError: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [screenParam, setScreenParam] = useState<string>('');
  const [historyStack, setHistoryStack] = useState<{ screen: number; param: string }[]>([{ screen: 1, param: '' }]);

  // Data states
  const [communes, setCommunes] = useState<Commune[]>(INITIAL_COMMUNES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[1]); // default: Quản lý xã Hòa Lạc
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [personalDocs, setPersonalDocs] = useState<PersonalDoc[]>(INITIAL_PERSONAL_DOCS);
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [feedbacks, setFeedbacks] = useState<CitizenFeedback[]>(INITIAL_FEEDBACKS);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(INITIAL_SUPPORT_REQUESTS);
  const [communeAuditLogs, setCommuneAuditLogs] = useState<AuditLog[]>(INITIAL_COMMUNE_AUDIT_LOGS);
  const [systemAuditLogs, setSystemAuditLogs] = useState<AuditLog[]>(INITIAL_SYSTEM_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>(INITIAL_LOGIN_HISTORY);

  // System simulation states
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [isConnectionError, setIsConnectionError] = useState<boolean>(false);

  // Chat states
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'session-demo-1',
      title: 'Hỏi về thủ tục đăng ký khai sinh cho trẻ mới sinh',
      communeId: 'commune-hl',
      userId: 'user-hl-citizen',
      createdAt: '2026-09-28 10:15',
      updatedAt: '2026-09-28 10:20',
      isPinned: true,
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Xin chào, tôi muốn hỏi thủ tục đăng ký khai sinh cho con mới sinh thì cần những giấy tờ gì và nộp ở đâu?',
          timestamp: '10:15',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: `Chào bạn! Căn cứ theo quy định của pháp luật và thủ tục hành chính liên thông tại UBND cấp xã:

### 1. Thành phần hồ sơ cần chuẩn bị:
- **Tờ khai đăng ký khai sinh** (theo mẫu).
- **Giấy chứng sinh** do cơ sở y tế (Bệnh viện, Trạm y tế) nơi trẻ sinh ra cấp. (Nếu không có giấy chứng sinh thì nộp văn bản của người làm chứng hoặc giấy cam đoan).
- **Giấy chứng nhận kết hôn** của cha mẹ (nếu có đăng ký kết hôn).
- **Căn cước công dân gắn chip / VNeID** của người đi đăng ký khai sinh để đối chiếu.

### 2. Nơi nộp hồ sơ & Thời hạn:
- **Nơi thực hiện:** Nộp tại **Bộ phận Một cửa - UBND cấp xã** nơi cha hoặc mẹ cư trú, hoặc nộp trực tuyến qua **Cổng Dịch vụ công Quốc gia**.
- **Thời hạn giải quyết:** Trong ngày làm việc hoặc tối đa 02 ngày làm việc.
- **Lệ phí:** Hoàn toàn **Miễn phí** khi đăng ký đúng hạn (trong vòng 60 ngày kể từ ngày sinh).

Hệ thống đã hỗ trợ **liên thông điện tử 3 trong 1** (Đăng ký khai sinh - Đăng ký thường trú - Cấp thẻ BHYT) rất thuận tiện!`,
          timestamp: '10:16',
          citations: [
            {
              id: 'proc-shared-1',
              anonCode: 'PROC-NAT-01',
              title: 'Thủ tục Đăng ký khai sinh (kết hợp cấp thẻ BHYT và đăng ký thường trú)',
              docNumber: 'TTHC-BTP-2.000185',
              scope: 'shared',
              category: 'procedure',
            },
            {
              id: 'doc-shared-2',
              anonCode: 'DOC-NAT-02',
              title: 'Luật Cư trú số 68/2020/QH14',
              docNumber: '68/2020/QH14',
              scope: 'shared',
              category: 'policy',
            },
          ],
        },
      ],
    },
  ]);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>('session-demo-1');

  // Derive current role and commune
  const currentRole: UserRole = currentUser ? currentUser.role : 'guest';
  const currentCommune: Commune | null = currentUser?.communeId
    ? communes.find((c) => c.id === currentUser.communeId) || null
    : null;

  // Intercept if commune is suspended or expired when logging in
  useEffect(() => {
    if (currentUser && currentCommune && (currentCommune.status === 'suspended' || currentCommune.status === 'expired')) {
      if (currentScreen !== 59 && currentScreen !== 45 && currentScreen !== 13) {
        setCurrentScreen(59);
      }
    }
  }, [currentUser, currentCommune, currentScreen]);

  const navigateTo = (screenNumber: number, param: string = '') => {
    setHistoryStack((prev) => [...prev, { screen: screenNumber, param }]);
    setCurrentScreen(screenNumber);
    setScreenParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop(); // remove current
      const prev = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentScreen(prev.screen);
      setScreenParam(prev.param);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo(1);
    }
  };

  // Switch Role helper for testing
  const switchRole = (role: UserRole, specificUserId?: string, targetCommuneId?: string) => {
    if (role === 'guest') {
      setCurrentUser(null);
      navigateTo(1);
      return;
    }

    if (specificUserId) {
      const u = users.find((user) => user.id === specificUserId);
      if (u) {
        setCurrentUser(u);
        if (u.role === 'system_admin') {
          navigateTo(47);
        } else {
          navigateTo(1);
        }
        return;
      }
    }

    const matchedUser = users.find((u) => {
      if (targetCommuneId && u.communeId !== targetCommuneId) return false;
      return u.role === role;
    });

    if (matchedUser) {
      setCurrentUser(matchedUser);
      if (role === 'system_admin') {
        navigateTo(47);
      } else {
        navigateTo(1);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo(1);
  };

  const loginAs = (emailOrPhone: string, _password?: string) => {
    const user = users.find((u) => u.email === emailOrPhone || u.phone === emailOrPhone);
    if (!user) {
      return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' };
    }

    if (user.status === 'locked') {
      return { success: false, message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ Quản lý xã.' };
    }

    if (user.status === 'rejected') {
      return {
        success: false,
        message: `Tài khoản đã bị từ chối phê duyệt. Lý do: ${user.rejectionReason || 'Thông tin giấy tờ không hợp lệ'}`,
      };
    }

    if (user.status === 'pending') {
      return {
        success: false,
        message: 'Tài khoản cán bộ của bạn đang chờ Quản lý xã xét duyệt. Vui lòng quay lại sau.',
      };
    }

    // Check commune validity
    const commune = communes.find((c) => c.id === user.communeId);
    if (commune && (commune.status === 'suspended' || commune.status === 'expired')) {
      setCurrentUser(user);
      return { success: true, targetScreen: 59 };
    }

    // Check force change password on first login
    if (user.mustChangePasswordFirstLogin) {
      setCurrentUser(user);
      return { success: true, targetScreen: 16 };
    }

    setCurrentUser(user);
    if (user.role === 'system_admin') {
      return { success: true, targetScreen: 47 };
    }
    return { success: true, targetScreen: 1 };
  };

  // Strictly enforce Part I Data Scope matrix
  const getVisibleDocuments = (): DocumentItem[] => {
    return documents.filter((doc) => {
      // 1. Dùng chung: always visible to everyone (Guest, Citizen, Officer, Commune Admin)
      if (doc.scope === 'shared') {
        return doc.status === 'published';
      }

      // If guest: only see shared docs
      if (!currentUser || currentRole === 'guest') {
        return false;
      }

      // Must match user's commune
      if (doc.communeId !== currentUser.communeId) {
        return false;
      }

      // 2. Của xã - Công khai:
      if (doc.scope === 'commune_public') {
        if (currentRole === 'commune_admin') return true; // Commune admin sees drafts & published
        return doc.status === 'published';
      }

      // 3. Của xã - Nội bộ:
      if (doc.scope === 'commune_internal') {
        // Citizen and Guest CANNOT see internal
        if (currentRole === 'citizen') {
          return false;
        }
        // Officer and Commune Admin can see
        if (currentRole === 'officer') {
          return doc.status === 'published';
        }
        if (currentRole === 'commune_admin') {
          return true; // sees drafts, published, hidden, errors
        }
      }

      return false;
    });
  };

  // Add Document
  const addDocument = (doc: Partial<DocumentItem>, notifyUsers = false) => {
    const randomCode = `DOC-HL-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      anonCode: randomCode,
      title: doc.title || 'Văn bản mới',
      docNumber: doc.docNumber || '01/TB-UBND',
      docType: doc.docType || 'Thông báo',
      issueDate: doc.issueDate || new Date().toISOString().split('T')[0],
      effectiveDate: doc.effectiveDate || new Date().toISOString().split('T')[0],
      validityStatus: doc.validityStatus || 'Còn hiệu lực',
      issuingAgency: doc.issuingAgency || currentCommune?.name || 'UBND Xã',
      category: doc.category || 'policy',
      scope: doc.scope || 'commune_internal',
      status: doc.status || 'published',
      communeId: currentUser?.communeId || 'commune-hl',
      content: doc.content || 'Nội dung chi tiết văn bản...',
      summary: doc.summary || 'Tóm tắt nội dung văn bản mới ban hành.',
      fileSize: '1.2 MB',
      viewCount: 0,
      field: doc.field,
      implementingAgency: doc.implementingAgency,
      implementationLevel: 'Cấp xã',
      targetAudience: doc.targetAudience,
      steps: doc.steps,
      dossierChecklist: doc.dossierChecklist,
      resolutionDuration: doc.resolutionDuration,
      fees: doc.fees,
      resultFormat: doc.resultFormat,
      legalBasis: doc.legalBasis,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Record audit log
    if (currentUser) {
      const newAudit: AuditLog = {
        id: `cal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser.fullName,
        userRole: currentUser.role === 'commune_admin' ? 'Quản lý xã' : 'Cán bộ',
        action: 'Thêm tài liệu mới',
        target: `${newDoc.title} (${newDoc.anonCode})`,
        communeId: currentUser.communeId,
      };
      setCommuneAuditLogs((prev) => [newAudit, ...prev]);
    }

    // Trigger notification if requested
    if (notifyUsers) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        communeId: currentUser?.communeId,
        targetRole: newDoc.scope === 'commune_public' ? 'all' : 'officer',
        title: `Văn bản mới: ${newDoc.title}`,
        message: `${newDoc.issuingAgency} vừa ban hành văn bản số hiệu ${newDoc.docNumber}.`,
        targetScreen: 5,
        targetParam: newDoc.id,
        createdAt: new Date().toLocaleString('vi-VN'),
        read: false,
        type: 'document',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDocument = (id: string) => {
    const docToDelete = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (currentUser && docToDelete) {
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: 'Xóa tài liệu',
          target: `${docToDelete.title} (${docToDelete.anonCode})`,
          communeId: currentUser.communeId,
        },
        ...prev,
      ]);
    }
  };

  const changeDocScope = (id: string, newScope: DataScope) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, scope: newScope } : d)));
    if (currentUser) {
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: `Đổi phạm vi hiển thị: ${newScope === 'commune_public' ? 'Công khai' : 'Nội bộ'}`,
          target: `${doc.title} (${doc.anonCode})`,
          communeId: currentUser.communeId,
        },
        ...prev,
      ]);
    }
  };

  const reprocessDoc = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            status: 'published',
            errorDetail: undefined,
          };
        }
        return d;
      })
    );
  };

  // Personal Docs
  const addPersonalDoc = (doc: Omit<PersonalDoc, 'id' | 'anonCode'>) => {
    const anonCode = `PDOC-${Math.floor(100 + Math.random() * 900).toString(16).toUpperCase()}`;
    const newPDoc: PersonalDoc = {
      ...doc,
      id: `pdoc-${Date.now()}`,
      anonCode,
      status: 'ready',
      progress: 100,
    };
    setPersonalDocs((prev) => [newPDoc, ...prev]);
  };

  const deletePersonalDoc = (id: string) => {
    setPersonalDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const updatePersonalDocTags = (id: string, newTags: string[]) => {
    setPersonalDocs((prev) => prev.map((d) => (d.id === id ? { ...d, tags: newTags } : d)));
  };

  const addTag = (name: string, color: string) => {
    const newTag: TagItem = {
      id: `tag-${Date.now()}`,
      name,
      color,
    };
    setTags((prev) => [...prev, newTag]);
  };

  const deleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  // Officer Approval
  const approveOfficer = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'active' } : u)));
    if (user && currentUser) {
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: 'Duyệt tài khoản cán bộ',
          target: `${user.fullName} (${user.position || 'Cán bộ'})`,
          communeId: currentUser.communeId,
        },
        ...prev,
      ]);

      // Send notification to user
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetUserId: user.id,
          title: 'Tài khoản cán bộ đã được phê duyệt',
          message: `Chào mừng đồng chí ${user.fullName}. Quản lý xã đã duyệt tài khoản cán bộ của bạn. Bây giờ bạn có thể truy cập đầy đủ tài liệu nội bộ và AI tài liệu.`,
          targetScreen: 17,
          createdAt: new Date().toLocaleString('vi-VN'),
          read: false,
          type: 'approval',
        },
        ...prev,
      ]);
    }
  };

  const rejectOfficer = (userId: string, reason: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'rejected', rejectionReason: reason } : u)));
    if (user && currentUser) {
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: 'Từ chối tài khoản cán bộ',
          target: `${user.fullName} - Lý do: ${reason}`,
          communeId: currentUser.communeId,
        },
        ...prev,
      ]);
    }
  };

  const lockUnlockUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const newStatus = user.status === 'locked' ? 'active' : 'locked';
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    if (currentUser) {
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: `${newStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản người dùng`,
          target: `${user.fullName} (${user.email})`,
          communeId: currentUser.communeId,
        },
        ...prev,
      ]);
    }
  };

  const resetUserPassword = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user || !currentUser) return;
    setCommuneAuditLogs((prev) => [
      {
        id: `cal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser.fullName,
        userRole: 'Quản lý xã',
        action: 'Đặt lại mật khẩu người dùng',
        target: `${user.fullName} (${user.email})`,
        communeId: currentUser.communeId,
      },
      ...prev,
    ]);
  };

  const deleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (user && currentUser) {
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: 'Xóa tài khoản người dùng',
          target: `${user.fullName} (${user.email})`,
          communeId: currentUser.communeId,
        },
        ...prev,
      ]);
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const deleteCurrentAccount = (_password: string): boolean => {
    if (!currentUser) return false;
    setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
    setCurrentUser(null);
    navigateTo(1);
    return true;
  };

  // Support Session Toggle
  const toggleSupportSession = (communeId: string, duration: '24h' | '3d' | '7d', active: boolean) => {
    setCommunes((prev) =>
      prev.map((c) => {
        if (c.id === communeId) {
          return {
            ...c,
            supportSessionActive: active,
            supportSessionDuration: active ? duration : undefined,
            supportSessionHoursRemaining: active ? (duration === '24h' ? 24 : duration === '3d' ? 72 : 168) : 0,
          };
        }
        return c;
      })
    );

    if (currentUser) {
      const actionName = active ? `Bật quyền hỗ trợ kỹ thuật (${duration})` : 'Thu hồi quyền hỗ trợ kỹ thuật';
      setCommuneAuditLogs((prev) => [
        {
          id: `cal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: currentUser.fullName,
          userRole: 'Quản lý xã',
          action: actionName,
          target: currentCommune?.name || 'Xã',
          communeId,
        },
        ...prev,
      ]);

      setSystemAuditLogs((prev) => [
        {
          id: `sal-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          userName: `${currentUser.fullName} (${currentCommune?.name})`,
          action: actionName,
          target: currentCommune?.name || 'Xã',
          communeName: currentCommune?.name,
          details: active ? `Xã mở phiên hỗ trợ thời hạn ${duration}` : 'Xã đã chủ động thu hồi phiên hỗ trợ',
        },
        ...prev,
      ]);
    }
  };

  // Citizen Feedback
  const submitFeedback = (content: string, senderContact: string, senderName?: string) => {
    const newFeedback: CitizenFeedback = {
      id: `fb-${Date.now()}`,
      communeId: currentUser?.communeId || 'commune-hl',
      senderName: senderName || currentUser?.fullName || 'Công dân',
      senderContact: senderContact || currentUser?.phone || currentUser?.email || 'Chưa cung cấp',
      content,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new',
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);

    // Send notification to Commune Admin
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      communeId: currentUser?.communeId || 'commune-hl',
      targetRole: 'commune_admin',
      title: 'Phản ánh, góp ý mới từ công dân',
      message: `${newFeedback.senderName} vừa gửi một ý kiến đóng góp tới UBND xã.`,
      targetScreen: 44,
      createdAt: new Date().toLocaleString('vi-VN'),
      read: false,
      type: 'feedback',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const replyFeedback = (id: string, reply: string) => {
    const fb = feedbacks.find((f) => f.id === id);
    if (!fb) return;

    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            status: 'resolved',
            reply,
            repliedAt: new Date().toLocaleString('vi-VN'),
            repliedBy: currentUser?.fullName,
          };
        }
        return f;
      })
    );

    // Notify citizen if matching user exists
    const matchingUser = users.find((u) => u.phone === fb.senderContact || u.email === fb.senderContact || u.fullName === fb.senderName);
    if (matchingUser) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetUserId: matchingUser.id,
          title: 'UBND Xã đã phản hồi ý kiến góp ý của bạn',
          message: `Phản ánh: "${fb.content.slice(0, 40)}..." đã được UBND xã trả lời.`,
          targetScreen: 3,
          createdAt: new Date().toLocaleString('vi-VN'),
          read: false,
          type: 'feedback',
        },
        ...prev,
      ]);
    }
  };

  const updateFeedbackStatus = (id: string, status: 'new' | 'processing' | 'resolved') => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  };

  // System Admin (Dev team actions)
  const createCommune = (communeData: Partial<Commune>, adminData: Partial<User>) => {
    const communeId = `commune-${Date.now()}`;
    const newCommune: Commune = {
      id: communeId,
      name: communeData.name || 'Xã Mới',
      province: communeData.province || 'TP. Hà Nội',
      communeCode: communeData.communeCode || `XA-${Math.floor(10000 + Math.random() * 90000)}`,
      address: communeData.address || 'Trung tâm hành chính xã',
      phone: communeData.phone || '024.1234.5678',
      email: communeData.email || 'ubnd@xatoi.gov.vn',
      servicePlan: communeData.servicePlan || 'Gói Tiêu Chuẩn Cấp Xã',
      activatedAt: communeData.activatedAt || new Date().toISOString().split('T')[0],
      expiresAt: communeData.expiresAt || '2027-12-31',
      status: 'active',
      userCount: 1,
      officerCount: 0,
      citizenCount: 0,
      storageUsedMb: 0,
      storageTotalMb: 5120,
      processedDocsCount: 0,
      errorDocsCount: 0,
      pendingDocsCount: 0,
      supportSessionActive: false,
    };

    const tempPassword = `Xa@${Math.floor(1000 + Math.random() * 9000)}`;
    const newAdmin: User = {
      id: `user-admin-${Date.now()}`,
      fullName: adminData.fullName || 'Người Quản Lý Xã',
      idCard: adminData.idCard || '001090123456',
      dob: '1985-01-01',
      gender: 'Nam',
      province: newCommune.province,
      communeId: communeId,
      phone: adminData.phone || '0981234567',
      email: adminData.email || 'admin@xatoi.gov.vn',
      role: 'commune_admin',
      status: 'active',
      position: 'Quản trị viên xã',
      department: `UBND ${newCommune.name}`,
      registeredAt: new Date().toISOString().split('T')[0],
      mustChangePasswordFirstLogin: true,
      password: tempPassword,
    };

    setCommunes((prev) => [newCommune, ...prev]);
    setUsers((prev) => [newAdmin, ...prev]);

    setSystemAuditLogs((prev) => [
      {
        id: `sal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser?.fullName || 'Đội phát triển',
        action: 'Khởi tạo xã mới và cấp tài khoản Quản lý xã',
        target: `${newCommune.name} (${newCommune.communeCode})`,
        communeName: newCommune.name,
        details: `Tạo tài khoản quản lý ${newAdmin.fullName}, mật khẩu tạm: ${tempPassword}`,
      },
      ...prev,
    ]);
  };

  const updateCommune = (communeId: string, updates: Partial<Commune>) => {
    setCommunes((prev) => prev.map((c) => (c.id === communeId ? { ...c, ...updates } : c)));
  };

  const renewCommune = (communeId: string, newExpiryDate: string) => {
    const commune = communes.find((c) => c.id === communeId);
    if (!commune) return;
    setCommunes((prev) =>
      prev.map((c) => (c.id === communeId ? { ...c, expiresAt: newExpiryDate, status: 'active' } : c))
    );
    setSystemAuditLogs((prev) => [
      {
        id: `sal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser?.fullName || 'Đội phát triển',
        action: 'Gia hạn gói dịch vụ xã',
        target: `${commune.name} (Hạn mới: ${newExpiryDate})`,
        communeName: commune.name,
      },
      ...prev,
    ]);
  };

  const lockUnlockCommune = (communeId: string) => {
    const commune = communes.find((c) => c.id === communeId);
    if (!commune) return;
    const newStatus = commune.status === 'suspended' ? 'active' : 'suspended';
    setCommunes((prev) => prev.map((c) => (c.id === communeId ? { ...c, status: newStatus } : c)));
    setSystemAuditLogs((prev) => [
      {
        id: `sal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser?.fullName || 'Đội phát triển',
        action: `${newStatus === 'suspended' ? 'Tạm khóa' : 'Mở khóa'} dịch vụ xã`,
        target: commune.name,
        communeName: commune.name,
      },
      ...prev,
    ]);
  };

  const resetCommuneAdminPassword = (communeId: string): string => {
    const newTemp = `XaReset@${Math.floor(1000 + Math.random() * 9000)}`;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.communeId === communeId && u.role === 'commune_admin') {
          return { ...u, password: newTemp, mustChangePasswordFirstLogin: true };
        }
        return u;
      })
    );
    return newTemp;
  };

  const transferCommuneAdmin = (communeId: string, newAdminData: Partial<User>) => {
    const commune = communes.find((c) => c.id === communeId);
    if (!commune) return;

    // Deactivate old admin
    setUsers((prev) =>
      prev.map((u) => {
        if (u.communeId === communeId && u.role === 'commune_admin') {
          return { ...u, role: 'officer', status: 'active', position: 'Cán bộ chuyển giao' };
        }
        return u;
      })
    );

    // Create new admin
    const newAdmin: User = {
      id: `user-admin-${Date.now()}`,
      fullName: newAdminData.fullName || 'Người Quản Lý Xã Mới',
      idCard: newAdminData.idCard || '001090887766',
      dob: '1986-05-20',
      gender: 'Nam',
      province: commune.province,
      communeId: communeId,
      phone: newAdminData.phone || '0988776655',
      email: newAdminData.email || 'admin_new@xatoi.gov.vn',
      role: 'commune_admin',
      status: 'active',
      position: 'Chủ tịch / Quản trị viên xã mới',
      department: `UBND ${commune.name}`,
      registeredAt: new Date().toISOString().split('T')[0],
      mustChangePasswordFirstLogin: true,
      password: 'MatKhauMoi@123',
    };

    setUsers((prev) => [newAdmin, ...prev]);

    setSystemAuditLogs((prev) => [
      {
        id: `sal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser?.fullName || 'Đội phát triển',
        action: 'Chuyển giao quyền Quản lý xã',
        target: `${commune.name} -> ${newAdmin.fullName}`,
        communeName: commune.name,
        details: 'Vô hiệu hóa quyền quản lý tài khoản cũ và bàn giao tài khoản mới',
      },
      ...prev,
    ]);
  };

  const submitSupportRequest = (req: Partial<SupportRequest>) => {
    const newReq: SupportRequest = {
      id: `sr-${Date.now()}`,
      communeId: currentUser?.communeId || 'commune-hl',
      communeName: currentCommune?.name || 'Xã Hòa Lạc',
      type: req.type || 'technical_issue',
      senderName: req.senderName || currentUser?.fullName || 'Quản lý xã',
      senderContact: req.senderContact || currentUser?.phone || currentUser?.email || '',
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new',
      content: req.content || '',
      anonDocId: req.anonDocId,
      errorCode: req.errorCode,
      verificationInfo: req.verificationInfo,
      techSupportSessionActive: !!req.techSupportSessionActive,
    };
    setSupportRequests((prev) => [newReq, ...prev]);
  };

  const resolveSupportRequest = (id: string, replyNotes?: string) => {
    setSupportRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'done', replyNotes } : r))
    );
  };

  const addSystemSharedDoc = (doc: Partial<DocumentItem>, notifyAll = false) => {
    const anonCode = `DOC-NAT-${Math.floor(10 + Math.random() * 90)}`;
    const newDoc: DocumentItem = {
      id: `doc-nat-${Date.now()}`,
      anonCode,
      title: doc.title || 'Văn bản quy phạm mới',
      docNumber: doc.docNumber || '01/2026/NĐ-CP',
      docType: doc.docType || 'Nghị định',
      issueDate: doc.issueDate || new Date().toISOString().split('T')[0],
      effectiveDate: doc.effectiveDate || new Date().toISOString().split('T')[0],
      validityStatus: 'Còn hiệu lực',
      issuingAgency: doc.issuingAgency || 'Chính phủ',
      category: doc.category || 'policy',
      scope: 'shared',
      status: doc.status || 'published',
      content: doc.content || 'Nội dung chi tiết...',
      summary: doc.summary || 'Tóm tắt văn bản dùng chung.',
      fileSize: '2.5 MB',
      viewCount: 0,
      field: doc.field,
      implementingAgency: doc.implementingAgency,
      implementationLevel: 'Cấp xã',
      targetAudience: doc.targetAudience,
      steps: doc.steps,
      dossierChecklist: doc.dossierChecklist,
      resolutionDuration: doc.resolutionDuration,
      fees: doc.fees,
      resultFormat: doc.resultFormat,
      legalBasis: doc.legalBasis,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    setSystemAuditLogs((prev) => [
      {
        id: `sal-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        userName: currentUser?.fullName || 'Đội phát triển',
        action: 'Thêm dữ liệu dùng chung toàn quốc',
        target: `${newDoc.title} (${newDoc.anonCode})`,
        details: notifyAll ? 'Đã gửi thông báo đồng bộ tới tất cả các xã' : undefined,
      },
      ...prev,
    ]);

    if (notifyAll) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        targetRole: 'all',
        title: `Văn bản dùng chung mới: ${newDoc.title}`,
        message: `${newDoc.issuingAgency} vừa ban hành văn bản số hiệu ${newDoc.docNumber}. Đã được cập nhật vào kho tri thức chung.`,
        targetScreen: 5,
        targetParam: newDoc.id,
        createdAt: new Date().toLocaleString('vi-VN'),
        read: false,
        type: 'document',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Notifications
  const getUnreadNotificationCount = () => {
    return notifications.filter((n) => {
      if (n.read) return false;
      if (n.targetUserId && currentUser && n.targetUserId !== currentUser.id) return false;
      if (n.communeId && currentUser?.communeId && n.communeId !== currentUser.communeId) return false;
      if (n.targetRole && n.targetRole !== 'all') {
        if (!currentUser) return false;
        if (n.targetRole === 'commune_admin' && currentUser.role !== 'commune_admin') return false;
        if (n.targetRole === 'officer' && currentUser.role !== 'officer' && currentUser.role !== 'commune_admin') return false;
      }
      return true;
    }).length;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Chatbot Logic with strict Role-based Retrieval Grounding (Part I principle 7)
  const createNewChatSession = (initialPrompt?: string, attachedDocId?: string): string => {
    const newSessionId = `session-${Date.now()}`;
    const attachedDoc = attachedDocId ? documents.find((d) => d.id === attachedDocId) : null;

    const newSession: ChatSession = {
      id: newSessionId,
      title: initialPrompt ? initialPrompt.slice(0, 38) + '...' : 'Cuộc hội thoại mới',
      communeId: currentUser?.communeId,
      userId: currentUser?.id,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned: false,
      messages: [],
    };

    if (initialPrompt) {
      newSession.messages.push({
        id: `msg-${Date.now()}-u`,
        role: 'user',
        content: initialPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      // Generate assistant reply
      const assistantReply = generateAnswer(initialPrompt, attachedDoc);
      newSession.messages.push(assistantReply);
      if (assistantReply.citations?.some((c) => c.scope === 'commune_internal')) {
        newSession.includesInternalDoc = true;
      }
    }

    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatSessionId(newSessionId);
    return newSessionId;
  };

  const sendChatMessage = async (content: string, usePersonalDocsOnly = false) => {
    if (!activeChatSessionId) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeChatSessionId) {
          return {
            ...s,
            messages: [...s.messages, userMsg],
            title: s.messages.length === 0 ? content.slice(0, 36) + '...' : s.title,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return s;
      })
    );

    // Simulate smart grounding with delay
    await new Promise((r) => setTimeout(r, 600));

    const assistantMsg = generateAnswer(content, null, usePersonalDocsOnly);

    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeChatSessionId) {
          const hasInternal = assistantMsg.citations?.some((c) => c.scope === 'commune_internal');
          return {
            ...s,
            messages: [...s.messages, assistantMsg],
            includesInternalDoc: s.includesInternalDoc || hasInternal,
          };
        }
        return s;
      })
    );
  };

  // Answer generation engine with role-based grounding
  const generateAnswer = (
    question: string,
    attachedDoc?: DocumentItem | null,
    usePersonalDocsOnly = false
  ): ChatMessage => {
    const qLower = question.toLowerCase();
    const citations: ChatMessage['citations'] = [];

    // If attachedDoc specified
    if (attachedDoc) {
      // Check permission
      if (attachedDoc.scope === 'commune_internal' && currentRole === 'citizen') {
        return {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: 'Xin lỗi, bạn không có quyền tra cứu tài liệu nội bộ này.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      citations.push({
        id: attachedDoc.id,
        anonCode: attachedDoc.anonCode,
        title: attachedDoc.title,
        docNumber: attachedDoc.docNumber,
        scope: attachedDoc.scope,
        category: attachedDoc.category,
      });

      return {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `Dựa trên văn bản **${attachedDoc.title}** (Số hiệu: ${attachedDoc.docNumber}):\n\n- **Trích yếu nội dung:** ${attachedDoc.summary}\n- **Nội dung trích đoạn liên quan câu hỏi:** ${attachedDoc.content.slice(0, 300)}...\n\nNếu bạn cần thêm thông tin chi tiết hoặc hỗ trợ giải quyết hồ sơ, vui lòng liên hệ Bộ phận Một cửa của UBND xã.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };
    }

    // AI Tài liệu mode: uses personal uploaded docs
    if (usePersonalDocsOnly && personalDocs.length > 0) {
      const matchedPersonal = personalDocs.find((pd) =>
        qLower.includes('tranh chấp') || qLower.includes('hộ tịch') || qLower.includes('biểu mẫu')
      ) || personalDocs[0];

      return {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `Dựa trên tài liệu bạn đã tải lên trong kho cá nhân (**${matchedPersonal.name}**):\n\n${matchedPersonal.content}\n\n*Ghi chú: Tài liệu cá nhân chỉ lưu trong phiên làm việc của bạn và không chia sẻ cho bất kỳ ai khác.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // Role-based retrieval:
    // Citizen gets only shared + commune_public
    // Officer / Commune Admin gets shared + commune_public + commune_internal
    const visibleDocs = getVisibleDocuments();

    // Check query matches
    if (qLower.includes('khai sinh') || qLower.includes('con mới sinh') || qLower.includes('giấy chứng sinh')) {
      const doc = visibleDocs.find((d) => d.id === 'proc-shared-1');
      if (doc) {
        citations.push({
          id: doc.id,
          anonCode: doc.anonCode,
          title: doc.title,
          docNumber: doc.docNumber,
          scope: doc.scope,
          category: doc.category,
        });
      }
      return {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `Thủ tục đăng ký khai sinh tại UBND cấp xã thực hiện theo quy trình liên thông:\n\n1. **Hồ sơ gồm:** Tờ khai khai sinh, Giấy chứng sinh, Giấy chứng nhận kết hôn của cha mẹ và CCCD/VNeID.\n2. **Nơi nộp:** Bộ phận Một cửa UBND xã hoặc nộp trực tuyến qua Cổng Dịch vụ công Quốc gia.\n3. **Thời hạn giải quyết:** Tối đa 02 ngày làm việc.\n4. **Lệ phí:** Miễn phí khi đăng ký đúng hạn.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };
    }

    if (qLower.includes('kết hôn') || qLower.includes('đăng ký kết hôn')) {
      const doc = visibleDocs.find((d) => d.id === 'proc-shared-2');
      if (doc) {
        citations.push({
          id: doc.id,
          anonCode: doc.anonCode,
          title: doc.title,
          docNumber: doc.docNumber,
          scope: doc.scope,
          category: doc.category,
        });
      }
      return {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `Đăng ký kết hôn tại UBND cấp xã yêu cầu:\n\n1. **Điều kiện:** Nam từ đủ 20 tuổi, nữ từ đủ 18 tuổi, hoàn toàn tự nguyện.\n2. **Hồ sơ:** Tờ khai đăng ký kết hôn (hai bên cùng ký), Giấy xác nhận tình trạng hôn nhân (nếu cư trú khác nơi), CCCD/VNeID.\n3. **Đặc biệt:** Cả hai bên nam nữ phải có mặt trực tiếp tại UBND xã để ký vào Sổ hộ tịch và Giấy chứng nhận kết hôn.\n4. **Thời hạn:** Giải quyết ngay trong ngày làm việc.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };
    }

    if (qLower.includes('tiếp công dân') || qLower.includes('gặp chủ tịch') || qLower.includes('chủ tịch xã')) {
      const doc = visibleDocs.find((d) => d.id === 'doc-hl-pub-2');
      if (doc) {
        citations.push({
          id: doc.id,
          anonCode: doc.anonCode,
          title: doc.title,
          docNumber: doc.docNumber,
          scope: doc.scope,
          category: doc.category,
        });
      }
      return {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `Theo Thông báo số 08/TB-UBND của UBND Xã Hòa Lạc:\n\n- **Lịch tiếp công dân định kỳ của Chủ tịch UBND xã:** Vào **Thứ Ba hàng tuần** tại Phòng Tiếp công dân UBND xã.\n- **Thời gian:** Buổi sáng từ 8h00 - 11h30; Buổi chiều từ 13h30 - 16h30.\n- Khi đến, công dân vui lòng mang theo Căn cước công dân và các giấy tờ, đơn kiến nghị có liên quan.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };
    }

    if (qLower.includes('an ninh') || qLower.includes('trật tự') || qLower.includes('tuần tra') || qLower.includes('tranh chấp mốc giới')) {
      // INTERNAL DOCUMENT TEST!
      // If citizen: STRICTLY DO NOT cite internal doc
      if (currentRole === 'citizen' || currentRole === 'guest') {
        return {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `Về tình hình an ninh trật tự trên địa bàn xã, UBND xã luôn bố trí lực lượng Công an xã trực ban 24/24. Nếu công dân phát hiện vụ việc mất an ninh trật tự hoặc có vướng mắc mâu thuẫn cần hòa giải, xin vui lòng liên hệ Trực ban Công an xã hoặc gửi đơn phản ánh tới UBND xã để được tiếp nhận giải quyết.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      // If Officer or Commune Admin: Can cite internal doc DOC-8F3A!
      const intDoc = visibleDocs.find((d) => d.id === 'doc-hl-int-1');
      if (intDoc) {
        citations.push({
          id: intDoc.id,
          anonCode: intDoc.anonCode,
          title: intDoc.title,
          docNumber: intDoc.docNumber,
          scope: intDoc.scope,
          category: intDoc.category,
        });
      }
      return {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: `Căn cứ theo Báo cáo nội bộ số 88/BC-UBND về công tác an ninh trật tự:\n\n- Đã ghi nhận 02 vụ việc tranh chấp mốc giới đất đai tại Thôn 3, công chức Tư pháp và Địa chính đã tiến hành hòa giải cơ sở đợt 1.\n- Ban Chỉ huy Quân sự xã phối hợp Công an xã tiếp tục duy trì ca tuần tra đêm từ 22h00 đến 04h00 trên các trục đường liên thôn.\n*(Tài liệu này thuộc phạm vi Nội bộ, chỉ lưu hành giữa Cán bộ và Lãnh đạo xã)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
      };
    }

    if (qLower.includes('thiên tai') || qLower.includes('bão') || qLower.includes('lụt') || qLower.includes('sơ tán')) {
      if (currentRole === 'officer' || currentRole === 'commune_admin') {
        const pDoc = visibleDocs.find((d) => d.id === 'doc-hl-int-2');
        if (pDoc) {
          citations.push({
            id: pDoc.id,
            anonCode: pDoc.anonCode,
            title: pDoc.title,
            docNumber: pDoc.docNumber,
            scope: pDoc.scope,
            category: pDoc.category,
          });
        }
        return {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `Theo Phương án nội bộ số 12/PA-UBND ứng phó thiên tai năm 2026:\n\n- Các điểm xung yếu: Vùng ven suối Thôn 1 và khu xóm Bãi.\n- Địa điểm sơ tán dân dự phòng: Trường Tiểu học Hòa Lạc (sức chứa 250 người) và Nhà văn hóa trung tâm (sức chứa 180 người).\n- Lực lượng thường trực duy trì trực ban chỉ huy 24/24.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
        };
      }
    }

    // Default fallback
    const sharedDoc = visibleDocs.find((d) => d.scope === 'shared');
    if (sharedDoc) {
      citations.push({
        id: sharedDoc.id,
        anonCode: sharedDoc.anonCode,
        title: sharedDoc.title,
        docNumber: sharedDoc.docNumber,
        scope: sharedDoc.scope,
        category: sharedDoc.category,
      });
    }

    return {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: `Hệ thống AI Cấp Xã đã tiếp nhận câu hỏi của bạn. \n\nĐể được hướng dẫn chi tiết và chính xác nhất theo quy định hiện hành, bạn có thể tra cứu tại mục **Văn bản chính sách** hoặc **Thủ tục hành chính** trên thanh điều hướng, hoặc liên hệ trực tiếp cán bộ chuyên môn tại Bộ phận Một cửa của UBND xã.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations,
    };
  };

  const pinChatSession = (sessionId: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  const deleteChatSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeChatSessionId === sessionId) {
      setActiveChatSessionId(null);
    }
  };

  const renameChatSession = (sessionId: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
    );
  };

  const reactToMessage = (
    messageId: string,
    reaction: 'like' | 'dislike',
    reason?: string,
    feedback?: string
  ) => {
    setChatSessions((prev) =>
      prev.map((s) => {
        return {
          ...s,
          messages: s.messages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  reaction,
                  dislikeReason: reason,
                  dislikeFeedback: feedback,
                }
              : m
          ),
        };
      })
    );
  };

  const shareChatSession = (sessionId: string): string => {
    const token = `share_${sessionId}_${Math.random().toString(36).substring(2, 8)}`;
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, sharedToken: token } : s))
    );
    return `${window.location.origin}/#shared=${token}`;
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenParam,
        navigateTo,
        goBack,
        historyStack,
        currentUser,
        currentRole,
        currentCommune,
        users,
        communes,
        switchRole,
        logout,
        loginAs,
        documents,
        personalDocs,
        tags,
        getVisibleDocuments,
        addDocument,
        updateDocument,
        deleteDocument,
        changeDocScope,
        reprocessDoc,
        addPersonalDoc,
        deletePersonalDoc,
        updatePersonalDocTags,
        addTag,
        deleteTag,
        approveOfficer,
        rejectOfficer,
        lockUnlockUser,
        resetUserPassword,
        deleteUser,
        updateUserProfile,
        deleteCurrentAccount,
        toggleSupportSession,
        feedbacks,
        submitFeedback,
        replyFeedback,
        updateFeedbackStatus,
        supportRequests,
        communeAuditLogs,
        systemAuditLogs,
        loginHistory,
        createCommune,
        updateCommune,
        renewCommune,
        lockUnlockCommune,
        resetCommuneAdminPassword,
        transferCommuneAdmin,
        submitSupportRequest,
        resolveSupportRequest,
        addSystemSharedDoc,
        notifications,
        getUnreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        chatSessions,
        activeChatSessionId,
        setActiveChatSessionId,
        createNewChatSession,
        sendChatMessage,
        pinChatSession,
        deleteChatSession,
        renameChatSession,
        reactToMessage,
        shareChatSession,
        isMaintenance,
        setIsMaintenance,
        isSessionExpired,
        setIsSessionExpired,
        isConnectionError,
        setIsConnectionError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
