'use strict';

var index = require('./controllers'),
	users = require('./controllers/serviceuser'),
	mainusers = require('./controllers/users'),
	nishant = require('./controllers/nishant'),
	session = require('./controllers/session'),
	articles = require('./controllers/article'),
	events = require('./controllers/event'),
	discussions = require('./controllers/discussion'),
	familys = require('./controllers/family'),
	companys = require('./controllers/company'),
	experts = require('./controllers/expert'),
	countrycity = require('./controllers/countrycity'),
	useragent = require('express-useragent'),
	device = require('express-device');

var middleware = require('./middleware');
var multipart = require('connect-multiparty'),
	multipartMiddleware = multipart();

/**
 * Application routes
 */
module.exports = function(app) {

	// Server API Routes

	//nishant section start

	app.post('/api/nishant', nishant.create);
	app.get('/api/nishant', nishant.query);

	//nishant section end

	/**---(',')--article section start----(',')---**/

	//GET
	app.get('/api/articles', articles.query);
	app.get('/api/hansiarticles', articles.hansi);
	app.get('/api/articles/basic', articles.basic);
	app.get('/api/articles/:articleid', articles.show);
	app.post('/api/articles', multipartMiddleware, articles.create);
	app.put('/api/articles/:articleid', multipartMiddleware, articles.update);
	app.del('/api/articles/:articleid', articles.remove);
	app.put('/api/articles/removemedia/:articleid', articles.removemedia);
	app.get('/api/articles/search/:search', articles.search);

	/**---(',')--article comments section start----(',')---**/

	app.get('/api/comments/:articleid', articles.comment_query);
	app.get('/api/comments/:articleid/:commentid', articles.comment_show);
	app.post('/api/comments/:articleid', articles.comment_create);
	app.put('/api/comments/:articleid/:commentid', articles.comment_update);
	app.del('/api/comments/:articleid/:commentid', articles.comment_remove);

	/**---(',')--article comments section stop----(',')---**/

	app.post('/api/users', users.create);
	app.get('/api/users', users.query);
	app.get('/api/users/:userid', users.show);
	app.put('/api/users/:userid', users.update);
	app.put('/api/users/status/:userid', users.updatestatus);
	app.get('/api/users/checkusername/:username', users.checkusername);
	app.get('/user/:id/verify/:token', users.verifyEmail);
	app.post('/api/users/forgot', users.forgot);
	app.post('/api/users/:id/recover', users.recover);
	app.post('/api/users/connect/:userid', users.connect);
	app.get('/api/users/search/:username', users.search);
	app.put('/api/users/followingstatus/:followingid', users.connectupdate);
	app.post('/api/users/upload', multipartMiddleware, users.uploadusers);



	app.post('/api/discussions', discussions.create);
	app.get('/api/discussions', discussions.query);
	app.get('/api/discussions/:cid', discussions.checkcid);
	app.put('/api/discussions/:discussionid', discussions.update);
	app.del('/api/discussions/:discussionid', discussions.remove);

	/**---(',')--discussion  comments section start----(',')---**/

	app.get('/api/discussion-comments/:discussionid', discussions.comment_query);
	app.get('/api/discussion-comments/:discussionid/:commentid', discussions.comment_show);
	app.post('/api/discussion-comments/:discussionid', discussions.comment_create);
	app.put('/api/discussion-comments/:discussionid/:commentid', discussions.comment_update);
	app.del('/api/discussion-comments/:discussionid/:commentid', discussions.comment_remove);

	/**---(',')--discussion  comments section stop----(',')---**/


	/**
	 * family section apis
	 */
	app.post('/api/family', familys.create);
	app.get('/api/family', familys.query);
	app.get('/api/family/:familyid', familys.show);
	app.put('/api/family/:familyid', familys.update);
	app.del('/api/family/:familyid', familys.remove);

	/**
	 * experts section apis
	 */
	app.post('/api/expert', experts.create);
	app.get('/api/expert', experts.query);
	app.get('/api/expert/basic', experts.basic);
	app.get('/api/expert/:expertid', experts.show);
	app.put('/api/expert/:expertid', experts.update);
	app.del('/api/expert/:expertid', experts.remove);
	app.put('/api/expert/removemedia/:expertid', experts.removemedia);


	/**---(',')--Company section start----(',')---**/

	app.get('/api/companys', companys.query);
	app.get('/api/companys/basic', companys.basic);
	app.get('/api/companys/:companyid', companys.show);
	app.post('/api/companys', companys.create);
	app.put('/api/companys/:companyid', companys.update);
	app.del('/api/companys/:companyid', companys.remove);
	app.post('/api/companys/upload', multipartMiddleware, companys.uploadcompanies);


	/**---(',')--Event section start----(',')---**/

	app.get('/api/events', events.query);
	app.get('/api/events/basic', events.basic);
	app.get('/api/events/:articleid', events.show);
	app.post('/api/events', events.create);
	app.put('/api/events/:articleid', multipartMiddleware, events.update);
	app.del('/api/events/:articleid', events.remove);
	app.put('/api/events/removemedia/:articleid', events.removemedia);
	app.put('/api/events/register/:eventid', events.register);

	/**---(',')--Event section stop----(',')---**/


	/**---(',')--Event comments section start----(',')---**/

	app.get('/api/event-comments/:articleid', events.comment_query);
	app.get('/api/event-comments/:articleid/:commentid', events.comment_show);
	app.post('/api/event-comments/:articleid', events.comment_create);
	app.put('/api/event-comments/:articleid/:commentid', events.comment_update);
	app.del('/api/event-comments/:articleid/:commentid', events.comment_remove);

	/**---(',')--Event comments section stop----(',')---**/



	app.post('/api/session', session.login);
	app.del('/api/session', session.logout);
	app.get('/api/session/facebook', session.fblogin);
	app.get('/api/session/facebook/callback', session.fbcallback);

	app.get('/api/session/linkedin', session.linkedinlogin);
	app.get('/api/session/linkedin/callback', session.linkedincallback);

	app.get('/api/countries', countrycity.getCountry);
	app.get('/api/cities/:country', countrycity.getCity);



	// All undefined api routes should return a 404
	app.get('/api/*', function(req, res) {
		res.send(404);
	});

	app.get('/*', function(req, res, next) {
		// console.log(req);
		var source = req.headers['user-agent'],
			ua = useragent.parse(source);
			console.log(ua);
			var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl+"----";
			console.log(fullUrl);
			console.log(req.originalUrl);
			console.log(req.route);
		// console.log(ua);
		if (ua.isBot) {
			var articleId=req.originalUrl.split("/");
			if(articleId.length === 3)

			var data =	app.get('/api/articles/'+articleId, articles.show);
			console.log(data);
			res.send('<meta property="og:type" content="article">   <meta property="og:site_name" content="The Money Hans"> <meta property="og:url" content="http://themoneyhans.com/articles/view/55bdf76a7095311b3d29a9a1"> <meta property="og:title" content="BUILDING WEALTH IS LIKE BUILDING A HOUSE"> <meta property="og:description" content="BUILDING WEALTH IS LIKE BUILDING A HOUSEThe Money Hans"> <meta property="og:image" content="http://themoneyhans.com/uploads/1439532121359.png"><meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:description" content="Articles In The Money Hans"/> <meta name="twitter:title" content="The Money Hans"/> <meta name="twitter:site" content="@maddyzonenews"/> <meta name="twitter:domain" content="he Money Hans"/> <meta name="twitter:image:src" content="http://themoneyhans.com/images/logo.png"/> ');

			// <meta property="og:type" content="article"> <meta property="og:site_name" content="The Money Hans"> <meta property="og:url" content="http://themoneyhans.com/"> <meta property="og:title" content="Articles"> <meta property="og:description" content="Articles In  The Money Hans"> <meta property="og:image" content="http://themoneyhans.com/images/logo.png">
			// console.log("facebook");
			// res.statusCode = 302;
			// console.log("http://service.prerender.io/http://themoneyhans.com" + req.url);
			// res.setHeader("Location", "http://service.prerender.io/http://themoneyhans.com" + req.url);
			// res.end();
		} else {
			console.log("our project:");
			next();

		}
		// next();

	});

	// All other routes to use Angular routing in app/scripts/app.js
	app.get('/partials/*', index.partials);
	app.get('/partials2/*', index.partials);
	app.get('/old*', middleware.setUserCookie,
		function(req, res) {
			res.render('index', {
				css: false
			});
		});
	app.get('/*', middleware.setUserCookie, index.index);
};
