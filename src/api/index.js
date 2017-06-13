import { ref, firebaseAuth } from '../config/constants';
import session from '../components/utils/session';

const logout = () => firebaseAuth().signOut();

const login = (email, pw) => {
    const credential = firebaseAuth.EmailAuthProvider.credential(email, pw);
    session.saveSession(credential);
    return firebaseAuth().signInWithCredential(credential);
};

const resetPassword = email => firebaseAuth().sendPasswordResetEmail(email);

const saveUser = (user) => {
    if (user.emailVerified === false) {
        return user.sendEmailVerification()
          .then(() =>
              ref.child(`users/${user.uid}/info`)
                .set({
                    email: user.email,
                    uid: user.uid,
                    emailSent: true
                }))
          .catch(err => console.log(err.message));
    }
    return ref.child(`users/${user.uid}/info`)
      .set({
          email: user.email,
          uid: user.uid,
          emailSent: false
      });
};

const register = (email, pw) => {
    const credential = firebaseAuth.EmailAuthProvider.credential(email, pw);
    session.saveSession(credential);
    return firebaseAuth().createUserWithEmailAndPassword(email, pw);
};

const loginWithGoogleAccount = () => {
    const provider = new firebaseAuth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return firebaseAuth().signInWithPopup(provider);
};

const signInWithGoogleCredential = (credential) => {
    const token = firebaseAuth.GoogleAuthProvider.credential(credential.idToken);
    return firebaseAuth().signInWithCredential(token);
};

const signInWithCredential = (credential) => {
    const token = firebaseAuth.EmailAuthProvider.credential(credential.mc, credential.sd);
    return firebaseAuth().signInWithCredential(token);
};

export default {
    register,
    logout,
    login,
    resetPassword,
    loginWithGoogleAccount,
    saveUser,
    signInWithGoogleCredential,
    signInWithCredential
};
