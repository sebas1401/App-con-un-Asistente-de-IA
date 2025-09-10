import { IsDateString, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateTourDto {
  @IsString() @Length(3, 120) nombre: string;
  @IsString() @Length(2, 120) destino: string;
  @IsString() @Length(10, 1000) descripcion: string;
  @IsNumber() @Min(0) precio: number;
  @IsDateString() fecha_inicio: string;
}
