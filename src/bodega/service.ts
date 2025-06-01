import { sequelize } from '@/db';
import { errors } from '@/error';
import { Sucursal } from '@/sucursal/model';
import { Bodega } from './model';
import { CreateBodegaDto, UpdateBodegaDto } from './types';

class BodegaService {
  public async create(dto: CreateBodegaDto) {
    const transaction = await sequelize.transaction();
    try {
      const bodega = await Bodega.create(dto, { transaction });
      // Create the first sucursal as main
      await Sucursal.create(
        {
          nombre: dto.nombre,
          direccion: 'Principal',
          es_principal: true,
          bodegaId: bodega.id,
        },
        { transaction },
      );
      await transaction.commit();
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
      await bodega.update(dto, { transaction });
      await transaction.commit();
      return bodega;
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
    return bodega;
  }
}

export const bodegaService = new BodegaService();

export type IBodegaService = typeof bodegaService;
