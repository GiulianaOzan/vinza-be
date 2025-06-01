import { errors } from '@/error';
import { Sucursal } from './model';
import { CreateSucursalDto, UpdateSucursalDto } from './types';
import { sequelize } from '@/db';

class SucursalService {
  public async create(dto: CreateSucursalDto) {
    // If es_principal is true, set all others in the same bodega to false
    if (dto.es_principal) {
      await Sucursal.update(
        { es_principal: false },
        { where: { bodegaId: dto.bodegaId } },
      );
    }
    const sucursal = await Sucursal.create(dto);
    return sucursal;
  }

  public findAll() {
    return Sucursal.findAll();
  }

  public async findOne(id: number) {
    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) throw errors.app.sucursal.not_found;
    return sucursal;
  }

  public async update(id: number, dto: UpdateSucursalDto) {
    const transaction = await sequelize.transaction();
    try {
      const sucursal = await Sucursal.findByPk(id, { transaction });
      if (!sucursal) throw errors.app.sucursal.not_found;
      if (dto.bodegaId && dto.bodegaId !== sucursal.bodegaId) {
        throw { message: 'Cannot change bodega of a sucursal', status: 400 };
      }
      if (dto.es_principal) {
        await Sucursal.update(
          { es_principal: false },
          { where: { bodegaId: sucursal.bodegaId }, transaction },
        );
      }
      await sucursal.update(dto, { transaction });
      await transaction.commit();
      return sucursal;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(id: number) {
    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) throw errors.app.sucursal.not_found;
    await sucursal.destroy();
    return sucursal;
  }
}

export const sucursalService = new SucursalService();
export type ISucursalService = typeof sucursalService;
