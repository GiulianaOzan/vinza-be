import { Valoracion } from './model';
import { CreateValoracionDto, UpdateValoracionDto } from './types';
import { errors } from '@/error';
import { User } from '@/users/model';
import { Evento } from '@/evento/model';
import { sequelize } from '@/db';
import redisClient from '@/redis';
import logger from '@/logger';

class ValoracionService {
  private getCacheKey(eventoId: number) {
    return `valoracion:average:${eventoId}`;
  }

  private async invalidateCache(eventoId: number) {
    const key = this.getCacheKey(eventoId);
    await redisClient.del(key);
    logger.info(`Invalidated cache for ${this.getCacheKey(eventoId)}`);
  }

  public async create(dto: CreateValoracionDto) {
    const valoracion = await Valoracion.create(dto);

    await this.invalidateCache(dto.eventoId);

    return valoracion;
  }

  public async findAll() {
    return Valoracion.findAll({ include: [User, Evento] });
  }

  public async findOne(id: number) {
    const valoracion = await Valoracion.findByPk(id, {
      include: [User, Evento],
    });
    if (!valoracion) throw errors.app.valoracion.not_found;

    return valoracion;
  }

  public async update(id: number, dto: UpdateValoracionDto) {
    const valoracion = await Valoracion.findByPk(id);
    if (!valoracion) throw errors.app.valoracion.not_found;

    await valoracion.update(dto);

    await this.invalidateCache(valoracion.eventoId);

    return valoracion;
  }

  public async delete(id: number) {
    const valoracion = await Valoracion.findByPk(id);
    if (!valoracion) throw errors.app.valoracion.not_found;

    await valoracion.destroy();

    await this.invalidateCache(valoracion.eventoId);

    return valoracion;
  }

  public async getAverageByEvento(eventoId: number) {
    const cacheKey = this.getCacheKey(eventoId);

    // Try to get from cache first
    const cachedValue = await redisClient.get(cacheKey);
    if (cachedValue !== null && !isNaN(Number(cachedValue))) {
      logger.info(`Cache hit for ${cacheKey}`);
      return Number(cachedValue);
    }

    logger.info(`Cache miss for ${cacheKey}`);
    // If not in cache, calculate and store
    const result = await Valoracion.findAll({
      where: { eventoId },
      attributes: [[sequelize.fn('AVG', sequelize.col('valor')), 'avgValor']],
      raw: true,
    });
    const avgValor = (result[0] as { avgValor?: string | number })?.avgValor;
    const finalValue = avgValor ? Number(avgValor) : null;

    // Store in cache if we have a value
    if (finalValue !== null) {
      await redisClient.set(cacheKey, finalValue.toString());
    }

    return finalValue;
  }
}

export const valoracionService = new ValoracionService();
export type IValoracionService = typeof valoracionService;
