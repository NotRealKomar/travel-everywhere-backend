import { ConfigService } from '@nestjs/config';

export class MongoDbConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig() {
    let config: object = {
      uri: this.configService.get<string>('MONGO_URI'),
      dbName: this.configService.get<string>('MONGO_DATABASE'),
      auth: {
        username: this.configService.get<string>('MONGO_USERNAME'),
        password: this.configService.get<string>('MONGO_PASSWORD'),
      },
    };

    const isLocalEnv =
      this.configService.get<string>('NODE_ENV') === 'development';

    if (isLocalEnv === true) {
      const authSource = this.configService.get<string>('MONGO_AUTH_SOURCE');

      if (authSource !== '' || authSource !== undefined) {
        config = {
          ...config,
          authSource: this.configService.get<string>('MONGO_AUTH_SOURCE'),
        };
      }
    }

    return config;
  }
}
