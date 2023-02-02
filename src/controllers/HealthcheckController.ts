import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  @Get('/healthcheck')
  async getHealthcheck(): Promise<string> {
    return 'OK';
  }
}
