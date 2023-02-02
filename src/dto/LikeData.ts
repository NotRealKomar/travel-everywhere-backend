import { UserData } from '../dto/UserData';

export class LikeData extends UserData {
  placeId?: string | null;
  travelId?: string | null;
}
