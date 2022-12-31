const cheerio = require('cheerio');

class TwitterService {
    constructor() {
        //bind this pointer to class methods
        this.handleHomeTimelineData = this.handleHomeTimelineData.bind(this);
        this.handleTimelineExplore = this.handleTimelineExplore.bind(this);
    } 

    twitterRegex() {
        return new RegExp(/^(((https?):\/\/)?(www.)?)twitter\.com(\/(\w){1,15})\/status\/[0-9]{19}$/);
    }

    getTwitterUserURL(username) {
        username = username.replace('@', '');
        return `https://twitter.com/${username}`;
    }

    getTweetID(url) {
        const tweetID = url.split('/').pop();
        return tweetID;
    }

    getTweetTrendLink(trend) {
        return `https://twitter.com/search?q=${trend}&src=trend_click&vertical=trends`.replace('#', '%23');
    }

    // valdate the tweet url that from username input
    validateTwitterPostURLFromUser(url, username) {
        const firstTweetURLRegex = /^(((https?):\/\/)?(www.)?)twitter\.com\//;
        const secondTweetURLRegex = /\/status\/[0-9]{19}$/;
        const tweetURLRegexWithUserName = new RegExp(firstTweetURLRegex.source + username + secondTweetURLRegex.source);
        return tweetURLRegexWithUserName.test(url);
    }

    handleMainTweetData({ $, article }) {
        const divTweetUserAvatar = article.find('div[data-testid="Tweet-User-Avatar"]').first(); //find the first div element
        const autherAvatar = divTweetUserAvatar.find('img').first();

        const divAutherName = article.find('div[data-testid="User-Names"]').find('div').first(); //find the first div element
        const divAutherUserName = article.find('div[data-testid="User-Names"]').find('div').first().next();
        const spanAutherName = divAutherName.find('span').first();
        const spanAutherUserName = divAutherUserName.find('span').first();

        const divTweetText = article.find('div[data-testid="tweetText"]').first();

        let tweetMedias = [];
        article.find('div[data-testid="tweetPhoto"]').each((i, el) => {
            const imgSrc = $(el).find('img').attr('src');
            if (imgSrc) {
                tweetMedias.push({ image: imgSrc });
            };
            const videoSrc = String($(el).find('video').attr('src'));
            if (videoSrc && !videoSrc.startsWith('blob:')) {
                tweetMedias.push({ video: videoSrc });
            } else {
                tweetMedias.push({ videoPoster: $(el).find('video').attr('poster') });
            }
        });
        article.find('div[data-testid="card.layoutLarge.media"]').each((i, el) => {
            const imgSrc = $(el).find('img').attr('src');
            if (imgSrc) {
                tweetMedias.push({ image: imgSrc });
            };
        });

        const timePosted = article.find('time').first();

        const tweetInteractionArray = [];
        article.find('span[data-testid="app-text-transition-container"]').each((i, el) => {
            const text = $(el).text();
            console.log(text)
            tweetInteractionArray.push(text);
        });
        const tweetInteraction = {
            views: tweetInteractionArray[0] || '0',
            retweets: tweetInteractionArray[1] || '0',
            quoteTweets: tweetInteractionArray[2] || '0',
            likes: tweetInteractionArray[3] || '0',
        }

        return {
            autherAvatar: autherAvatar.attr('src'),
            autherName: spanAutherName.text(),
            autherUserName: spanAutherUserName.text(),
            autherProfileUrl: this.getTwitterUserURL(spanAutherUserName.text()),
            tweetText: divTweetText.text(),
            tweetMedias: tweetMedias,
            timePosted: timePosted.attr('datetime'),
            tweetInteraction: tweetInteraction,
        }

    }

