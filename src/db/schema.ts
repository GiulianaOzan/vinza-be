import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// Roles Table
export const rolesTable = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
});

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  users: many(usersTable),
}));

// Users Table with FK to roles
export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  roleId: integer().notNull(),
});

export const userRelations = relations(usersTable, ({ one }) => ({
  role: one(rolesTable, {
    fields: [usersTable.roleId],
    references: [rolesTable.id],
  }),
}));

// Permissions Table
export const permissionsTable = pgTable(
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
      .references(() => permissionsTable.id),
    roleId: integer('role_id')
      .notNull()
      .references(() => rolesTable.id),
  },
  (t) => [primaryKey({ columns: [t.permissionId, t.roleId] })],
);

export const permissionsToRolesRelations = relations(
  permissionsToRoles,
  ({ one }) => ({
    permission: one(permissionsTable, {
      fields: [permissionsToRoles.permissionId],
      references: [permissionsTable.id],
    }),
    role: one(rolesTable, {
      fields: [permissionsToRoles.roleId],
      references: [rolesTable.id],
    }),
  }),
);
