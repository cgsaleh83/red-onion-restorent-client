import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../SignUp/firebase.config';
import React , { useState,createContext,useContext , useEffect} from 'react';
import {Route,Redirect} from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

const AuthContext = createContext()
export const AuthProvider = (props) => {
    const auth = Auth();
    return <AuthContext.Provider value={auth}> {props.children} </AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext);

export const  PrivateRoute = ({ children, ...rest }) => {
    const auth = useAuth();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  //Google Sing In PopUp
  const GoogleProvider = new firebase.auth.GoogleAuthProvider();

  //  Google Sing In Method
  export const googleSingIn = () => {
    firebase.auth().signInWithPopup(GoogleProvider)
      .then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        window.history.back(); 
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  }



  // //Facebook singIn popup
  // const facebookProvider = new firebase.auth.FacebookAuthProvider();

  // //Facebook Popup 
  // export const facebookSignIn = () => {
  //   firebase.auth().signInWithPopup(facebookProvider)
  //   .then(function (result) {
  //     var token = result.credential.accessToken;
  //     var user = result.user;
  //     window.history.back(); 
  //   })
  //   .catch(function (error) {
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     var email = error.email;
  //     var credential = error.credential;
  //   });
  // }


 


const Auth = () => {
    const [user, setUser] = useState(null);

  

    useEffect(() => {
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
             const currUser = user;
             setUser(currUser);
          }
        });
        
    },[])

    const signIn = (email,password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
       .then(res => {
           setUser(res.user);
           window.history.back(); 
        })
        .catch(err=> setUser({error: err.message}))
    }

   

    const signUp = (email, password, name) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
            firebase.auth().currentUser.updateProfile({
                displayName: name
            }).then(() => {
              setUser(res.user);
              verifyEmail();
              window.history.back(); 
            });
        })
        .catch(err=> setUser({error: err.message}))
    }


    //Email Verify
    const verifyEmail = () => {
      const user = firebase.auth().currentUser;
      user.sendEmailVerification()
      .then(function () {
        // Email sent.
      }).catch(function (error) {
        // An error happened.
      });
    }


 

    const signOut = () => {
        return firebase.auth().signOut()
        .then(res => setUser(null))
    }

    return{
        user,
        signIn,
        signUp,
        signOut
    }
}

export default Auth;