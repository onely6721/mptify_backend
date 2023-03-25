import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity()
export class Track {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  album: string;

  @Column()
  genre: string;

  @Column()
  duration: number;
}
