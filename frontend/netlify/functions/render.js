'use strict'; 
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const axios = require('axios')
const morgan = require('morgan');

function dectectBot(userAgent) {
  const bots = [
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkShare',
    'facebot',
    'outbrain',
    'W3C_Validator',
    'whatsapp',
    'telegrambot',
    'discordbot'
  ];
  const agent = userAgent.toLowerCase();
  console.log(agent, 'agent');
  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected', bot, agent);
      return true;
    }
  }

  console.log('no bots found');
  return false;
}

const getRaffle = async (id) => {
  try {
    return await axios.get('https://api-ro.poap.fun/api/v1/raffles/' + id)
  } catch (error) {
    console.error(error)
  }
}

const router = express.Router();
router.get('/', async (req, res) => {
  const isBot = dectectBot(req.headers['user-agent']);
  const eventId = req.baseUrl.split('/')[4];

  if (isBot) {
    const raffle = await getRaffle(eventId);

    const { data } = raffle;
    const { description, name } = data;

    if (data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
      <!doctype html>
      <head>
            <title>POAP Gallery</title>
            <meta name="title" content="${name}">
            <meta name="description" content="${description}">
            <meta property="og:type" content="article">
            <meta property="og:site_name" content="POAP.fun">
            <meta property="og:title" content="${name}">
            <meta property="og:description" content="${description}">
            <meta property="og:image" content="https://poap.fun/og-image.png">
            <meta property="og:image:height" content="500">
            <meta property="og:image:width" content="500">
            <meta property="twitter:card" content="summary">
            <meta property="twitter:site" content="@poapxyz">
            <meta property="twitter:title" content="${name}">
            <meta property="twitter:description" content="${description}">
            <meta property="twitter:image" content="https://poap.fun/og-image.png">
      </head>
      <body>
        <article>
          <div>
            <h1>${name}</h1>
          </div>
          <div>
            <p>${description}</p>
          </div>
        </article>
      </body>
      </html>`);
      res.end();
    } else {
      res.redirect('http://' + req.hostname)
    }
  } else {
    res.redirect('http://' + req.hostname + '/' + eventId)
  }
});
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))
app.use(['/.netlify/functions/render/*', '/.netlify/functions/render/','/.netlify/functions/render/fun/*', '/fun/*', '/render/*'], router);  // path must route to lambda

module.exports.handler = serverless(app);



