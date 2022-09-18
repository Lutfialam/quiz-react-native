import {getUser, login, register} from '@/services/auth';

class User {
  public id?: number;
  public name?: string;
  public email?: string;
  public image?: string;
  public password?: string;
  public passwordConfirmation?: string;
  public level?: string;
  public created_at?: string;
  public updated_at?: string;

  public async login(email: string, password: string) {
    return await login({email, password});
  }

  public async register(user: User) {
    return await register(user);
  }

  public async getCurrentUser(signal: AbortSignal) {
    return await getUser(signal);
  }

  public async createUser(user: User) {}
}

export default User;
