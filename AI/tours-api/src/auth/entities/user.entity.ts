import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 120 }) nombre: string;

  @Column({ length: 160 }) email: string;

  @Column() password: string;

  @ManyToMany(() => Role, (r) => r.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
