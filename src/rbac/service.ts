import { db, DrizzleDatabase } from '@/db';
import { permissions, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CreateRoleDto, UpdatePermissionDto, UpdateRoleDto } from './types';

export class RolesService {
  constructor(private readonly db: DrizzleDatabase) {}

  public async create(dto: CreateRoleDto) {
    const [role] = await this.db.insert(roles).values(dto).returning();
    return role;
  }

  public async findAll() {
    const roles = await this.db.query.roles.findMany();
    return roles;
  }

  public async findOne(id: number) {
    const role = await this.db.query.roles.findFirst({
      where: eq(roles.id, id),
      with: {
        permissionsToRoles: {
          with: {
            permission: true,
          },
        },
      },
    });
    return role;
  }

  public async update(id: number, dto: UpdateRoleDto) {
    const [role] = await this.db
      .update(roles)
      .set(dto)
      .where(eq(roles.id, id))
      .returning();
    return role;
  }

  public async delete(id: number) {
    await this.db.delete(roles).where(eq(roles.id, id));
  }
}

export class PermissionsService {
  constructor(private readonly db: DrizzleDatabase) {
    this.update = this.update.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  // public async checkPermission(user: User, permission: string) {
  //   const role = await this.db.query.roles.findFirst({
  //     where: eq(roles.id, user.roleId),
  //   });
  // }

  public async update(id: number, dto: UpdatePermissionDto) {
    const [permission] = await this.db
      .update(permissions)
      .set(dto)
      .where(eq(permissions.id, id))
      .returning();
    return permission;
  }

  public async findAll() {
    const permissions = await this.db.query.permissions.findMany();
    return permissions;
  }
}

export const permissionsService = new PermissionsService(db);

export type IPermissionsService = typeof permissionsService;

export const rolesService = new RolesService(db);

export type IRolesService = typeof rolesService;
