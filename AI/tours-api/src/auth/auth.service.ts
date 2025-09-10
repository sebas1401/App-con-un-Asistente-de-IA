import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email ya registrado');

    const password = await bcrypt.hash(dto.password, 10);
    const defaultRole = await this.rolesRepo.findOne({ where: { name: 'editor' as any } });

    const user = this.usersRepo.create({
      nombre: dto.nombre,
      email: dto.email,
      password,
      roles: defaultRole ? [defaultRole] : [],
    });
    await this.usersRepo.save(user);
    return this.buildToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    return this.buildToken(user);
  }

  private buildToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((r) => ({ id: r.id, name: r.name })),
    };
    return { access_token: this.jwt.sign(payload) };
  }
}
