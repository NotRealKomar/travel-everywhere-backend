import { GetCountAndIsLikedByEntityIdResponse } from '../services/like/LikeService';

type CreateArgs = {
  readonly likesCount: number;
  readonly isLiked: boolean;
};

export class LikesResponseModel {
  readonly likesCount: number;

  readonly isLiked: boolean;

  constructor({ isLiked, likesCount }: CreateArgs) {
    this.isLiked = isLiked;
    this.likesCount = likesCount;
  }

  static createFromResponse(response: GetCountAndIsLikedByEntityIdResponse) {
    return new this({
      isLiked: response.isLiked,
      likesCount: response.likesCount,
    });
  }
}
