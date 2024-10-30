import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Amizade } from '../../amizades/entities/amizade.entity';
import { Mensagem } from '../../mensagens/entities/mensagem.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  apelido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ nullable: true })
  foto: string;

  @Column()
  cidade: string;

  @Column({ nullable: true })
  telefone: string;

  @OneToMany(() => Amizade, amizade => amizade.usuario)
  amizadesEnviadas: Amizade[];

  @OneToMany(() => Amizade, amizade => amizade.amigo)
  amizadesRecebidas: Amizade[];

  @OneToMany(() => Mensagem, mensagem => mensagem.remetente)
  mensagensEnviadas: Mensagem[];

  @OneToMany(() => Mensagem, mensagem => mensagem.destinatario)
  mensagensRecebidas: Mensagem[];
}