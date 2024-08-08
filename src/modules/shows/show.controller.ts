import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import qs from 'qs';
import sendResponse from '../../shared/utils/sendResponse';
import ShowService from './show.service';

class ShowController {
  private service;

  constructor() {
    this.service = new ShowService();
  }

  createShowHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createShow(req.body);

      sendResponse(res, StatusCodes.CREATED, 'Show created successfully', data);
    } catch (error) {
      next(error);
    }
  };

  //?search=action&filters[duration]=2h&filters[nowShowing]=true&sort=name:asc&page=2&limit=10
  getShowsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { search, sort, page, limit } = req.query;
    // Parse filters using qs library
    const filters = qs.parse(req.query.filters as string);

    try {
      const result = await this.service.getAllShows({
        search: search as string,
        filters,
        sort: sort as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      sendResponse(res, StatusCodes.OK, 'All shows fetched successfully', result.data, result.pagination);
    } catch (error) {
      next(error);
    }
  };

  getShowByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getShowById(req.params.id);

      sendResponse(res, StatusCodes.OK, 'Show by id fetched successfully', result);
    } catch (error) {
      next(error);
    }
  };

  updateShowHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await this.service.updateShow(id, req.body);

      sendResponse(res, StatusCodes.OK, 'Show updated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  deleteShowHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.service.deleteShow(id);

      sendResponse(res, StatusCodes.OK, 'Show deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export default ShowController;
