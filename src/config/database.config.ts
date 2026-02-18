import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const isTrue = (value?: string): boolean | undefined => {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return undefined;
};

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const databaseUrl = configService.get<string>('DATABASE_URL');
  const host =
    configService.get<string>('DB_HOST') ??
    configService.get<string>('PGHOST') ??
    'localhost';
  const port = Number(
    configService.get<string>('DB_PORT') ??
      configService.get<string>('PGPORT') ??
      5432,
  );
  const username =
    configService.get<string>('DB_USERNAME') ??
    configService.get<string>('PGUSER') ??
    'postgres';
  const password =
    configService.get<string>('DB_PASSWORD') ??
    configService.get<string>('PGPASSWORD') ??
    'postgres';
  const database =
    configService.get<string>('DB_NAME') ??
    configService.get<string>('PGDATABASE') ??
    'bojovic_dispatch';

  const dbSsl = isTrue(configService.get<string>('DB_SSL'));
  const pgSslMode = configService.get<string>('PGSSLMODE')?.toLowerCase();
  const sslFromPgMode =
    pgSslMode === 'require' ||
    pgSslMode === 'verify-ca' ||
    pgSslMode === 'verify-full';
  const isRailwayHost =
    host.includes('railway.app') ||
    host.includes('rlwy.net') ||
    host.includes('railway.internal');
  const useSsl = dbSsl ?? (sslFromPgMode || isRailwayHost || Boolean(databaseUrl));

  return {
    type: 'postgres',
    ...(databaseUrl
      ? { url: databaseUrl }
      : { host, port, username, password, database }),
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    autoLoadEntities: true,
    synchronize: nodeEnv === 'development',
    migrationsRun: nodeEnv === 'production',
    logging: nodeEnv === 'development',
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'typeorm_migrations',
  };
};
