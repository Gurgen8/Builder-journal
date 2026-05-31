import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { WorkTypesModule } from './modules/work-types/work-types.module';
import { WorkLogsModule } from './modules/work-logs/work-logs.module';

@Module({
  imports: [DatabaseModule, WorkTypesModule, WorkLogsModule],
})
export class AppModule {}
