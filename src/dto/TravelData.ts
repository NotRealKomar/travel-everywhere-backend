import { UserData } from './UserData';
import { WaypointDataModel } from '../models/WaypointDataModel';

export class TravelData extends UserData {
  title: string;
  startDate: Date;
  endDate: Date;
  waypoints: WaypointDataModel[];
  isPublic: boolean;
}
