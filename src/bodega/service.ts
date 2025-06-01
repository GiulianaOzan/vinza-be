import { Bodega } from './model';
import { CreateBodegaDto, UpdateBodegaDto } from './types';
import { Rol } from '@/rbac/model';
import { User } from '@/users/model';
import { sequelize } from '@/db';

const bodegaNotFoundError = { message: 'Bodega not found', status: 404 };

class BodegaService {
  public async create(dto: CreateBodegaDto) {
    const bodega = await Bodega.create(dto);

    return bodega;
  }

  public async findAll() {
    return await Bodega.findAll();
  }

  public async findOne(id: number) {
    const bodega = await Bodega.findByPk(id, {
      include: [
        { model: Rol, as: 'roles' },
        { model: User, as: 'users' },
      ],
    });
    if (!bodega) {
      throw bodegaNotFoundError;
    }
    return bodega;
  }

  public async update(id: number, dto: UpdateBodegaDto) {
    const transaction = await sequelize.transaction();
    try {
      const bodega = await Bodega.findByPk(id, { transaction });
      if (!bodega) {
        throw bodegaNotFoundError;
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
      throw bodegaNotFoundError;
    }
    await bodega.destroy();
    return bodega;
  }
}

export const bodegaService = new BodegaService();

export type IBodegaService = typeof bodegaService;
