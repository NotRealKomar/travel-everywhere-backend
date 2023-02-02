import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtWithBodyAuthGuard } from '../guards/JwtWithBodyAuthGuard';
import { PlaceData } from '../dto/PlaceData';
import { Place } from '../schemas/Place';
import { PlaceService } from '../services/place/PlaceService';
import { UserData } from '../dto/UserData';
import { PlaceModel } from '../models/PlaceModel';
import { PlaceEditData } from '../dto/PlaceEditData';
import { PlaceDetailsData } from '../dto/PlaceDetailsData';
import { PlaceEditModel } from '../models/PlaceEditModel';
import { Types } from 'mongoose';
import { PlaceListData } from '../dto/PlaceListData';

@Controller('/app/place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('/save')
  @UseGuards(JwtWithBodyAuthGuard)
  async savePlace(@Body() body: PlaceData | undefined): Promise<boolean> {
    if (body === undefined) {
      throw new Error('Place data is required');
    }

    return this.placeService.save(
      new Place({
        coordinates: body.placeData,
        description: body.description,
        title: body.title,
        type: body.type,
        userId: body.userId,
        isPublic: body.isPublic,
      }),
    );
  }

  @Post('/list')
  @UseGuards(JwtWithBodyAuthGuard)
  async getPlacesList(
    @Body() body: PlaceListData | undefined,
  ): Promise<PlaceModel[]> {
    if (body === undefined) {
      throw new Error('Place list data is required');
    }

    const response = PlaceModel.createManyFromDocuments(
      await this.placeService.findManyByUser(body.userId, body.searchQuery),
    );

    return response;
  }

  @Post('/list-popular')
  @UseGuards(JwtWithBodyAuthGuard)
  async getPopularPlacesList(
    @Body() body: UserData | undefined,
  ): Promise<PlaceModel[]> {
    if (body === undefined) {
      throw new Error('Place list data is required');
    }

    const response = PlaceModel.createManyFromDocuments(
      await this.placeService.findManyPublic(body.userId),
    );

    return response;
  }

  @Post('/edit-details')
  @UseGuards(JwtWithBodyAuthGuard)
  async placesEditDetails(
    @Body() body: PlaceDetailsData | undefined,
  ): Promise<PlaceEditModel> {
    if (body === undefined || body.placeId === undefined) {
      throw new Error('Place data is required');
    }

    return PlaceEditModel.createFromEntity(
      await this.placeService.getOneById(body.placeId),
    );
  }

  @Post('/edit')
  @UseGuards(JwtWithBodyAuthGuard)
  async editPlace(@Body() body: PlaceEditData | undefined): Promise<boolean> {
    if (body === undefined || body.placeId === undefined) {
      throw new Error('Place data is required');
    }

    return this.placeService.edit(
      new Place({
        coordinates: body.placeData,
        description: body.description,
        title: body.title,
        type: body.type,
        userId: body.userId,
        isPublic: body.isPublic,
        id: new Types.ObjectId(body.placeId),
      }),
    );
  }
}
