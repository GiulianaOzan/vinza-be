import { Request, Response } from 'express';
import { IAuthService } from './service';

export class AuthController {
  constructor(private readonly authService: IAuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  public async register(req: Request, res: Response) {
    this.authService
      .register(req.body)
      .then((user) => res.json(user))
      .catch((e) => res.json(e));
  }

  public async login(req: Request, res: Response) {
    this.authService
      .login(req.body)
      .then((response) => {
        res.json(response);
      })
      .catch((e) => res.json(e));
  }
}
