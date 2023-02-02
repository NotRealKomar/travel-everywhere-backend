import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Travel,
  TravelDocument,
  TravelSchemaModel,
} from '../../schemas/Travel';
import { endOfToday, startOfToday } from 'date-fns';
import { RouteService } from '../geodata/RouteService';

@Injectable()
export class TravelService {
  constructor(
    @InjectModel(TravelSchemaModel.name)
    private readonly travelModel: Model<TravelDocument>,
    private readonly routeService: RouteService,
  ) {}

  async getOneById(id: string): Promise<Travel> {
    const travel = await this.travelModel.findById(id);

    if (travel === null || travel === undefined) {
      throw new Error(`Cannot find travel with id#${id}`);
    }

    return travel;
  }

  async findManyByUser(
    userId: string,
    searchQuery?: string | null,
  ): Promise<Travel[]> {
    const travels =
      searchQuery === null || searchQuery === undefined
        ? await this.travelModel.find({ userId }).sort({ createdAt: 'desc' })
        : await this.travelModel
            .find({
              $and: [
                { userId },
                { title: { $regex: `.*${searchQuery}.*`, $options: 'i' } },
              ],
            })
            .sort({ createdAt: 'desc' });

    if (travels.length === 0) {
      return [];
    }

    return travels;
  }

  async findManyActive(userId: string): Promise<Travel[]> {
    const travels = await this.travelModel.find({
      $and: [
        {
          userId,
        },
        {
          'dates.startDate': {
            $lte: new Date(endOfToday()),
          },
        },
        {
          'dates.endDate': {
            $gt: new Date(startOfToday()),
          },
        },
      ],
    });

    if (travels.length === 0) {
      return [];
    }

    return travels;
  }

  async findManyPublic(): Promise<Travel[]> {
    const travels = await this.travelModel.find({ isPublic: true }).limit(5);

    if (travels.length === 0) {
      return [];
    }

    return travels;
  }

  async save(travel: Travel): Promise<boolean> {
    const path = await this.routeService.getRouting({
      waypoints: travel.waypoints.map((waypoint) => ({
        lat: waypoint.lat.toString(),
        lon: waypoint.lon.toString(),
      })),
      mode: 'drive',
    });

    travel.path = { ...path };

    const response = await this.travelModel.create(travel);

    if (!response) {
      return false;
    }

    return true;
  }

  async edit(travel: Travel): Promise<boolean> {
    const path = await this.routeService.getRouting({
      waypoints: travel.waypoints.map((waypoint) => ({
        lat: waypoint.lat.toString(),
        lon: waypoint.lon.toString(),
      })),
      mode: 'drive',
    });

    travel.path = { ...path };

    const response = await this.travelModel.findByIdAndUpdate(
      travel._id,
      travel,
    );

    if (!response) {
      return false;
    }

    return true;
  }
}
