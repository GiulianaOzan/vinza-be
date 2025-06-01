import { PermissionCreationAttributes, RolCreationAttributes } from './model';

export type CreateRolDto = RolCreationAttributes;

export type UpdateRoleDto = Partial<RolCreationAttributes>;

export type CreatePermissionDto = PermissionCreationAttributes;

export type UpdatePermissionDto = Omit<
  Partial<PermissionCreationAttributes>,
  'clave'
>;
