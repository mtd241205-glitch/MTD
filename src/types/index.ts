export type UserRole = 'guest' | 'citizen' | 'officer' | 'commune_admin' | 'system_admin';

export type UserStatus = 'pending' | 'active' | 'rejected' | 'locked';

export type CommuneStatus = 'active' | 'expiring' | 'expired' | 'suspended';

export type DataScope = 'shared' | 'commune_public' | 'commune_internal' | 'personal';

export type DocumentStatus = 'draft' | 'published' | 'hidden' | 'processing_error';

export type DocumentCategory = 'policy' | 'procedure';

export interface Commune {
  id: string;
  name: string;
  province: string;
  communeCode: string;
  address: string;
  phone: string;
  email: string;
  servicePlan: string;
  activatedAt: string;
  expiresAt: string;
  status: CommuneStatus;
  userCount: number;
  officerCount: number;
  citizenCount: number;
  storageUsedMb: number;
  storageTotalMb: number;
  processedDocsCount: number;
  errorDocsCount: number;
  pendingDocsCount: number;
  supportSessionActive: boolean;
  supportSessionHoursRemaining?: number;
  supportSessionDuration?: '24h' | '3d' | '7d';
  supportSessionExpiresAt?: string;
  supportSessionAccessLog?: Array<{
    id: string;
    timestamp: string;
    adminEmail: string;
    action: string;
    reason: string;
  }>;
}

export interface User {
  id: string;
  fullName: string;
  idCard: string; // Số CCCD
  dob: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  province: string;
  communeId: string;
  phone: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  position?: string; // Chức vụ
  department?: string; // Đơn vị công tác
  proofDocUrl?: string; // Giấy tờ minh chứng cho Cán bộ
  registeredAt: string;
  rejectionReason?: string;
  avatarUrl?: string;
  mustChangePasswordFirstLogin?: boolean;
}

export interface ProcedureStep {
  step: number;
  title: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  anonCode: string; // e.g. DOC-8F3A for safe tech troubleshooting
  title: string;
  docNumber: string; // Số hiệu văn bản hoặc Mã thủ tục
  docType: string; // Nghị định, Thông tư, Quyết định, Kế hoạch, Thủ tục...
  issueDate: string;
  effectiveDate: string;
  validityStatus: 'Còn hiệu lực' | 'Hết hiệu lực' | 'Hết hiệu lực một phần' | 'Chưa có hiệu lực';
  issuingAgency: string; // Cơ quan ban hành
  category: DocumentCategory; // 'policy' | 'procedure'
  scope: DataScope; // 'shared' | 'commune_public' | 'commune_internal'
  status: DocumentStatus; // 'draft' | 'published' | 'hidden' | 'processing_error'
  communeId?: string; // if not shared
  content: string;
  summary: string;
  fileSize: string;
  uploadedBy?: string;
  viewCount: number;
  // Fields for Procedure
  field?: string; // Lĩnh vực (Hộ tịch, Đất đai, Xây dựng, Tư pháp, Lao động TBXH...)
  implementingAgency?: string; // Cơ quan thực hiện (UBND xã, Bộ phận Một cửa...)
  implementationLevel?: string; // Cấp thực hiện (Cấp xã)
  targetAudience?: string; // Đối tượng thực hiện (Công dân, Tổ chức)
  steps?: ProcedureStep[];
  dossierChecklist?: string[]; // Thành phần hồ sơ
  resolutionDuration?: string; // Thời hạn giải quyết
  fees?: string; // Phí/Lệ phí
  resultFormat?: string; // Kết quả thực hiện
  legalBasis?: string[]; // Căn cứ pháp lý
  downloadUrl?: string;
  errorDetail?: string;
  version?: number;
  previousVersionId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Array<{
    id: string;
    anonCode: string;
    title: string;
    docNumber: string;
    scope: DataScope;
    category: DocumentCategory;
  }>;
  reaction?: 'like' | 'dislike';
  dislikeReason?: string;
  dislikeFeedback?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  communeId?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  messages: ChatMessage[];
  sharedToken?: string;
  includesInternalDoc?: boolean;
}

export interface PersonalDoc {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  content: string;
  tags: string[];
  status: 'processing' | 'ready' | 'error';
  progress?: number;
  anonCode: string;
}

export interface TagItem {
  id: string;
  name: string;
  color: string;
}

export interface CitizenFeedback {
  id: string;
  communeId: string;
  senderName: string;
  senderContact: string;
  content: string;
  createdAt: string;
  status: 'new' | 'processing' | 'resolved';
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
}

export interface SupportRequest {
  id: string;
  communeId: string;
  communeName: string;
  type: 'password_reset' | 'renewal' | 'technical_issue' | 'other';
  senderName: string;
  senderContact: string;
  createdAt: string;
  status: 'new' | 'processing' | 'done';
  anonDocId?: string;
  errorCode?: string;
  content: string;
  verificationInfo?: string;
  techSupportSessionActive: boolean;
  replyNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole?: string;
  action: string;
  target: string;
  targetId?: string;
  communeId?: string;
  communeName?: string;
  details?: string;
}

export interface AppNotification {
  id: string;
  communeId?: string;
  targetRole?: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  targetScreen: number;
  targetParam?: string;
  createdAt: string;
  read: boolean;
  type: 'document' | 'approval' | 'feedback' | 'service' | 'system';
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  userAccount: string;
  userName: string;
  ip: string;
  device: string;
  status: 'Thành công' | 'Thất bại';
  communeId: string;
}
