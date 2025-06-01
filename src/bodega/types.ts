import { BodegaCreationAttributes } from './model';

export type CreateBodegaDto = BodegaCreationAttributes;

export type UpdateBodegaDto = Partial<CreateBodegaDto>;
