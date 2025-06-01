// Dinamically generate audit events from :
// - Models list defined in a hardcoded list
// - actions [create, update, delete]
// format: model:action

export enum AuditEvent {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

// Add new models to this enum
export enum AuditModel {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  BODEDA = 'bodega',
  SUCURSAL = 'sucursal',
}
// Define the type for the audit events
export type AuditEventType = `${AuditModel}:${AuditEvent}`;

export const AuditEvents: AuditEventType[] = Object.values(AuditModel)
  .map((model) =>
    Object.values(AuditEvent).map((action) => `${model}:${action}`),
  )
  .flat() as AuditEventType[];
