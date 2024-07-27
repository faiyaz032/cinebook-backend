import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import qs from 'qs';
import sendResponse from '../../shared/utils/sendResponse';
import HallService from './hall.service';

class HallController {
  private service;
  constructor() {
    this.service = new HallService();
  }

  createHallHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createHall(req.body);

      sendResponse(res, StatusCodes.CREATED, 'Hall created successfully', data);
    } catch (error) {
      next(error);
    }
  };

  //?search=action&filters[duration]=2h&filters[nowShowing]=true&sort=name:asc&page=2&limit=10
  getHallsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { search, sort, page, limit } = req.query;
    // Parse filters using qs library
    const filters = qs.parse(req.query.filters as string);

    try {
      const result = await this.service.getAllHalls({
        search: search as string,
        filters,
        sort: sort as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      sendResponse(res, StatusCodes.OK, 'All halls fetched successfully', result.data, result.pagination);
    } catch (error) {
      next(error);
    }
  };

  getHallByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getHallById(req.params.id);

      sendResponse(res, StatusCodes.OK, 'Hall by id fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  updateHallHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await this.service.updateHall(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Hall updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  deleteHallHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.service.deleteHall(id);

      sendResponse(res, StatusCodes.OK, 'Hall deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export default HallController;