    handleReplyTweetData = ({ $, article }) => {
        const divTweetUserAvatar = article.find('div[data-testid="Tweet-User-Avatar"]').first(); //find the first div element
        const autherAvatar = divTweetUserAvatar.find('img').first();

        const divAutherName = article.find('div[data-testid="User-Names"]').find('div').first(); //find the first div element
        const divAutherUserName = article.find('div[data-testid="User-Names"]').find('div').first().next();
        const spanAutherName = divAutherName.find('span').first();
        const spanAutherUserName = divAutherUserName.find('span').first();

        const divTweetText = article.find('div[data-testid="tweetText"]').first();

        const timePosted = article.find('time').first();

        let tweetMedias = [];
        article.find('div[data-testid="tweetPhoto"]').each((i, el) => {
            const imgSrc = $(el).find('img').attr('src');
            if (imgSrc) {
                tweetMedias.push({ image: imgSrc });
            };
            const videoSrc = String($(el).find('video').attr('src'));
            if (videoSrc && !videoSrc.startsWith('blob:')) {
                tweetMedias.push({ video: videoSrc });
            } else {
                tweetMedias.push({ videoPoster: $(el).find('video').attr('poster') });
            }
        });
        article.find('div[data-testid="card.layoutLarge.media"]').each((i, el) => {
            const imgSrc = $(el).find('img').attr('src');
            if (imgSrc) {
                tweetMedias.push({ image: imgSrc });
            };
        });

        const replyToDiv = article.find('div[class="css-1dbjc4n r-4qtqp9 r-zl2h9q"]').first();

        const tweetInteractionArray = [];
        article.find('span[data-testid="app-text-transition-container"]').each((i, el) => {
            const text = $(el).text() || '0';
            tweetInteractionArray.push(text);
        });

        const tweetInteraction = {
            views: tweetInteractionArray[0] || '0',
            retweets: tweetInteractionArray[1] || '0',
            quoteTweets: tweetInteractionArray[2] || '0',
            likes: tweetInteractionArray[3] || '0',
        }

        let tweetUrl = '';
        const autherUserNameNoAtSign = spanAutherUserName.text().replace('@', '');


        article.find('a[role="link"]').each((i, el) => {
            // If already found the tweet url, then return
            if (tweetUrl !== '') return;
            const testTweetUrl = 'https://twitter.com' + String($(el).attr('href'));
            if (this.validateTwitterPostURLFromUser(testTweetUrl, autherUserNameNoAtSign)) {
                tweetUrl = testTweetUrl;
            };
        })

        return {
            tweetUrl: tweetUrl,
            tweetID: this.getTweetID(tweetUrl),
            tweetDetails: {
                autherAvatar: autherAvatar.attr('src'),
                autherName: spanAutherName.text(),
                autherUserName: spanAutherUserName.text(),
                autherProfileUrl: this.getTwitterUserURL(spanAutherUserName.text()),
                replyTo: replyToDiv.text(),
                tweetText: divTweetText.text(),
                tweetMedias: tweetMedias,
                timePosted: timePosted.attr('datetime'),
                tweetInteraction: tweetInteraction,
            }
        }
    }

    handleHomeTimelineData({ twitterPostUrl, homeTimeline, homeTimelineHTML }) {
        const $ = cheerio.load(cheerio.load(homeTimelineHTML).html()); //create a html file wraps 3 elements

        const sectionMainBlock = $('body').find('section').first(); //find the first section element

        const tweetReplies = [];
        let tweetData = {}
        sectionMainBlock.find('article[data-testid="tweet"]').each((i, e) => {
            if (i === 0) {
                tweetData = this.handleMainTweetData({ $, article: $(e) });
            } else {
                const reply = this.handleReplyTweetData({ $, article: $(e) });
                tweetReplies.push(reply);
            }
        });


        return {
            tweetUrl: twitterPostUrl,
            tweetID: this.getTweetID(twitterPostUrl),
            fetchTime: new Date(),
            tweetDetails: {
                ...tweetData,
                tweetReplies: tweetReplies,
            },
        };
    }

    handleTimelineExplore({ timelineExploreHTML }) {
        const trendingHashtags = [];

        const $ = cheerio.load(cheerio.load(timelineExploreHTML).html()); 

        const body = $('body');
        
        body.find('div[data-testid="trend"]').each((i, e) => {
            const firstDiv = $(e).find('div').first();
            const trendingInfos = [];
            $(firstDiv).find('div').each((i, e) => {
                const text = $(e).text();
                if (i !== 0 && text !== '') {
                    trendingInfos.push(text);
                }
            });
            trendingHashtags.push({
                trendingLable: trendingInfos[0] || '',
                trendingHashtag: trendingInfos[1] || '',
                trendingTweetCount: trendingInfos[2] || '',
                trendingURLSearch: this.getTweetTrendLink(trendingInfos[1] || ''),
            });
        });
        return {
            trendingHashtags: trendingHashtags,
        };
    }
};


module.exports = new TwitterService;