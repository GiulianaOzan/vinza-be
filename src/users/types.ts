export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  validated?: Date | null;
};

export type AuthenticatedUser = Omit<User, 'password'> & {
  token: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  roleId: number;
  /**
   * Provide this field if the user is being created by another admin, without register process
   */
  validated?: Date;
};

export type UpdateUserDto = Partial<CreateUserDto>;
