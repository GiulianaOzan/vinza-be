import config from '@/config';
import { db, DrizzleDatabase } from '@/db';
import { users } from '@/db/schema';
import { errors } from '@/error';
import { rolesService } from '@/rbac/service';
import { usersService } from '@/users/service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtAuthPayload, LoginDto, RegisterDto } from './types';
import { hashPassword } from './auth';
import { AuthenticatedUser, User } from '@/users/types';

export class AuthService {
  constructor(private readonly db: DrizzleDatabase) {}

  public async register(dto: RegisterDto): Promise<AuthenticatedUser> {
    // Initialize required info for the user (roleId)
    const role = await rolesService.create({
      name: dto.name + ':' + dto.email + ':' + new Date().toISOString(),
    });
    const password = await hashPassword(dto.password);

    const [user] = await this.db
      .insert(users)
      .values({ ...dto, roleId: role.id, password })
      .returning();

    // The user can be authenticated immediately with this
    const token = await this.generateAuthToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, token };
  }

  public async login(dto: LoginDto): Promise<AuthenticatedUser> {
    // If more strategies are added must extend this
    const user = await usersService.findOneByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw errors.app.auth.non_valid_credentials;
    }

    const token = await this.generateAuthToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, token };
  }

  private async generateAuthToken(dto: User) {
    const payload: JwtAuthPayload = { sub: dto.id, role: dto.roleId };
    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '15m',
    });

    return token;
  }
}

export const authService = new AuthService(db);
export type IAuthService = typeof authService;
