import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KanbanModule } from './kanban/kanban.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KanbanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
