import { ref, firebaseAuth } from '../config/constants';

// /////////////// database operations //////////////////////////
const dbWriteUserData = (email, uid, emailSent, displayName = null, photoURL = null) => (
    ref.child(`users/${uid}/info`)
      .set({
          email,
          uid,
          emailSent,
          displayName,
          photoURL,
      })
);

const isUserExist = uid => ref(`users/${uid}`).key;

const dbAddNewTask = (payload) => {
    const tasks = ref.child(`users/${payload.uid}/tasks`);
    const newTask = tasks.push();
    newTask.set({ id: newTask.key, ...payload });
};

const dbUpdateTask = (payload) => {
    const task = ref.child(`users/${payload.uid}/tasks/${payload.key}`);
    task.update(payload);
};

const dbUpdateSettings = (payload) => {
    const settings = ref.child(`users/${payload.uid}/settings/`);
    settings.update({ ...payload, uid: null });
};

const dbFetchTasks = () => {
    const uid = firebaseAuth().currentUser.uid;
    const tasks = ref.child(`users/${uid}/tasks`);
    return tasks.once('value');
};

const dbTaskRemove = (payload) => {
    const task = ref.child(`users/${payload.uid}/tasks/${payload.key}`);
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
          .then(() => dbWriteUserData(user.email, user.uid, true, user.displayName, user.photoURL))
          .catch(err => console.error(err.message));
    }
    return dbWriteUserData(user.email, user.uid, false, user.displayName, user.photoURL);
};

const register = (payload) => {
    const { email, pw } = payload;
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
    dbUpdateTask,
    dbFetchTasks,
    dbTaskRemove,
    dbUpdateSettings,
};
