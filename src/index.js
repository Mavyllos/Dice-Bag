'use strict'

const Alexa = require('alexa-sdk')
const appId = '' // insert app id here

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback)

  if (typeof process.env.DEBUG === 'undefined') {
    alexa.appId = appId
  }

  alexa.registerHandlers(handlers)
  alexa.execute()
}

const handlers = {
  'LaunchRequest': function () {
    const speech = 'Welcome to Dice Bag! Ask me to roll any number of dice, and tell me how many sides they have!'
    const reprompt = 'Sorry, I didn\'t catch that. Could you repeat the number of dice that you wanted me to roll?'

    this.emit(':ask', speech, reprompt)
  },
  'RollIntent': function () {
    const times = this.event.request.intent.slots.times.value || 1;
    const sides = this.event.request.intent.slots.sides.value || 6;
    let value = 0;
    for (var i = 0; i < times; i++) {
      value += Math.floor(Math.random() * sides) + 1;
    }

    if (value === 20 && times === 1 ) {
        this.emit(':tell', 'Natural 20!');
    } else if (value === 1 && sides > 6){
    this.emit(':tell', 'Critical Fail!');
    } else {
      this.emit(':tell', `Your roll is... ${value}!`);
    }
  },
  'AMAZON.HelpIntent': function () {
    const speech = 'Ask me to roll some number of dice. For example, "roll three d six."'
    const reprompt = speech

    this.emit(':ask', speech, reprompt)
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', 'Goodbye!')
  }
}
