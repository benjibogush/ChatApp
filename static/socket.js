var socket = io();

// class KeyPressing{static k=[];static i(){document.addEventListener('keydown',(e)=>{const c=e.keyCode;if(KeyPressing.k.includes(c)==!1){KeyPressing.k.push(c)}}); document.addEventListener('keyup',(e)=>{const c=e.keyCode;if(KeyPressing.k.includes(c)==!0){const a=KeyPressing.k.indexOf(c);if(a!==-1){KeyPressing.k.splice(a,1)}}})} static isKeyPressed(c){return KeyPressing.k.includes(c)}}KeyPressing.i()

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var sendButton = document.getElementById('sendButton');

input.addEventListener("keydown", function (zEvent) {
    if (zEvent.ctrlKey &&  zEvent.key === "i") {  // case sensitive
        input.value = input.value + " *Text here*"
    }
} ); // works bruh 
input.addEventListener("keydown", function (zEvent) {
    if (zEvent.ctrlKey &&  zEvent.key === "b") {  // case sensitive
        input.value = input.value + " **Text here**"
    } // did it glitch for you too? replchat testing?
} ); // works bruh 
// input.addEventListener("keydown", function (zEvent) {
//     if (zEvent.ctrlKey &&  zEvent.key === "u") {  // case sensitive
//         input.value = "__Text__"
//     }
// } ); // works bruh 

function refreshAll() {
    socket.emit('admin.refreshall')
}

function toggleBadWords() {
  socket.emit('admin.filter')
}

function changeAnnouncement() {
  let text = prompt("What do you want to change the announcement to?")

  socket.emit('admin.announcement', text)
}

function validateMessage(m) {
  function sendClientMessage(resp) {
    var item = document.createElement('li');
    item.innerHTML = `<button type="button" class="btn-close btn-close-white" onclick="this.parentElement.outerHTML=''" style="float:right;"></button>Bot - ${resp.split('\n').join('<br>')}`;
    item.style.backgroundColor = "rgb(92,144,255)";
    item.style.color = "white";
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
  }
  if (m.startsWith('/')) {
    switch(m) {
      // commands
      case "/test":
        sendClientMessage("Works!");
        break;
      case "/help":
        sendClientMessage("There are currently 4 commands you can run:\n/test - It's a test, what did you expect?\n/help - You're here already.\n/credits - See who helped made the app!\n/clear - Clear the chat. Note this only works for you.");
        break;
      case "/credits":
        sendClientMessage("Credits:<br><a href='https://www.replit.com/@VapWasTaken' style='color:white;'>VapWasTaken / buddy#1234</a> - Creator<br><a href='https://www.replit.com/@DaInfLoop' style='color:white;'>DaInfLoop</a> - Developer (Helped with most)<br><a href='https://www.replit.com/@CosmicBear' style='color:white;'>CosmicBear</a> - Developer (Helped with Database & styles)");
        break;
      case "/clear":
        messages.innerHTML = "<li></li><li></li><li></li><li></li><li></li>"
        let item = document.createElement('li')
        item.textContent = "Cleared your chat."
        messages.appendChild(item)
        window.scrollTo(0, document.body.scrollHeight);
      default:
        return validateMessage('/help')
        break;
    }
    input.value = ""
    return true
  } else {
    return false
  }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
});

input.addEventListener('keydown', (e) => {
  let search = new URLSearchParams(window.location.search.slice(1))
  if (e.shiftKey && e.key == "Enter") {
    input.value = `${input.value}\n`
  } else if (e.key == "Enter") {
    if (input.value && !validateMessage(input.value)) {
      if (search.get('room')) {
          socket.emit('chat message', {
            message: input.value,
            room: search.get('room')
          })
        } else {
          socket.emit('chat message', {
            message: input.value
          });
        }
      input.value = '';
    }
  }
})

sendButton.addEventListener("click", (e) => {
      let search = new URLSearchParams(window.location.search.slice(1))
      if (input.value && !validateMessage(input.value)) {
        if (search.get('room')) {
          socket.emit('chat message', {
            message: input.value,
            room: search.get('room')
          })
        } else {
          socket.emit('chat message', {
            message: input.value
          });
        }
      input.value = '';
    }
})



socket.on('admin.refreshall', function() {
  location.reload();
})

socket.on('banned', function() {
  socket.disconnect();
  messages.innerHTML = "<li></li><li></li><li></li><li></li><li></li>"
  let item = document.createElement('li')
  item.textContent = "You have been banned from replchat by an admin."
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight);
})

socket.on('admin.announcement', function(text) {
  document.getElementsByClassName('announceBanner')[0].children[0].textContent = text
})

socket.on('admin.kick', () => {
  socket.disconnect();
  messages.innerHTML = "<li></li><li></li><li></li><li></li><li></li>"
  let item = document.createElement('li')
  item.textContent = "You have been kicked from replchat by an admin."
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight);
})

function kickUser() {
  const user = prompt("Who to kick?").toLowerCase()
  socket.emit('admin.kick', user, (done) => {
    if (done) alert("They have been kicked.")
  })
}

