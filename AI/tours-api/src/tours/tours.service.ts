import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
  constructor(@InjectRepository(Tour) private repo: Repository<Tour>) {}

  async create(dto: CreateTourDto) {
    const entity = this.repo.create({
      ...dto,
      fecha_inicio: new Date(dto.fecha_inicio),
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const tour = await this.repo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException('Tour no encontrado');
    return tour;
  }

  async update(id: string, dto: UpdateTourDto) {
    const tour = await this.findOne(id);

    // construimos el patch de forma segura
    const patch: Partial<Tour> = {
      ...dto,
      ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio as any) }),
    };

    Object.assign(tour, patch);
    return this.repo.save(tour);
  }

  async remove(id: string) {
    const tour = await this.findOne(id);
    await this.repo.remove(tour);
    return { deleted: true };
  }
}

