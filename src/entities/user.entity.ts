import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Post } from './post.entity';
import { DialogMessage } from './dialog-message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'second_name' })
  secondName: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column()
  city: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => DialogMessage, message => message.from)
  sentMessages: DialogMessage[];

  @OneToMany(() => DialogMessage, message => message.to)
  receivedMessages: DialogMessage[];

  @ManyToMany(() => User, user => user.friendsOf)
  @JoinTable({
    name: 'user_friends',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' }
  })
  friends: User[];

  @ManyToMany(() => User, user => user.friends)
  friendsOf: User[];
}
