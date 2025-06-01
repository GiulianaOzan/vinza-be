import { auditEmitter } from '@/audit/event';
import { sequelize } from '@/db';
import { errors } from '@/error';
import { sucursalService } from '@/sucursal/service';
import { Bodega } from './model';
import { CreateBodegaDto, UpdateBodegaDto } from './types';

class BodegaService {
  public async create(dto: CreateBodegaDto) {
    const transaction = await sequelize.transaction();
    try {
      const bodega = await Bodega.create(dto, { transaction });
      // Create the first sucursal as main
      sucursalService.create(
        {
          nombre: dto.nombre,
          direccion: 'Principal',
          es_principal: true,
          bodegaId: bodega.id,
        },
        transaction,
      );

      await transaction.commit();

      auditEmitter.emitEntry({
        tipoEvento: 'bodega:create',
        valor: bodega.dataValues,
      });
      return bodega;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async findAll() {
    return Bodega.findAll();
  }

  public async findOne(id: number) {
    const bodega = await Bodega.findByPk(id);
    if (!bodega) {
      throw errors.app.bodega.not_found;
    }
    return bodega;
  }

  public async update(id: number, dto: UpdateBodegaDto) {
    const transaction = await sequelize.transaction();
    try {
      const bodega = await Bodega.findByPk(id, { transaction });
      if (!bodega) {
        throw errors.app.bodega.not_found;
      }
      const updatedBodega = await bodega.update(dto, {
        transaction,
        returning: true,
      });
      await transaction.commit();

      auditEmitter.emitEntry({
        tipoEvento: 'bodega:update',
        valor: updatedBodega.dataValues,
      });
      return updatedBodega;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(id: number) {
    const bodega = await Bodega.findByPk(id);
    if (!bodega) {
      throw errors.app.bodega.not_found;
    }
    await bodega.destroy();

    auditEmitter.emitEntry({
      tipoEvento: 'bodega:delete',
      valor: bodega.dataValues,
    });
    return bodega;
  }
}

export const bodegaService = new BodegaService();

export type IBodegaService = typeof bodegaService;
