import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import SCHEMAS from './schemas';
import { SERVICES } from './services';
import { CONVERTERS } from './converters';
import CONTROLLERS from './controllers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/JwtStrategy';
import { MongoDbConfigService } from './services/config/MongoDbConfigService';

const AUTH_MODULES = [PassportModule, JwtModule, JwtStrategy];
const AUTH_PROVIDERS = [JwtStrategy];

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_AUTH_SOURCE: Joi.string().optional(),
        MONGO_URI: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().required(),
        GEOAPIFY_API_URL: Joi.string().required(),
        GEOAPIFY_API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        new MongoDbConfigService(configService).getConfig(),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(SCHEMAS),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '14d',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: CONTROLLERS,
  providers: [...SERVICES, ...AUTH_PROVIDERS, ...CONVERTERS],
  exports: [...AUTH_MODULES],
})
export class AppModule {}
