import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtWithBodyAuthGuard } from '../guards/JwtWithBodyAuthGuard';
import { LikeData } from '../dto/LikeData';
import { LikeService } from '../services/like/LikeService';
import { Like } from '../schemas/Like';
import { LikesResponseModel } from '../models/LikesResponseModel';

@Controller('/app/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/add')
  @UseGuards(JwtWithBodyAuthGuard)
  async like(@Body() body: LikeData | undefined): Promise<LikesResponseModel> {
    if (body === undefined) {
      throw new Error('Like data is required');
    }

    const like = await this.likeService.findOneByUserAndEntity(
      body.userId,
      body.placeId ?? body.travelId ?? '',
    );

    if (like !== null) {
      throw new Error('Like model does exist');
    }

    return LikesResponseModel.createFromResponse(
      await this.likeService.save(
        new Like({
          userId: body.userId,
          placeId: body.placeId ?? null,
          travelId: body.travelId ?? null,
        }),
      ),
    );
  }

  @Post('/remove')
  @UseGuards(JwtWithBodyAuthGuard)
  async unlike(
    @Body() body: LikeData | undefined,
  ): Promise<LikesResponseModel> {
    if (body === undefined) {
      throw new Error('Like data is required');
    }

    const like = await this.likeService.findOneByUserAndEntity(
      body.userId,
      body.placeId ?? body.travelId ?? '',
    );

    if (like === null) {
      throw new Error('Like model does not exist');
    }

    return LikesResponseModel.createFromResponse(
      await this.likeService.remove(body.userId, like._id.toString()),
    );
  }

  @Post('/count')
  @UseGuards(JwtWithBodyAuthGuard)
  async likesCount(
    @Body() body: LikeData | undefined,
  ): Promise<LikesResponseModel> {
    if (body === undefined) {
      throw new Error('Like data is required');
    }

    return LikesResponseModel.createFromResponse(
      await this.likeService.getCountAndIsLikedByEntityId(
        body.userId,
        body.placeId ?? body.travelId ?? '',
      ),
    );
  }
}
