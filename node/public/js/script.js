const socket = io();

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