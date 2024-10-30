import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const existingUser = await this.usuariosRepository.findOne({
      where: { email: createUsuarioDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);
    
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      senha: hashedPassword,
      dataNascimento: new Date(createUsuarioDto.dataNascimento),
    });

    await this.usuariosRepository.save(usuario);
    
    const { senha, ...result } = usuario;
    return result;
  }

  async findAll(): Promise<Partial<Usuario>[]> {
    const usuarios = await this.usuariosRepository.find();
    return usuarios.map(({ id, nome, apelido, foto, cidade }) => ({
      id,
      nome,
      apelido,
      foto,
      cidade,
    }));
  }

  async findOne(id: number): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['amizadesEnviadas', 'amizadesRecebidas'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senha, ...result } = usuario;
    return result;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.findOne(id);

    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existingUser = await this.usuariosRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    const updatedUsuario = await this.usuariosRepository.save({
      ...usuario,
      ...updateUsuarioDto,
      id,
      dataNascimento: updateUsuarioDto.dataNascimento 
        ? new Date(updateUsuarioDto.dataNascimento)
        : usuario.dataNascimento,
    });

    const { senha, ...result } = updatedUsuario;
    return result;
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.remove(usuario);
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    return this.usuariosRepository.findOne({ where: { email } });
  }
}