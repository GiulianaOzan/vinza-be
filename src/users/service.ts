class UsersService {
  public findAll() {
    console.log('WILL IMPLEMENT');
  }
}

export const usersService = new UsersService();

export type IUsersService = typeof usersService;
