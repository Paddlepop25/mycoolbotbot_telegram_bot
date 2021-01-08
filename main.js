require('dotenv').config()
const { Telegraf } = require('telegraf')
const fetch = require('node-fetch')

const giphyApiKey = process.env.GIPHY_APIKEY

// create a bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

// when a user starts a session with your bot
// this expects a promise
const HELLO_IMG =
  'https://miro.medium.com/max/2000/1*J9wJ3CwvtFXJ4mmyzcwo8A.jpeg'

bot.start((context) => {
  context.replyWithPhoto(HELLO_IMG, { caption: 'Hello there!' })
  context.reply('Welcome to my Bot')
})

bot.hears('hi', (context) => context.reply('Hi back yourself'))

bot.command('news', (context) => {
  console.info('context ---> ', context)
  console.info('context.message ---> ', context.message)
  const length = context.message.entities[0].length
  // console.info(length)
  const country = context.message.text.substring(length)

  return context.reply(
    `So you want some news from${country}? Here they are ... `
  )
})

bot.command('giphy', (context) => {
  // console.info('context ---> ', context)
  // console.info('context.message ---> ', context.message)
  const length = context.message.entities[0].length // length of the word after /giphy xxx <--
  const q = context.message.text.substring(length) // extract that word
  // console.info(q)

  const giphyEndpoint = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${q}&limit=5`
  fetch(giphyEndpoint)
    .then((res) => res.json())
    .then((body) =>
      // because data: [ { ... }] an array, can use forEach
      body.data.forEach((info) => {
        context.replyWithPhoto(info.url, { caption: `${info.title}` })
      })
    )
})

// start the bot
console.info(`Starting BOT at ${new Date()}`)
bot.launch()

// do newyorktimes /news should return 5 news
// read documentation context with reply aim 2:15pm

/*
Commands in telegram
/start <-- start bot
/news <country id> (like us, tw, es, etc) API from https://developer.nytimes.com/
/giphy <search_term>
*/

// {
//   type: 'gif',
//   id: 'z7WDgVoPhLo7S',
//   url: 'https://giphy.com/gifs/cheese-wallace-and-gromit-z7WDgVoPhLo7S',
//   slug: 'cheese-wallace-and-gromit-z7WDgVoPhLo7S',
//   bitly_gif_url: 'http://gph.is/1imaH8f',
//   bitly_url: 'http://gph.is/1imaH8f',
//   embed_url: 'https://giphy.com/embed/z7WDgVoPhLo7S',
//   username: '',
//   source: 'http://www.reddit.com/r/reactiongifs/comments/1usmgo/mrw_an_episode_wallace_and_gromit_is_on_tv/',
//   title: 'wallace and gromit cheese GIF',
//   rating: 'g',
//   content_url: '',
//   source_tld: 'www.reddit.com',
//   source_post_url: 'http://www.reddit.com/r/reactiongifs/comments/1usmgo/mrw_an_episode_wallace_and_gromit_is_on_tv/',
//   is_sticker: 0,
//   import_datetime: '2014-01-09 18:43:25',
//   trending_datetime: '1970-01-01 00:00:00',
//   images: [Object],
//   analytics_response_payload: 'e=Z2lmX2lkPXo3V0RnVm9QaExvN1MmZXZlbnRfdHlwZT1HSUZfU0VBUkNIJmNpZD1lZmExODYyZWFnM3pibHRldXE5ODFuMjBvc2s5OHl6b3BxYjk3NzVtdzllNHZsMDc',
//   analytics: [Object]
// },
