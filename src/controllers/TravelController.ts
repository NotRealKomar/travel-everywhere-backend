import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TravelService } from '../services/travel/TravelService';
import { TravelData } from '../dto/TravelData';
import { JwtWithBodyAuthGuard } from '../guards/JwtWithBodyAuthGuard';
import { Travel } from '../schemas/Travel';
import { UserData } from '../dto/UserData';
import { WaypointData } from '../schemas/partial/WaypointData';
import { TravelModel } from '../models/TravelModel';
import { TravelDetailsData } from '../dto/TravelDetailsData';
import { TravelDetailsModel } from '../models/TravelDetailsModel';
import { TravelModelConverter } from '../converters/TravelModelConverter';
import { TravelDetailsModelConverter } from '../converters/TravelDetailsModelConverter';
import { TravelEditData } from '../dto/TravelEditData';
import { Types } from 'mongoose';
import { TravelEditModel } from '../models/TravelEditModel';
import { TravelListData } from '../dto/TravelListData';

@Controller('/app/travel')
export class TravelController {
  constructor(
    private readonly travelService: TravelService,
    private readonly travelModelConverter: TravelModelConverter,
    private readonly travelDetailsModelConverter: TravelDetailsModelConverter,
  ) {}

  @Post('/save')
  @UseGuards(JwtWithBodyAuthGuard)
  async saveTravel(@Body() body: TravelData | undefined): Promise<boolean> {
    if (body === undefined) {
      throw new Error('Travel data is required');
    }

    return this.travelService.save(
      new Travel({
        title: body.title,
        dates: {
          startDate: body.startDate,
          endDate: body.endDate,
        },
        waypoints: body.waypoints.map(
          (waypoint) =>
            new WaypointData({
              lon: waypoint.lon,
              lat: waypoint.lat,
              label: waypoint.label,
              placeId: waypoint.placeId,
            }),
        ),
        userId: body.userId,
        isPublic: body.isPublic,
      }),
    );
  }

  @Post('/list')
  @UseGuards(JwtWithBodyAuthGuard)
  async travelsList(
    @Body() body: TravelListData | undefined,
  ): Promise<TravelModel[]> {
    if (body === undefined) {
      throw new Error('User data is required');
    }

    return this.travelModelConverter.convertManyToModel(
      await this.travelService.findManyByUser(body.userId, body.searchQuery),
    );
  }

  @Post('/list-active')
  @UseGuards(JwtWithBodyAuthGuard)
  async TravelActiveLise(
    @Body() body: UserData | undefined,
  ): Promise<TravelModel[]> {
    if (body === undefined) {
      throw new Error('Place list data is required');
    }

    return this.travelModelConverter.convertManyToModel(
      await this.travelService.findManyActive(body.userId),
    );
  }

  @Post('/list-popular')
  @UseGuards(JwtWithBodyAuthGuard)
  async TravelPopularList(
    @Body() body: UserData | undefined,
  ): Promise<TravelModel[]> {
    if (body === undefined) {
      throw new Error('Place list data is required');
    }

    return this.travelModelConverter.convertManyToModel(
      await this.travelService.findManyPublic(),
    );
  }

  @Post('/details')
  @UseGuards(JwtWithBodyAuthGuard)
  async travelDetails(
    @Body() body: TravelDetailsData | undefined,
  ): Promise<TravelDetailsModel> {
    if (body === undefined || body.travelId === undefined) {
      throw new Error('Travel details data is required');
    }

    return this.travelDetailsModelConverter.convertToModel(
      await this.travelService.getOneById(body.travelId),
    );
  }

  @Post('/edit-details')
  @UseGuards(JwtWithBodyAuthGuard)
  async travelEditDetails(
    @Body() body: TravelDetailsData | undefined,
  ): Promise<TravelEditModel> {
    if (body === undefined || body.travelId === undefined) {
      throw new Error('Travel data is required');
    }

    return TravelEditModel.createFromEntity(
      await this.travelService.getOneById(body.travelId),
    );
  }

  @Post('/edit')
  @UseGuards(JwtWithBodyAuthGuard)
  async editTravel(@Body() body: TravelEditData | undefined): Promise<boolean> {
    if (body === undefined || body.travelId === undefined) {
      throw new Error('Travel data is required');
    }

    return this.travelService.edit(
      new Travel({
        title: body.title,
        dates: {
          startDate: body.startDate,
          endDate: body.endDate,
        },
        waypoints: body.waypoints.map(
          (waypoint) =>
            new WaypointData({
              lon: waypoint.lon,
              lat: waypoint.lat,
              label: waypoint.label,
              placeId: waypoint.placeId,
            }),
        ),
        userId: body.userId,
        isPublic: body.isPublic,
        id: new Types.ObjectId(body.travelId),
      }),
    );
  }
}
