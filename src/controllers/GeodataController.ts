import { UseGuards, Get, Query, Controller, Post, Body } from '@nestjs/common';
import { AutocompleteService } from '../services/geodata/AutocompleteService';
import { ReadonlyJwtAuthGuard } from '../guards/ReadonlyJwtAuthGuard';
import { RouteService, WaypointType } from '../services/geodata/RouteService';
import { AutocompleteModel } from '../models/AutocompleteModel';
import { RouteModel } from '../models/RouteModel';

@Controller('/app/places')
export class GeodataController {
  constructor(
    private readonly autocompleteService: AutocompleteService,
    private readonly routeService: RouteService,
  ) {}

  @UseGuards(ReadonlyJwtAuthGuard)
  @Get('/autocomplete')
  async getAutocomplete(
    @Query() query: { value: string } | undefined,
  ): Promise<AutocompleteModel[]> {
    if (query === undefined || query.value === undefined) {
      throw new Error('value cannot be undefined');
    }

    return this.autocompleteService.getAutocomplete(query.value);
  }

  @UseGuards(ReadonlyJwtAuthGuard)
  @Post('/routing')
  async getRouting(
    @Body() data: { waypoints: WaypointType[] | undefined } | undefined,
  ): Promise<RouteModel> {
    if (data === undefined || data.waypoints === undefined) {
      throw new Error('value cannot be undefined');
    }

    return this.routeService.getRouting({
      waypoints: data.waypoints,
      mode: 'drive',
    });
  }
}
