import { errors } from '@/error';
import { Evento } from './model';
import { CreateEventoDto, UpdateEventoDto } from './types';
import { auditEmitter } from '@/audit/event';
import { estadoEventoService } from '@/estado-evento/service';
import { sequelize } from '@/db';

class EventoService {
  public async create(dto: CreateEventoDto) {
    const transaction = await sequelize.transaction();
    try {
      let evento = await Evento.create(dto, { transaction });

      if (dto.estadoId) {
        const estadoEvento = await estadoEventoService.findOne(
          dto.estadoId,
          transaction,
        );
        if (!estadoEvento) throw errors.app.evento.estado_not_found;
        await evento.$set('estados', [estadoEvento.id], { transaction });
        evento = await evento.save({ transaction, returning: true });
      }

      await transaction.commit();
      auditEmitter.emitEntry({
        tipoEvento: 'evento:create',
        valor: evento.dataValues,
      });
      return evento;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public findAll() {
    return Evento.findAll();
  }

  public async findOne(id: number) {
    const evento = await Evento.findByPk(id);
    if (!evento) throw errors.app.evento.not_found;

    return evento;
  }

  public async update(id: number, dto: UpdateEventoDto) {
    const evento = await Evento.findByPk(id);
    if (!evento) throw errors.app.evento.not_found;
    const updatedEvento = await evento.update(dto, { returning: true });

    auditEmitter.emitEntry({
      tipoEvento: 'evento:update',
      valor: updatedEvento.dataValues,
    });
    return updatedEvento;
  }

  public async delete(id: number) {
    const evento = await Evento.findByPk(id);
    if (!evento) throw errors.app.evento.not_found;
    await evento.destroy();

    auditEmitter.emitEntry({
      tipoEvento: 'evento:delete',
      valor: evento.dataValues,
    });
    return evento;
  }
}

export const eventoService = new EventoService();
export type IEventoService = typeof eventoService;
