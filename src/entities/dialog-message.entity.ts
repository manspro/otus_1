import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

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

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'from_user_id' })
  from: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: 'to_user_id' })
  to: User;
}
