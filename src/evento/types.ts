import { EventoCreationAttributes } from './model';

export type CreateEventoDto = EventoCreationAttributes;
export type UpdateEventoDto = Partial<CreateEventoDto>;
