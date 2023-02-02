import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument, LikeSchemaModel } from '../../schemas/Like';

export type GetCountAndIsLikedByEntityIdResponse = {
  likesCount: number;
  isLiked: boolean;
};

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(LikeSchemaModel.name)
    private readonly likeModel: Model<LikeDocument>,
  ) {}

  async getCountAndIsLikedByEntityId(
    userId: string,
    entityId: string,
  ): Promise<GetCountAndIsLikedByEntityIdResponse> {
    const likesCount = await this.likeModel.count({
      $or: [{ placeId: entityId }, { travelId: entityId }],
    });

    const isLiked =
      (await this.findOneByUserAndEntity(userId, entityId)) !== null;

    return {
      isLiked,
      likesCount,
    };
  }

  async save(like: Like): Promise<GetCountAndIsLikedByEntityIdResponse> {
    const response = await this.likeModel.create(like);

    if (!response) {
      throw new Error("Can't add entity");
    }

    return this.getCountAndIsLikedByEntityId(
      like.userId,
      like.placeId ?? like.travelId ?? '',
    );
  }

  async remove(
    userId: string,
    likeId: string,
  ): Promise<GetCountAndIsLikedByEntityIdResponse> {
    const response = await this.likeModel.findByIdAndDelete(likeId);

    if (!response) {
      throw new Error("Can't remove entity");
    }

    return this.getCountAndIsLikedByEntityId(
      userId,
      response.placeId ?? response.travelId ?? '',
    );
  }

  async findOneByUserAndEntity(
    userId: string,
    entityId: string,
  ): Promise<Like | null> {
    const response = this.likeModel.findOne({
      userId,
      $or: [{ placeId: entityId }, { travelId: entityId }],
    });

    if (!response) {
      return null;
    }

    return response;
  }
}
