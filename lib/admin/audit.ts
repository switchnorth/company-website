import type { AuditAction, AuditEntry } from "../../types/admin";

type AuditGlobal = typeof globalThis & {
  switchNorthAdminAuditLog?: AuditEntry[];
};

function getAuditStore() {
  const globalForAudit = globalThis as AuditGlobal;

  if (!globalForAudit.switchNorthAdminAuditLog) {
    globalForAudit.switchNorthAdminAuditLog = [];
  }

  return globalForAudit.switchNorthAdminAuditLog;
}

export function recordAuditEntry(entry: {
  action: AuditAction;
  adminId: string;
  entity: AuditEntry["entity"];
  entityId: string;
  timestamp?: string;
}) {
  getAuditStore().unshift({
    action: entry.action,
    adminId: entry.adminId,
    entity: entry.entity,
    entityId: entry.entityId,
    timestamp: entry.timestamp ?? new Date().toISOString(),
  });
}

export function listAuditEntries() {
  return [...getAuditStore()];
}

export function clearAuditEntries() {
  getAuditStore().splice(0);
}
