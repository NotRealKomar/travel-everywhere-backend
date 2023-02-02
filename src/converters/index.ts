import { Provider } from '@nestjs/common';
import { TravelDetailsModelConverter } from './TravelDetailsModelConverter';
import { TravelModelConverter } from './TravelModelConverter';

export const CONVERTERS: Provider[] = [
  TravelModelConverter,
  TravelDetailsModelConverter,
];