function createBot() {
  socket.emit('admin.createBot', alert('What is the username of this bot?'), confirm('Is it certified?'), alert('Who made it?'))
}

function clearMessagesAllServer() {
  socket.emit('admin.clearMessages', ({}))
}

function messageFunc({
    username,
    message,
    unfilteredMessage = '',
    pfp
}, backup = false) {
    var item = document.createElement('li');
    if (message.toLowerCase().split(' ').includes(`@${name.toLowerCase()}`)) {
      if (!backup) {
        new Audio("beep.mp3")
        if (Notification.permission == "granted" && name != username) {
          new Notification('replchat', { body: `${username} pinged you in replchat: ${message}` })
        }
      }
      item.style.backgroundColor = 'rgba(173, 140, 40, 0.9)' 
    }
    else if(message.toLowerCase().split(' ').includes(`@everyone`)) {
      if(["benjibogush", "benjibogush", "benjibogush"].includes(username)) {
        if (!backup) {
          new Audio("beep.mp3")
          if (Notification.permission == "granted" && name != username) {
            new Notification('replchat', { body: `${username} pinged you in replchat: ${message}` })
          }
        }    
        item.style.backgroundColor = 'rgba(173, 140, 40, 0.75)' 
      }
    }
    let markedMessage = message.split('<').join('&lt;').split('>').join('&gt;')
    markedMessage = marked.parse(markedMessage)
  // did it glitch for u too? ? refresh replchat test yes is it all white? yes why what happen because i am doing stuff ohh kk temp fix not working oh ik why
    if (!unfilteredMessage.split(' ')[0].startsWith('#') && true) {
      
    }
    if(markedMessage.includes("javascript:")) return;
  let user = {
    image: pfp || 'https://replit-user-info-api.epiccodewizard.repl.co/EpicCodeWizard.png'
  };
  
  
    if (username == "VapWasTaken") {
      // $.getJSON(`https://replit-user-info-api.epiccodewizard.repl.co/@${username}`, function(data) {
      //   icon = data.image
      // })
      item.innerHTML = `<img class="pfp" src="${user.image}" style="border-radius:50%" width="35px" height="35px" />&nbsp;<a href="https://replit.com/@VapWasTaken" target="_blank" rel="noopener noreferrer"">[CREATOR]</a>
@${username} - ${markedMessage}`;
      if (item.style.backgroundColor != 'rgba(255, 255, 0, 0.75)') {
        // item.style.backgroundColor = "rgb(95, 186, 124)"
        // // item.classList.add('rainbowText')
      }
    } else if (username == "DaInfLoop" || username == "CosmicBear") {
      item.innerHTML = `<img class="pfp" src="${user.image}" width="35px" height="35px;" style="border-radius:50%">&nbsp;<a href="https://replit.com/@${username}" target="_blank" rel="noopener noreferrer"">[Developer]</a> @${username} - ${markedMessage}`;
    } else {
      // let icon;
      // $.getJSON(`https://replit-user-info-api.epiccodewizard.repl.co/@${username}`, function(data) => {
      //   icon = data.image
      // })
      item.innerHTML = `<img class="pfp" src="${user.image}" style="border-radius:50%" width="35px" height="35px" /> @${username} - ${markedMessage}`;
    }
    messages.appendChild(item);
    item.getElementsByClassName('pfp')[0].addEventListener('error', () => {
      item.getElementsByClassName('pfp')[0].src = "https://replit-user-info-api.epiccodewizard.repl.co/EpicCodeWizard.png"
    })
    //item.innerHTML = twemoji.parse(item.innerHTML)
    let images = item.getElementsByClassName('img')
    if (Array.from(images).length) {
      Array.from(images).forEach(image => {
        image.height = image.height/4
        image.width = image.width/4
      })
    }
    item.addEventListener('click', () => {
      input.value = `Replying to @${username} (${message}): `
      input.focus()
    })
    window.scrollTo(0, document.body.scrollHeight);
}

socket.on('getmessages', messages => {
  let search = new URLSearchParams(window.location.search.slice(1))
  if (search.get('room')) return socket.emit('joinRoom', search.get('room'))
  messages.forEach(m => {
    messageFunc({
      username: m.username,
      message: m.message,
      pfp: m.pfp
    }, true)
  })
})

socket.on('chat message', messageFunc);

socket.on('joined', ({ username }) => {
  var item = document.createElement('li');
  item.textContent = `@${username} has joined!`;
  item.style.backgroundColor = "rgb(92,144,255)";
  item.style.color = "white";
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
})
socket.on('left', ({ username }) => {
  var item = document.createElement('li');
  item.textContent = `@${username} has left.`;
  item.style.backgroundColor = "rgb(92,144,255)";
  item.style.color = "white";
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
})


if (Notification.permission != "granted") {
  alert("replchat uses notifications to let you know when you are pinged. If you would like to opt-in to ping notifications, please grant the permission.")
  Notification.requestPermission();
}