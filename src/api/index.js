import { ref, firebaseAuth } from '../config/constants';
import session from '../components/utils/session';

// /////////////// database operations //////////////////////////
const dbWriteUserData = (email, uid, emailSent) => (
    ref.child(`users/${uid}/info`)
      .set({
          email,
          uid,
          emailSent
      })
);

const isUserExist = uid => ref(`users/${uid}`).key;

const dbAddNewTask = (payload) => {
    const uid = firebaseAuth().currentUser.uid;
    const tasks = ref.child(`users/${uid}/tasks`);
    const newTask = tasks.push();
    console.log({ id: newTask.key, ...payload });
    newTask.set({ id: newTask.key, ...payload });
};

const dbFetchTasks = () => {
    const uid = firebaseAuth().currentUser.uid;
    const tasks = ref.child(`users/${uid}/tasks`);
    return tasks.once('value');
};

const dbTaskRemove = (key) => {
    const uid = firebaseAuth().currentUser.uid;
    const task = ref.child(`users/${uid}/tasks/${key}`);
    return task.remove();
};

// //////////////////////////////////////////////////////////////

const logout = () => firebaseAuth().signOut();

const login = (payload) => {
    const { email, pw } = payload;
    const credential = firebaseAuth.EmailAuthProvider.credential(email, pw);
    return firebaseAuth().signInWithCredential(credential);
};

const resetPassword = email => firebaseAuth().sendPasswordResetEmail(email);

const saveUser = (user) => {
    if (user.emailVerified === false) {
        return user.sendEmailVerification()
          .then(() => dbWriteUserData(user.email, user.uid, true))
          .catch(err => console.log(err.message));
    }
    return dbWriteUserData(user.email, user.uid, false);
};

const register = (payload) => {
    const { email, pw } = payload;
    const credential = firebaseAuth.EmailAuthProvider.credential(email, pw);
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
    signInWithCredential,
    isUserExist,
    dbAddNewTask,
    dbFetchTasks,
    dbTaskRemove
};
