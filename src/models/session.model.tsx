import User from './user.model';

export type AuthSubject = Pick<User, '_id' | 'name' | 'mail' | 'settings'>
