import {
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
  getAuth,
} from 'firebase/auth';

const authErrorMessage = 'Auth Error';

class AuthService {
  constructor(private auth: Auth = getAuth()) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  onAuthChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  sendForgotPasswordEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout() {
    return signOut(this.auth);
  }

  sendEmailVerification(user: User) {
    return sendEmailVerification(user);
  }

  changePassword(password: string) {
    if (!this.user) {
      return new Promise((reject) => {
        reject(authErrorMessage);
      });
    }

    return updatePassword(this.user, password);
  }

  changeEmail(email: string) {
    if (!this.user) {
      return new Promise((reject) => {
        reject(authErrorMessage);
      });
    }

    return updateEmail(this.user, email);
  }

  deleteUser() {
    if (!this.user) {
      return new Promise((reject) => {
        reject(authErrorMessage);
      });
    }

    return deleteUser(this.user);
  }

  get user() {
    return this.auth.currentUser;
  }
}

const authService = new AuthService();

export { AuthService, authService };
