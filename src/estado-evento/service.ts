import { Transaction } from 'sequelize';
import { EstadoEvento } from './model';
import { CreateEstadoEventoDto, UpdateEstadoEventoDto } from './types';

class EstadoEventoService {
  public async create(dto: CreateEstadoEventoDto) {
    const estadoEvento = await EstadoEvento.create(dto);
    return estadoEvento;
  }

  public findAll() {
    return EstadoEvento.findAll();
  }

  public async findOne(id: number, transaction?: Transaction) {
    const estadoEvento = await EstadoEvento.findByPk(id, { transaction });
    if (!estadoEvento) throw { message: 'EstadoEvento not found', status: 404 };
    return estadoEvento;
  }

  public async update(id: number, dto: UpdateEstadoEventoDto) {
    const estadoEvento = await EstadoEvento.findByPk(id);
    if (!estadoEvento) throw { message: 'EstadoEvento not found', status: 404 };
    const updatedEstadoEvento = await estadoEvento.update(dto, {
      returning: true,
    });
    return updatedEstadoEvento;
  }

  public async delete(id: number) {
    const estadoEvento = await EstadoEvento.findByPk(id);
    if (!estadoEvento) throw { message: 'EstadoEvento not found', status: 404 };
    await estadoEvento.destroy();
    return estadoEvento;
  }
}

export const estadoEventoService = new EstadoEventoService();
export type IEstadoEventoService = typeof estadoEventoService;
