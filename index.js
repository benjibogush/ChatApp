const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const db = new (require("@replit/database")); //https://www.npmjs.com/package/@replit/database

let messages = []

db.list().then(keys => {
  if (!keys.includes('admins')) db.set('admins', '[ "benjibogush" ]')
  if (!keys.includes('messages')) db.set('messages', "[]")
  if (!keys.includes('bannedUsers')) db.set('bannedUsers', "[]")
  if (!keys.includes('announcement')) db.set('announcement', "welcome to replchat!")  
  return db.get('messages')
}).then(m => {
  global.messages = JSON.parse(m)
  return db.get('bannedUsers')
}).then(bu => {
  global.BannedUsers = JSON.parse(bu)
  return db.get('announcement')
}).then(a => {
  global.announcement = a
})

require('ejs')
app.use(express.static('static'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', {
		id: req.get('X-Replit-User-Id'),
		name: req.get('X-Replit-User-Name'),
		roles: req.get('X-Replit-User-Roles'),
    announcement: global.announcement || 'welcome to replchat!',
  });
  // console.log(req.headers)
});

// moved user profiles to test repl

app.get('/test', (req, res) => {
  res.render('test', {
		id: req.get('X-Replit-User-Id'),
		name: req.get('X-Replit-User-Name'),
		roles: req.get('X-Replit-User-Roles')
  });
  // console.log(req.headers)
});
app.get('/info', (req, res) => {
    res.render("info")
});

io.use((socket, next) => {
  socket.name = socket.request.headers['x-replit-user-name']

  if (socket.name == "") socket.requiresIdentify = true
  next()
})

const {Collection} = require('@discordjs/collection') // i was just doing it above lmao its okay


// wait can we just foreach an array and make it set the collection? true


  // Emojis
let emotes = [
  {
    a: ':sunglasses:',
    b: '😎'
  },
  {
    a: ':cry:',
    b: '😢'
  },
  {
    a: ':amongus:',
    b:  'ඞ'
  },
  {
    a: ':sob:',
    b: '😭'
  }
]

// okay ima work on the login page. ima style it up

// Blacklisted Words
// we just replace bad words with #### yeah robloc style]

const filter = new (require('bad-words'))({ placeHolder: '#' })
let filteron = true

// ill work on admin panel, ill do the banned users later

let testBans = [
  "replchat123",
  "uurba",
  "Missleshark", // unbanned on 19th april
  "replspammer",
  "eDawwg",
  "GamimgAccount1",
  "SUPIeRDIMA",
  'kornineq', 'grappa', // alt accounts, perm ban
]

io.on('connection', (socket) => {
  if ('requiresIdentify' in socket) {
    socket.emit('debug', "REQUIRES_IDENTIFY")
    socket.on('identify', (username) => {
      socket.name = username
      socket.requiresIdentify = false
      connection(socket)
    })
  } else {
    connection(socket)
  }
});

const { fetch } = require('undici')

function connection(socket) {
  fetch("https://replit.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0",
			"X-Requested-With": "ReplitProfilePictures",
			"Referer": "https://replit.com"
		},
		body: JSON.stringify({
			query: "query userByUsername($username: String!) { user: userByUsername(username: $username) { image } }",
			variables: JSON.stringify({ username: socket.name })
		})
	})
	.then(res => res.json())
	.then(data => {
		if (data.data.user) socket.pfp = data.data.user.image 
	})
  socket.on('disconnect', () => {
    socket.broadcast.emit('left', { username: socket.name })
  })
  socket.broadcast.emit('joined', { username: socket.name }) 
  if(testBans.includes(socket.name)) return socket.emit('banned')
  socket.on('joinRoom', (room) => {
    socket.join(room)
  })
  socket.emit('getmessages', global.messages || [])
  socket.on('chat message', (message_obj = { message: '', room: false }) => {
    if (!message_obj) return;
    if (!message_obj.message) return;
    const { message } = message_obj
    if ((message || "").split(/ +/g).join('') == '') return;
    let newMessage = message
    // let newMessage = message.replaceAll('https://', '').join(newMessage1)
    try {
      if (filteron) newMessage = filter.clean(message)
    } catch (err) {
      console.error(err)
    }

    emotes.forEach((emote) => {
      if (newMessage.includes(emote.a)) {
        newMessage = newMessage.split(emote.a).join(emote.b)
      }
    })
    // if (message_obj.room) {
    //   return io.to(message_obj.room).emit('chat message', {username: socket.name, message: newMessage});
    // } else {
    io.emit('chat message', { username: socket.name, message: newMessage, pfp: socket.pfp })
    // }
    messages.push({username: socket.name, message: newMessage})
    db.set('messages', JSON.stringify(messages))
  });
  socket.on('admin.refreshall', () => {
    if(!["benjibogush", "benjibogush", "benjibogush"].includes(socket.name)) return;
    io.emit('admin.refreshall', {});
  })
  socket.on('admin.clearMessages', () => {
    if(!["benjibogush", "benjibogush", "benjibogush"].includes(socket.name)) return;
    db.set('messages', "[]");
    messages.length = []
    io.emit('admin.refreshall', {})
  })
  socket.on('admin.filter', () => {
    if(!["benjibogush", "benjibogush", "benjibogush"].includes(socket.name)) return;
    global.filteron = !global.filteron
  })
  socket.on('admin.announcement', (text) => {
    if(!["benjibogush", "benjibogush", "benjibogush"].includes(socket.name)) return;
    global.announcement = text
    io.emit('admin.announcement', text)
  })
  socket.on('admin.kick', async (user, ack) => {
    if(!["benjibogush", "benjibogush", "benjibogush"].includes(socket.name)) return;
    const s = await io.fetchSockets();
    s.forEach(so => {
      if (so.name.toLowerCase() == user) {
        so.emit('admin.kick')
        ack()
      }
    })
  })
  socket.on('error', (e = 'No message') => {
    console.log(`${socket.name}'s socket.io instance threw an error:`, e)
  })
}

server.listen(3000, () => {
  console.log('server started');
});


require('axios')("https://ChatApp.benjibogush.repl.co")

process.on('unhandledRejection', (err) => {
  console.error(err)
})

