import { db, DrizzleDatabase } from '@/db';
import { CreateUserDto, UpdateUserDto } from './types';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

class UsersService {
  constructor(private readonly db: DrizzleDatabase) {}

  public async create(dto: CreateUserDto) {
    const [user] = await this.db.insert(users).values(dto).returning();
    return user;
  }

  public async findAll() {
    const users = await this.db.query.users.findMany({
      with: {
        role: true,
      },
    });
    return users;
  }

  public async findOne(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        role: {
          with: {
            permissionsToRoles: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  public async findOneByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        role: {
          with: {
            permissionsToRoles: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  public async update(id: number, dto: UpdateUserDto) {
    const [user] = await this.db
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  public async delete(id: number) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}

export const usersService = new UsersService(db);

export type IUsersService = typeof usersService;
