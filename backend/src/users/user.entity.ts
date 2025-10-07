import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index() // Índice para busca rápida por email (login)
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string; // Hash da senha

  @Column({ type: 'integer', default: 0 })
  score: number; // Pontuação do usuário

  @Index() // Índice para busca rápida por código de indicação
  @Column({ type: 'varchar', length: 10, unique: true })
  referralCode: string; // Código único de indicação

  @Column({ type: 'varchar', nullable: true })
  referredById: string | null; // ID do usuário que indicou (nullable)

  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  @JoinColumn({ name: 'referredById' })
  referredBy: User | null; // Relacionamento com o usuário que indicou

  @OneToMany(() => User, (user) => user.referredBy)
  referrals: User[]; // Usuários que este usuário indicou

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
