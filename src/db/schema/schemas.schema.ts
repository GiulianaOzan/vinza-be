import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// Roles Table
export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissionsToRoles: many(permissionsToRoles),
}));

// Users Table with FK to roles
export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar().notNull(),
    roleId: integer().notNull(),
    validated: timestamp(),
  },
  (table) => [uniqueIndex('email_idx').on(table.email)],
);

export const userRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

// Permissions Table
export const permissions = pgTable(
  'permissions',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull().unique(),
    key: varchar().notNull().unique(),
  },
  (table) => [uniqueIndex('key_idx').on(table.key)],
);

export const permissionsToRoles = pgTable(
  'permissions_to_roles',
  {
    permissionId: integer('permission_id')
      .notNull()
      .references(() => permissions.id),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (t) => [primaryKey({ columns: [t.permissionId, t.roleId] })],
);

export const permissionsToRolesRelations = relations(
  permissionsToRoles,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [permissionsToRoles.permissionId],
      references: [permissions.id],
    }),
    role: one(roles, {
      fields: [permissionsToRoles.roleId],
      references: [roles.id],
    }),
  }),
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  permissionsToRoles: many(permissionsToRoles),
}));
