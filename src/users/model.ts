import { Rol } from '@/rbac/model';
import { Bodega } from '@/bodega/model';
import {
  BelongsToMany,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

export interface UserAttributes {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  validado?: Date;
  contrasena: string;
  fecha_nacimiento?: Date;
  roles: Rol[];
  bodegaId?: number;
  bodega?: Bodega;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, 'roles' | 'id' | 'bodega' | 'validado'> {
  roles?: Rol['id'][];
  bodegaId?: number;
}

@Table({
  tableName: 'users',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  nombre!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  apellido!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  validado?: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  contrasena!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  fecha_nacimiento?: Date;

  // User can have many roles through HRolUsuario, but only one active at a time
  @BelongsToMany(() => Rol, () => HRolUsuario)
  roles!: Rol[];

  @ForeignKey(() => Bodega)
  @Column({ type: DataType.INTEGER, allowNull: true })
  bodegaId?: number;

  @BelongsTo(() => Bodega)
  bodega?: Bodega;
}

// Intermediate table for User-Rol relationship
@Table({
  tableName: 'h_rol_usuarios',
  paranoid: true,
  createdAt: 'created_at',
  deletedAt: 'deleted_at',
})
export class HRolUsuario extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ForeignKey(() => Rol)
  @Column({ type: DataType.INTEGER, allowNull: false })
  rolId!: number;
}
