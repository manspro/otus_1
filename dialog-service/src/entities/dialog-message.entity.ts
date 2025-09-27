import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('dialog_messages')
export class DialogMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_user_id' })
  fromUserId: string;

  @Column({ name: 'to_user_id' })
  toUserId: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
