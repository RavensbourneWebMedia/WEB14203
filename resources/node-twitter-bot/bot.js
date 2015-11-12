var Twitter = require('twitter'),
		config = require('./config'),
		twitterBot = new Twitter(config.keys),
		terminals = {},
		startWords = [],
		wordStats = {}

function getUserStatuses(parameters)
{
	twitterBot.get('statuses/user_timeline', parameters, function(error, tweets, response)
	{
		if (!error) 
		{
			//console.log(tweets)

			// console.log(tweets[0])
			for (var i = 0; i < tweets.length; i++) 
			{
				var text = tweets[i].text

				// TODO some sanitation
				var words = text.split(' ')

				terminals[words[words.length-1]] = true
				startWords.push(words[0])

				for (var j = 0; j < words.length - 1; j++) 
				{
					if (wordStats.hasOwnProperty(words[j])) 
					{
						wordStats[words[j]].push(words[j+1])
					} 
					else 
					{
						wordStats[words[j]] = [words[j+1]]
					}
				}
			}

			// var max_id = tweets[tweets.length-1].id
			// callback(max_id)

 			var sentence = makeMarkovSentence(3 + Math.floor(3 * Math.random()))

			console.log(sentence)
		}
	})
}

/*

def grab_tweets(api, max_id=None):
    source_tweets=[]
    user_tweets = api.GetUserTimeline(screen_name=user, count=200, max_id=max_id, include_rts=True, trim_user=True, exclude_replies=True)
    max_id = user_tweets[len(user_tweets)-1].id-1
    for tweet in user_tweets:
        tweet.text = filter_tweet(tweet)
        if len(tweet.text) != 0:
            source_tweets.append(tweet.text)
    return source_tweets, max_id

*/

// var sentence = makeMarkovSentence(3 + Math.floor(3 * Math.random()))

			// console.log(sentence)

var parameters = 
{
	screen_name: 'baddeo',
	exclude_replies: true,
	include_rts: false,
	count: 200 
}

getUserStatuses(parameters)

function getRandomElement (array) 
{
	var randomIndex = Math.floor(array.length * Math.random())
	return array[randomIndex]
}

function makeMarkovSentence (minLength) 
{
	word = getRandomElement(startWords)
	var sentence = [word]
	while (wordStats.hasOwnProperty(word)) 
	{
		var next_words = wordStats[word]
		word = getRandomElement(next_words)
		sentence.push(word)
		if (sentence.length > minLength && terminals.hasOwnProperty(word)) break
	}
	if (sentence.length < minLength) return makeMarkovSentence(minLength)
	return sentence.join(' ')
}