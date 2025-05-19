import { IUsersService } from '@/users/service';
import type { Request, Response } from 'express';
export class UsersController {
  readonly usersService;

  constructor(usersService: IUsersService) {
    this.usersService = usersService;

    // Keep binding this to the methods to avoid problems with
    // the this reference inside callbacks
    this.getAll = this.getAll.bind(this);
  }

  public getAll(_req: Request, res: Response) {
    this.usersService.findAll();
    res.json({ ASD: 'ASD' });
  }
}
