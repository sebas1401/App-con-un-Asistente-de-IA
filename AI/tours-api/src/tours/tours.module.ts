import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tour]), AuthModule],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
