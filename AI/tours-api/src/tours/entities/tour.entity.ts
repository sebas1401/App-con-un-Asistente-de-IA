import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 120 }) nombre: string;
  @Column({ length: 120 }) destino: string;
  @Column({ type: 'text' }) descripcion: string;
  @Column('decimal', { precision: 10, scale: 2 }) precio: number;
  @Column({ type: 'timestamp' }) fecha_inicio: Date;
}
