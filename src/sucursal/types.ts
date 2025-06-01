import { SucursalCreationAttributes } from './model';

export type CreateSucursalDto = SucursalCreationAttributes;
export type UpdateSucursalDto = Partial<CreateSucursalDto>;
