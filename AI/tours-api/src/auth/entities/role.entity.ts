import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
@Unique(['name'])
export class Role {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 30 })
  name: 'admin' | 'editor';

  @ManyToMany(() => User, (u) => u.roles)
  users: User[];
}
