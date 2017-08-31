const socket = io('http://localhost');


function sendMessage() {
  let message = document.querySelector('.inputMensagem');
  socket.emit('send', message.value);
  const ul = document.querySelector('ul');
  const newChild = `<li style="width:100%;"> 
                        <div class="msj-rta macro"> 
                          <p>`+ message.value + `</p>  
                  </li>`
  ul.insertAdjacentHTML('beforeend', newChild);
  message.value = '';
}
var you = {};
document.querySelector('.inputMensagem').onkeypress = function (e) {
  if (e.keyCode == 13) {
    sendMessage();
  }
}

socket.on('receive', (message) => {
  const ul = document.querySelector('ul');

  const newChild = `<li style="width:100%"> 
                        <div class="msj macro"> 
                              <p> `+ message + ` </p> 
                        </div> 
                    </li>`
  ul.insertAdjacentHTML('beforeend', newChild);
});

// debugger
// const app = angular.module('inftalk', ["firebase"]);
// app.config(() => {
//   var config = {
//     apiKey: "AIzaSyCB7rcS0GiuFMOGOTMT17UdDKIMSoc5t3c",
//     authDomain: "inftalkufg.firebaseapp.com",
//     databaseURL: "https://inftalkufg.firebaseio.com",
//     projectId: "inftalkufg",
//     storageBucket: "inftalkufg.appspot.com",
//     messagingSenderId: "1086028806435"
//   };
//   firebase.initializeApp(config);
// });
// app.controller('chat', ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
//   const authObj = $firebaseAuth();
//   authObj.$onAuthStateChanged(function (firebaseUser) {
//     if (firebaseUser) {
//       $scope.logado = true;
//       console.log("Signed in as:", firebaseUser.uid);
//     } else {
//       $scope.logado = false;
//       console.log("Signed out");
//     }
//   });
//   $scope.usuario = {
//     logarFacebook: () => {
//       authObj.$signInWithPopup("facebook").then(function (result) {
//         console.log("Signed in as:", result.user.uid);
//         $scope.logado = true;
//       }).catch(function (error) {
//         console.error("Authentication failed:", error);
//       });
//     },
//     logarGoogle: () => {
//       authObj.$signInWithPopup("google").then(function (result) {
//         console.log("Signed in as:", result.user.uid);
//         $scope.logado = true;
//       }).catch(function (error) {
//         console.error("Authentication failed:", error);
//       });
//     },
//     logarComEmail: () => {
//       authObj.$signInWithEmailAndPassword($scope.usuario.email, $scope.usuario.senha).then(function (firebaseUser) {
//         console.log("Signed in as:", firebaseUser.uid);
//         $scope.logado = true;
//       }).catch(function (error) {
//         console.error("Authentication failed:", error);
//       });
//     },
//     criarConta: () => {
//       authObj.$createUserWithEmailAndPassword($scope.usuario.email, $scope.usuario.senha)
//         .then(function (firebaseUser) {
//           console.log("User " + firebaseUser.uid + " created successfully!");
//           usuario.criarContaAba = false;
//         }).catch(function (error) {
//           console.error("Error: ", error);
//         });
//     },
//     // usuarioList: () => {
//     //   return [{}]
//     // }
//   }
//   // $scope.authObj.$signInAnonymously().then(function (firebaseUser) {
//   //   $scope.logado = true;
//   //   console.log("Signed in as:", firebaseUser.uid);
//   // }).catch(function (error) {
//   //   console.error("Authentication failed:", error);
//   // });
// }]);