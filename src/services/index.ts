import { Provider } from '@nestjs/common';
import { AuthService } from './auth/AuthService';
import { PasswordService } from './auth/PasswordService';
import { PlacesUrlService } from './PlacesUrlService';
import { AutocompleteService } from './geodata/AutocompleteService';
import { UserService } from './user/UserService';
import { RouteService } from './geodata/RouteService';
import { BoundaryService } from './geodata/BoundaryService';
import { TravelService } from './travel/TravelService';
import { PlaceService } from './place/PlaceService';
import { TravelToCalendarService } from './travel/TravelToCalendarService';
import { LikeService } from './like/LikeService';

export const SERVICES: Provider[] = [
  AuthService,
  UserService,
  PasswordService,
  PlacesUrlService,
  AutocompleteService,
  RouteService,
  BoundaryService,
  TravelService,
  PlaceService,
  TravelToCalendarService,
  LikeService,
];
