import config from '@/config';
import { db, sequelize } from '@/db';
import { errors } from '@/error';
import { User, UserAttributes, UserCreationAttributes } from '@/users/model';
import { usersService } from '@/users/service';
import { AuthenticatedUser } from '@/users/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtAuthPayload, LoginDto, RegisterDto } from './types';
import { permissionsService, rolesService } from '@/rbac/service';
import { hashPassword } from './auth';

export class AuthService {
  constructor(private readonly db: db) {}

  public async register(dto: RegisterDto): Promise<AuthenticatedUser> {
    // // Initialize required info for the user (roleId)
    // TODO: Add a default role to the user
    // TODO: Add a default permission to the user
    const role = await this.createDefaultRole();
    const password = await hashPassword(dto.password);
    const user = await User.create({
      nombre: dto.name,
      apellido: dto.name, // You might want to add a lastname field to your DTO
      email: dto.email,
      contrasena: password,
      roles: [role.id],
    } as UserCreationAttributes);
    // The user can be authenticated immediately with this
    const token = this.generateAuthToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena: _, ...userWithoutPassword } = user.dataValues;

    return { ...userWithoutPassword, token };
  }

  public async login(dto: LoginDto): Promise<AuthenticatedUser> {
    // If more strategies are added must extend this
    const user = await usersService.findOneByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.contrasena))) {
      throw errors.app.auth.non_valid_credentials;
    }

    const token = this.generateAuthToken(user.dataValues);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena: _, ...userWithoutPassword } = user.dataValues;

    return { ...userWithoutPassword, token };
  }

  private async createDefaultRole() {
    const role = await rolesService.create({
      nombre: 'ADMIN',
    });
    const permissions = await permissionsService.findAll();
    await rolesService.update(role.id, {
      permisos: permissions.map((p) => p.id),
    });
    return role;
  }

  private generateAuthToken(dto: UserAttributes) {
    const payload: JwtAuthPayload = { user: dto.id, role: dto.roles[0].id };
    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '24h',
    });
    return token;
  }
}

export const authService = new AuthService(sequelize);
export type IAuthService = typeof authService;
