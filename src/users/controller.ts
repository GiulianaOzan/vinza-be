import { IUsersService } from '@/users/service';
import type { Request, Response } from 'express';
import { createUserSchema, UpdateUserSchema } from './schema';
export class UsersController {
  readonly usersService;

  constructor(usersService: IUsersService) {
    this.usersService = usersService;

    // Keep binding this to the methods to avoid problems with
    // the this reference inside callbacks
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getMe = this.getMe.bind(this);
  }

  public getAll(_req: Request, res: Response) {
    this.usersService.findAll().then((data) => res.json(data));
  }

  public getOne(req: Request, res: Response) {
    this.usersService.findOne(+req.params.id).then((data) => res.json(data));
  }

  public create(req: Request, res: Response) {
    createUserSchema
      .parseAsync(req.body)
      .then((dto) =>
        this.usersService
          .create(dto)
          .then((data) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { contrasena, ...userWithoutPassword } = data.dataValues;
            res.json(userWithoutPassword);
          })
          .catch((err) => res.json(err)),
      )
      .catch((err) => res.status(400).json({ error: err.message }));
  }

  public update(req: Request, res: Response) {
    UpdateUserSchema.parseAsync(req.body)
      .then((dto) =>
        this.usersService
          .update(+req.params.id, dto)
          .then((data) => res.json(data))
          .catch((err) => res.status(400).json({ error: err.message })),
      )
      // TODO: Handle zod errors
      .catch((err) => res.status(400).json({ error: err.message }));
  }

  public delete(req: Request, res: Response) {
    this.usersService.delete(+req.params.id).then((data) => res.json(data));
  }

  public getMe(req: Request, res: Response) {
    this.usersService.findOne(+req.user!.sub).then((data) => res.json(data));
  }
}
