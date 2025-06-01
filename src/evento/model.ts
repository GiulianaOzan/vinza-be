import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { HEstadoEvento } from '@/estado-evento/model';
import { Sucursal } from '@/sucursal/model';
import { EstadoEvento } from '@/estado-evento/model';

export interface EventoAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  cupo: string;
  sucursalId: number;
  estados: EstadoEvento[];
}

export type EventoCreationAttributes = Omit<
  EventoAttributes,
  'id' | 'estados'
> & {
  estadoId: EstadoEvento['id'];
};

@Table({
  tableName: 'eventos',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class Evento extends Model<EventoAttributes, EventoCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  nombre!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  descripcion!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  cupo!: string;

  @ForeignKey(() => Sucursal)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sucursalId!: number;

  @BelongsTo(() => Sucursal)
  sucursal?: Sucursal;

  @BelongsToMany(() => EstadoEvento, () => HEstadoEvento)
  estados!: EstadoEvento[];
}
