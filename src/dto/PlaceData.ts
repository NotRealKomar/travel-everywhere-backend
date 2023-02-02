import { UserData } from './UserData';
import { PlaceType } from '../enums/PlaceType';
import { CoordinatesData } from './partials/CoordinatesData';

export class PlaceData extends UserData {
  placeData: CoordinatesData;
  title: string;
  description: string;
  type: PlaceType;
  isPublic: boolean;
}
