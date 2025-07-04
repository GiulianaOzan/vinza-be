import { auditEmitter } from '@/audit/event';
import { hashPassword } from '@/auth/auth';
import { sequelize } from '@/db';
import { errors } from '@/error';
import logger from '@/logger';
import { Permiso, Rol } from '@/rbac/model';
import { Op } from 'sequelize';
import { User } from './model';
import { CreateUserDto, UpdateUserDto } from './types';

class UsersService {
  public async create(dto: CreateUserDto) {
    const { contrasena, roles, ...rest } = dto;
    const transaction = await sequelize.transaction();
    try {
      const hashed = await hashPassword(contrasena);
      let user = await User.create(
        { ...rest, contrasena: hashed },
        { transaction },
      );

      if (roles && roles.length > 0) {
        await user.$set('roles', roles, { transaction });
        user = await user.save({ transaction, returning: true });
      }

      auditEmitter.emitEntry({
        tipoEvento: 'user:create',
        valor: user.dataValues,
      });

      await transaction.commit();
      return this.findOne(user.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async findAll() {
    const users = await User.findAll();
    return users;
  }

  public async findOne(id: number) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['contrasena'],
      },
      include: [
        {
          model: Rol,
          as: 'roles',
          include: [{ model: Permiso, as: 'permisos' }],
        },
      ],
    });
    if (!user) {
      logger.debug(`User not found with id ${id}`);
      throw errors.app.user.not_found;
    }
    return user;
  }

  public async findOneByEmail(email: string) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Rol, as: 'roles' }],
    });
    if (!user) {
      throw errors.app.user.not_found;
    }
    return user;
  }

  public async update(id: number, dto: UpdateUserDto) {
    const transaction = await sequelize.transaction();
    try {
      const { roles, ...rest } = dto;
      // If roles are provided in dto, update the user's roles accordingly
      if (roles && roles.length > 0) {
        // Validate that all provided roles exist
        const foundRoles = await Rol.findAll({
          where: { id: { [Op.in]: roles } },
          transaction,
        });

        if (foundRoles.length !== roles.length) {
          throw errors.app.user.roles_not_found;
        }

        // Find the user
        const user = await User.findByPk(id, {
          include: [{ model: Rol, as: 'roles' }],
          transaction,
        });
        if (!user) {
          throw errors.app.user.not_found;
        }

        // Get current role ids
        const currentRoleIds = user.roles
          ? user.roles.map((r: Rol) => r.id)
          : [];

        // Only update if the new roles are different from the current ones
        // (Assuming only one active role at a time, so compare arrays)
        const isDifferent =
          currentRoleIds.length !== roles.length ||
          !currentRoleIds.every((id) => roles.includes(id));

        if (isDifferent) {
          // Remove previous relations and set new ones
          await user.$set('roles', roles, { transaction });
        }

        // Remove roles from dto so they are not updated as a field
        delete dto.roles;
      }
      const [user] = (
        await User.update(rest, {
          where: { id },
          transaction,
          returning: true,
        })
      )[1];

      await transaction.commit();
      auditEmitter.emitEntry({
        tipoEvento: 'user:update',
        valor: user.dataValues,
      });
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw errors.app.user.not_found;
    }
    await user.destroy();
    auditEmitter.emitEntry({
      tipoEvento: 'user:delete',
      valor: user.dataValues,
    });
    return user;
  }
}

export const usersService = new UsersService();

export type IUsersService = typeof usersService;
