const cheerio = require('cheerio');

const handleMainTweetData = ({ $, article }) => {
    const divTweetUserAvatar = article.find('div[data-testid="Tweet-User-Avatar"]').first(); //find the first div element
    const autherAvatar = divTweetUserAvatar.find('img').first();

    const divAutherName = article.find('div[data-testid="User-Names"]').find('div').first(); //find the first div element
    const divAutherUserName = article.find('div[data-testid="User-Names"]').find('div').first().next();
    const spanAutherName = divAutherName.find('span').first();
    const spanAutherUserName = divAutherUserName.find('span').first();
    
    const divTweetText = article.find('div[data-testid="tweetText"]').first();

    let tweetPhotos = [];
    article.find('div[data-testid="tweetPhoto"]').each((i, el) => {
        tweetPhotos.push($(el).find('img').attr('src'));
    });

    const timePosted = article.find('time').first();

    const tweetInteractionArray = [];
    article.find('span[data-testid="app-text-transition-container"]').each((i, el) => {
        tweetInteractionArray.push($(el).text());
    });
    const tweetInteraction = {
        views: tweetInteractionArray[0],
        retweets: tweetInteractionArray[1],
        qouteTweets: tweetInteractionArray[2],
        likes: tweetInteractionArray[3],
    }

    return {
        autherAvatar: autherAvatar.attr('src'),
        autherName: spanAutherName.text(),
        autherUserName: spanAutherUserName.text(),
        tweetText: divTweetText.text(),
        tweetPhotos: tweetPhotos,
        timePosted: timePosted.attr('datetime'),
        ...tweetInteraction,
    }

};

const handleReplyTweetData = ({ $, article }) => {
    const divTweetUserAvatar = article.find('div[data-testid="Tweet-User-Avatar"]').first(); //find the first div element
    const autherAvatar = divTweetUserAvatar.find('img').first();

    const divAutherName = article.find('div[data-testid="User-Names"]').find('div').first(); //find the first div element
    const divAutherUserName = article.find('div[data-testid="User-Names"]').find('div').first().next();
    const spanAutherName = divAutherName.find('span').first();
    const spanAutherUserName = divAutherUserName.find('span').first();

    const divTweetText = article.find('div[data-testid="tweetText"]').first();

    const timePosted = article.find('time').first();

    const tweetInteractionArray = [];
    article.find('span[data-testid="app-text-transition-container"]').each((i, el) => {
        tweetInteractionArray.push($(el).text());
    });

    return {
        autherAvatar: autherAvatar.attr('src'),
        autherName: spanAutherName.text(),
        autherUserName: spanAutherUserName.text(),
        tweetText: divTweetText.text(),
        timePosted: timePosted.attr('datetime'),
        views: tweetInteractionArray[0],
        retweets: tweetInteractionArray[1],
        qouteTweets: tweetInteractionArray[2],
        likes: tweetInteractionArray[3],
    }
};

class HelperFunctions {
    constructor() {
        this.handleHomeTimelineData = this.handleHomeTimelineData.bind(this) // <- Add this
    }

    response({ res, data = {}, status = 500, message = '' }) {
        const result = {}
        result.status = status;
        result.message = message;
        result.data = data
        return res.status(result.status).json(result)
    }

    handleHomeTimelineData(homeTimeline, homeTimelineHTML) {
        let result;
        const $ = cheerio.load(cheerio.load(homeTimelineHTML).html()); //create a html file wraps 3 elements

        const sectionMainBlock = $('body').find('section').first(); //find the first section element

        const replies = [];
        let tweetData = {}
        sectionMainBlock.find('article').each((i, e) => {
            if (i === 0) {
                tweetData = handleMainTweetData({ $, article: $(e) });
            } else {
                replies.push(handleReplyTweetData({ $, article: $(e) }));
            }
        })


        return {
            tweetDetails: {
                ...tweetData,
                replies: replies,
            }
        };
    }
};


module.exports = new HelperFunctions;