require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const requestIP = require('request-ip');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const verifier = require('captcha-verifier');

const { SOCKET_USER_DISCONNECT_EVENT } = require('./constants/sockets');

const clientURL = process.env.CLIENT_URL;

verifier.config({
  reCaptchaV2SecretKey: process.env.RE_CAPTCHA_2_SECRET_KEY,
});

// Server setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [clientURL],
    credentials: true,
  },
});

// Middewares
const userAgentMiddleware = require('./middlewares/userAgentMiddleware');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

// Cron
const { cron } = require('./lib');

app.use(helmet());
app.use(requestIP.mw());
app.use(cors({ origin: [clientURL], credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(userAgentMiddleware());
app.use(fileUpload());

// App local environments
app.set('io', io);

// Routes
app.use('/users', require('./routes/usersRouter'));
app.use('/email', require('./routes/emailRouter'));
app.use('/checks', require('./routes/checksRouter'));
app.use('/password', require('./routes/passwordRouter'));
app.use('/group', require('./routes/groupsRouter'));
app.use('/image', require('./routes/imagesRouter'));
app.use('/post', require('./routes/postRouter'));
app.use('/comments', require('./routes/commentsRouter'));
app.use('/search', require('./routes/searchRouter'));
app.use('/verification', require('./routes/verificationRouter'));
app.use('/ban', require('./routes/banRouter'));
app.use('/premium-username', require('./routes/premiumUsernameRouter'));
app.use('/chat', require('./routes/chatRouter'));
app.use(
  '/request-socket-connection',
  require('./routes/requestSocketConnection')
);
app.use('/interaction', require('./routes/interactionRouter'));
app.use('/complaint', require('./routes/complaintRouter'));

const socketNamespaces = ['/global-chat', '/private-chats', '/personal'];

const [globalChatNamespace, privateChatsNamespace, personalNamespace] =
  socketNamespaces;

// Socket routes
require('./sockets/personal')(io.of(personalNamespace));
require('./sockets/globalChat')(io.of(globalChatNamespace));
require('./sockets/privateChats')(
  io,
  io.of(privateChatsNamespace),
  personalNamespace
);

// Socket events
const { userDisonnectEvent } = require('./sockets/events');

io.engine.on(
  SOCKET_USER_DISCONNECT_EVENT,
  userDisonnectEvent(io, socketNamespaces)
);

// 404
app.use((req, res) =>
  res.status(404).json({ status: 404, error: 'Not found' })
);

// Errors
app.use(errorHandlerMiddleware());

const PORT = process.env.PORT || 8080;

const start = async () => {
  const startTime = Date.now();

  const mongoDBUri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(mongoDBUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    const timeSpent = (Date.now() - startTime) / 1000;

    cron();

    server.listen(PORT, () => {
      console.log(
        `🚀 Server is running on port ${PORT}. Started in ${timeSpent} sec 🚀`
      );
    });
  } catch (e) {
    console.log(e);
  }
};

start();
