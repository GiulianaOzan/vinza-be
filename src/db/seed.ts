// Make a seed for the database

import { db } from './index';
import { reset, seed } from 'drizzle-seed';
import * as schemas from './schema';
import { hash } from 'bcrypt';
import logger from '@/logger';

export async function seedDatabase() {
  /**
     * DATA:
     * {
    roles: [
      {
        name: 'admin',
      },
    ],
    permissions: [
      { name: 'Read Users', key: 'USERS:READ' },
      { name: 'Manage Users', key: 'USERS:MANAGE' },
      { name: 'Read Roles', key: 'ROLES:READ' },
      { name: 'Manage Roles', key: 'ROLES:MANAGE' },
    ],
    permissionsToRoles: async (data: SeedData) => {
      const adminRole = data.roles[0];
      const allPermissions = data.permissions;

      return allPermissions.map((permission) => ({
        roleId: adminRole.id,
        permissionId: permission.id,
      }));
    },
    users: async (data: SeedData) => {
      const hashedPassword = await hash('admin123', 10);
      const adminRole = data.roles[0];

      return [
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          roleId: adminRole.id,
          validated: new Date(),
        },
        {
          name: 'Regular User',
          email: 'user@example.com',
          password: hashedPassword,
          roleId: adminRole.id,
          validated: new Date(),
        },
      ];
    },
  }
     */
  // Erase all data in the database before seeding
  await reset(db, schemas);
  logger.info('ERASED THE DB');

  const hashedPassword = await hash('admin123', 10);

  await seed(db, schemas).refine((f) => ({
    roles: {
      count: 1,
      columns: {
        name: f.valuesFromArray({
          values: ['admin'],
          isUnique: true,
        }),
      },
      with: {
        users: 2, // Both users will be associated with the admin role
      },
    },
    permissions: {
      count: 4,
      columns: {
        name: f.valuesFromArray({
          values: ['Read Users', 'Manage Users', 'Read Roles', 'Manage Roles'],
          isUnique: true,
        }),
        key: f.valuesFromArray({
          values: ['USERS:READ', 'USERS:MANAGE', 'ROLES:READ', 'ROLES:MANAGE'],
          isUnique: true,
        }),
      },
    },
    permissionsToRoles: {
      count: 4,
      columns: {
        roleId: f.valuesFromArray({
          values: [1, 1, 1, 1], // The admin role ID
        }),
        permissionId: f.valuesFromArray({
          values: [1, 2, 3, 4], // Unique permission IDs
          isUnique: true, // This matters!
        }),
      },
    },
    users: {
      count: 2,
      columns: {
        name: f.valuesFromArray({
          values: ['Admin User', 'Regular User'],
          isUnique: true,
        }),
        email: f.valuesFromArray({
          values: ['admin@example.com', 'user@example.com'],
          isUnique: true,
        }),
        password: f.valuesFromArray({
          values: [hashedPassword],
        }),
        validated: f.date({
          minDate: new Date('2024-01-01'),
          maxDate: new Date(),
        }),
      },
    },
  }));
}
