import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from '../common/guards/policies.guard';
import { CheckPolicies } from '../common/decorators/check-policies.decorator';

@Controller('tours')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'Tour'))
  create(@Body() dto: CreateTourDto) {
    return this.toursService.create(dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'Tour'))
  findAll() {
    return this.toursService.findAll();
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'Tour'))
  update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.toursService.update(id, dto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'Tour'))
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }
}
