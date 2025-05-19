"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionsToRolesRelations = exports.permissionsToRoles = exports.permissionsTable = exports.userRelations = exports.usersTable = exports.rolesRelations = exports.rolesTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
// Roles Table
exports.rolesTable = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)().notNull(),
});
exports.rolesRelations = (0, drizzle_orm_1.relations)(exports.rolesTable, ({ many }) => ({
    users: many(exports.usersTable),
}));
// Users Table with FK to roles
exports.usersTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, pg_core_1.integer)().notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)().notNull(),
    roleId: (0, pg_core_1.integer)().notNull(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.usersTable, ({ one }) => ({
    role: one(exports.rolesTable, {
        fields: [exports.usersTable.roleId],
        references: [exports.rolesTable.id],
    }),
}));
// Permissions Table
exports.permissionsTable = (0, pg_core_1.pgTable)('permissions', {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)().notNull().unique(),
    key: (0, pg_core_1.varchar)().notNull().unique(),
}, (table) => [(0, pg_core_1.uniqueIndex)('key_idx').on(table.key)]);
exports.permissionsToRoles = (0, pg_core_1.pgTable)('permissions_to_roles', {
    permissionId: (0, pg_core_1.integer)('permission_id')
        .notNull()
        .references(() => exports.permissionsTable.id),
    roleId: (0, pg_core_1.integer)('role_id')
        .notNull()
        .references(() => exports.rolesTable.id),
}, (t) => [(0, pg_core_1.primaryKey)({ columns: [t.permissionId, t.roleId] })]);
exports.permissionsToRolesRelations = (0, drizzle_orm_1.relations)(exports.permissionsToRoles, ({ one }) => ({
    permission: one(exports.permissionsTable, {
        fields: [exports.permissionsToRoles.permissionId],
        references: [exports.permissionsTable.id],
    }),
    role: one(exports.rolesTable, {
        fields: [exports.permissionsToRoles.roleId],
        references: [exports.rolesTable.id],
    }),
}));
