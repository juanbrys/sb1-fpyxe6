import { IsString, IsEmail, IsDateString, IsOptional, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nome: string;

  @IsString()
  apelido: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsDateString()
  dataNascimento: string;

  @IsString()
  @IsOptional()
  foto?: string;

  @IsString()
  cidade: string;

  @IsString()
  @IsOptional()
  telefone?: string;
}