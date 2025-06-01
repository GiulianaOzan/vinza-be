import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@/users/model';
import { AuditEvents, AuditEventType } from './enum';

export interface AuditAttributes {
  id?: number;
  valor: object;
  createdAt?: Date;
  deletedAt?: Date | null;
  tipoEvento: AuditEventType;
  userId: number;
}

export type AuditCreationAttributes = Omit<
  AuditAttributes,
  'id' | 'createdAt' | 'deletedAt'
>;

@Table({
  tableName: 'audits',
  paranoid: true,
})
export class Audit extends Model<AuditAttributes> {
  @Column({ type: DataType.JSON, allowNull: false })
  valor!: object;

  @Column({ type: DataType.ENUM(...AuditEvents), allowNull: false })
  tipoEvento!: AuditEventType;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date | null;
}
