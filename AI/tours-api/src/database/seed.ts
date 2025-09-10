import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Role } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);

  const adminRole = await roleRepo.findOne({ where: { name: 'admin' as any } }) ??
    await roleRepo.save(roleRepo.create({ name: 'admin' as any }));
  const editorRole = await roleRepo.findOne({ where: { name: 'editor' as any } }) ??
    await roleRepo.save(roleRepo.create({ name: 'editor' as any }));

  let admin = await userRepo.findOne({ where: { email: 'admin@demo.com' } });
  if (!admin) {
    admin = userRepo.create({
      nombre: 'Administrador',
      email: 'admin@demo.com',
      password: await bcrypt.hash('Admin123!', 10),
      roles: [adminRole],
    });
    await userRepo.save(admin);
  }

  let editor = await userRepo.findOne({ where: { email: 'editor@demo.com' } });
  if (!editor) {
    editor = userRepo.create({
      nombre: 'Editor Demo',
      email: 'editor@demo.com',
      password: await bcrypt.hash('Editor123!', 10),
      roles: [editorRole],
    });
    await userRepo.save(editor);
  }

  await app.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
