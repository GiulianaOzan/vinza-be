import { IEventoService } from './service';
import type { Request, Response } from 'express';
import { createEventoSchema, updateEventoSchema } from './schema';

export class EventoController {
  readonly eventoService;

  constructor(eventoService: IEventoService) {
    this.eventoService = eventoService;
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public getAll(_req: Request, res: Response) {
    this.eventoService
      .findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.json(err));
  }

  public getOne(req: Request, res: Response) {
    this.eventoService
      .findOne(+req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  }

  public create(req: Request, res: Response) {
    createEventoSchema
      .parseAsync(req.body)
      .then((dto) => {
        return this.eventoService
          .create(dto)
          .then((data) => res.json(data))
          .catch((err) => res.json(err));
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  }

  public update(req: Request, res: Response) {
    updateEventoSchema
      .parseAsync(req.body)
      .then((dto) =>
        this.eventoService
          .update(+req.params.id, dto)
          .then((data) => res.json(data))
          .catch((err) => res.json(err)),
      )
      .catch((err) => res.status(400).json({ error: err.message }));
  }

  public delete(req: Request, res: Response) {
    this.eventoService.delete(+req.params.id).then((data) => res.json(data));
  }
}
