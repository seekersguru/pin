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
		Q = require('q'),
		striptags = require('striptags');

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
  app.get('/api/articles/url/:url', articles.showurl);
  app.post('/api/articles',  multipartMiddleware, articles.create);
  app.put('/api/articles/:articleid', multipartMiddleware,articles.update);
  app.del('/api/articles/:articleid', articles.remove);
  app.put('/api/articles/removemedia/:articleid', articles.removemedia);
  app.get('/api/articles/search/:search',articles.search);

  /**---(',')--article comments section start----(',')---**/

  app.get('/api/comments/:articleid', articles.comment_query);
  app.get('/api/comments/:articleid/:commentid', articles.comment_show);
  app.post('/api/comments/:articleid',  articles.comment_create);
  app.put('/api/comments/:articleid/:commentid', articles.comment_update);
  app.del('/api/comments/:articleid/:commentid', articles.comment_remove);

  /**---(',')--article comments section stop----(',')---**/

  app.post('/api/users', users.create);
  // app.get('/api/users', users.query);
  app.get('/api/users/:userid', users.show);
  app.put('/api/users/:userid', users.update);
  app.put('/api/users/status/:userid', users.updatestatus);
  app.get('/api/users/checkusername/:username',users.checkusername);
  app.get('/user/:id/verify/:token', users.verifyEmail);
  app.post('/api/users/forgot', users.forgot);
  app.post('/api/users/:id/recover', users.recover);
  app.post('/api/users/connect/:userid', users.connect);
  app.get('/api/users/search/:username', users.search);
  app.put('/api/users/followingstatus/:followingid', users.connectupdate);
  app.post('/api/users/upload',  multipartMiddleware, users.uploadusers);




  app.post('/api/discussions', discussions.create);
  app.get('/api/discussions', discussions.query);
  app.get('/api/discussions/:cid', discussions.checkcid);
  app.put('/api/discussions/:discussionid', discussions.update);
  app.del('/api/discussions/:discussionid', discussions.remove);

    /**---(',')--discussion  comments section start----(',')---**/

  app.get('/api/discussion-comments/:discussionid', discussions.comment_query);
  app.get('/api/discussion-comments/:discussionid/:commentid', discussions.comment_show);
  app.post('/api/discussion-comments/:discussionid',  discussions.comment_create);
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
  app.get('/api/companys/register', companys.register);
  app.get('/api/companys/:companyid', companys.show);
  app.get('/api/companys/url/:url', companys.showurl);
  app.post('/api/companys',   companys.create);
  app.put('/api/companys/:companyid',companys.update);
  app.del('/api/companys/:companyid', companys.remove);
  app.post('/api/companys/upload',  multipartMiddleware, companys.uploadcompanies);


   /**---(',')--Event section start----(',')---**/

  app.get('/api/events', events.query);
  app.get('/api/events/basic', events.basic);
  app.get('/api/events/:articleid', events.show);
  app.get('/api/events/url/:url', events.showurl);
  app.post('/api/events',   events.create);
  app.put('/api/events/:articleid', multipartMiddleware,events.update);
  app.del('/api/events/:articleid', events.remove);
  app.put('/api/events/removemedia/:articleid', events.removemedia);
  app.put('/api/events/register/:eventid', events.register);

  /**---(',')--Event section stop----(',')---**/


  /**---(',')--Event comments section start----(',')---**/

  app.get('/api/event-comments/:articleid', events.comment_query);
  app.get('/api/event-comments/:articleid/:commentid', events.comment_show);
  app.post('/api/event-comments/:articleid',  events.comment_create);
  app.put('/api/event-comments/:articleid/:commentid', events.comment_update);
  app.del('/api/event-comments/:articleid/:commentid', events.comment_remove);

  /**---(',')--Event comments section stop----(',')---**/




  app.post('/api/session', session.login);
  app.get('/api/session/autologin', session.autologin);
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

//for seo purpouse
	app.get('/*',function(req,res,next){
		var source = req.headers['user-agent'],
			ua = useragent.parse(source);
			var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
			// console.log(ua);
			if (ua.isBot) {

				var articleId=req.originalUrl.split("/");
				req.params.bot= true;
				var keywords='wealth ,family office ,single family office ,asset management ,Hansi ,Hansi Mehrotra ,investments ,financial planning ,Mutual funds ,Insurance ,best mutual fund ,behavioural finance ,value investing ,economy ,how to select mutual funds ,portfolio construction ,credit ratings';


				if(articleId.length === 4)
				{
					if(articleId[1]=== 'articles')
					{
					 req['params']['url']=articleId[3];
						articles.showurl(req,res).then(function(data){
           				var seoDesc=data.metadescription ? data.metadescription :data.description,
							 seoTitle=data.metatitle ? data.metatitle :data.title + ' - Money Management India',
					 		 seoKeywords=data.metakeywords ? data.metakeywords :keywords;
			 				 res.send('<html><head><meta property="og:type" content="article"><meta property="article:publisher" content="https://www.facebook.com/themoneyhans">   <meta property="og:site_name" content="Money Management India"> <meta property="og:url" content="'+fullUrl+'"> <meta property="og:title" content="'+seoTitle+'"> <meta name="keywords" content="'+seoKeywords+'"><meta property="og:description" content="'+striptags(seoDesc)+'"> <meta property="og:image" content="'+req.protocol + '://' + req.get('host')+'/'+data.media.path+'"><meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:description" content="'+striptags(seoDesc)+'"/> <meta name="twitter:title" content="'+seoTitle+'"/> <meta name="twitter:site" content="@TheMoneyHans"/> <meta name="twitter:domain" content="Money Management India"/> <meta name="twitter:image:src" content="'+req.protocol + '://' + req.get('host')+'/'+data.media.path+' "/></head><body><h1>'+seoTitle+'</h1><p>'+data.description+'</p></body></html>');
		 			});

					}
					else if(articleId[1] === 'company')
					{
					 req['params']['url']=articleId[3];
						companys.showurl(req,res).then(function(data){
						res.send('<html><head><meta property="og:type" content="article"> <meta property="og:site_name" content="Money Management India"> <meta property="og:url" content="'+fullUrl+'"> <meta property="og:title" content="'+data.title+'"> <meta property="og:description" content="'+striptags(data.description)+'"> <meta property="og:image" content="http://moneymanagementindia.net/images/new-logo.png><meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:description" content="'+striptags(data.description)+'"/> <meta name="twitter:title" content="'+data.title+'"/> <meta name="twitter:site" content="@maddyzonenews"/> <meta name="twitter:domain" content="Money Management India"/> <meta name="twitter:image:src" content="http://moneymanagementindia.net/images/new-logo.png"/></head><body><h1>'+data.title+'</h1><p>'+data.description+'</p></body></html>');
					});

					}
					else if(articleId[1] === 'event')
					{
					 req['params']['url']=articleId[3];


					 events.showurl(req,res).then(function(data){
         			 var seoDesc=data.metadescription ? data.metadescription :data.bannertext,
				 	  	 seoTitle=(data.metatitle ? data.metatitle :data.title) + ' - Money Management India',
						 seoKeywords=data.metakeywords ? data.metakeywords :keywords;
		 				 res.send('<html><head><meta property="og:type" content="article"><meta property="article:publisher" content="https://www.facebook.com/themoneyhans">   <meta property="og:site_name" content="Money Management India"> <meta property="og:url" content="'+fullUrl+'"> <meta property="og:title" content="'+seoTitle+'">  <meta name="keywords" content="'+seoKeywords+'"><meta property="og:description" content="'+striptags(seoDesc)+'"> <meta property="og:image" content="'+req.protocol + '://' + req.get('host')+'/'+data.expert[0].flag+'"><meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:description" content="'+striptags(seoDesc)+'"/> <meta name="twitter:title" content="'+seoTitle+'"/> <meta name="twitter:site" content="@TheMoneyHans"/> <meta name="twitter:domain" content="Money Management India"/> <meta name="twitter:image:src" content="'+req.protocol + '://' + req.get('host')+'/'+data.expert[0].flag+' "/></head><body><h1>'+seoTitle+'</h1><p>'+data.description+'</p></body></html>');
				 			 });

				 }
				}
				else if(articleId[1].match(/discussion-start/g)){
					var cid=articleId[1].split("=")[1];
					if(cid){
						req['params']['cid']=cid;
						discussions.checkcid(req,res).then(function(data){
							data=data[0];
						 console.log(data);
						 res.send('<html><head><meta property="og:type" content="article">   <meta property="og:site_name" content="Money Management India"> <meta property="og:url" content="'+fullUrl+'"> <meta property="og:title" content="'+data.title+'"> <meta property="og:description" content="'+striptags(data.title)+ " --- "+ data.topic +'"> <meta property="og:image" content="http://themoneyhans.com/images/hunsi-img.png"><meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:description" content="'+striptags(data.title)+ " --- "+ data.topic +'"/> <meta name="twitter:title" content="'+data.title+'"/> <meta name="twitter:site" content="@maddyzonenews"/> <meta name="twitter:domain" content="Money Management India"/> <meta name="twitter:image:src" content="http://themoneyhans.com/images/hunsi-img.png"/></head></html>');
					 });
					}
				}
				else
				{
						res.send('<html><head><meta property="og:type" content="article">   <meta property="og:site_name" content="Money Management India"> <meta property="og:url" content="'+fullUrl+'"> <meta property="og:title" content="Money Management India"><meta name="keywords" content=" wealth ,family office ,single family office ,asset management ,Hansi ,Hansi Mehrotra ,investments ,financial planning ,Mutual funds ,Insurance ,best mutual fund ,behavioural finance ,value investing ,economy ,how to select mutual funds ,portfolio construction ,credit ratings"/><meta property="og:description" content="Industry network for Indian wealth/asset management industry and investing in India, edited by Hansi Mehrotra, #LinkedInTopVoices"> <meta property="og:image" content="http://moneymanagementindia.net/images/new-logo.png"><meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:description" content="Money Management India is relevant for professionals in the Indian financial services industry who are involved in retail or institutional savings. It also serves as a central resource for overseas investors investing in India."/> <meta name="twitter:title" content="Money Management India"/> <meta name="twitter:site" content="@TheMoneyHans"/> <meta name="twitter:domain" content="Money Management India"/> <meta name="twitter:image:src" content="http://moneymanagementindia.net/images/new-logo.png"/></head><body><h1>Connecting Indian family offices</h1><p>Learn about money (personal finance, investments) from independent expert, Hansi Mehrotra, #LinkedInTopVoices</p></body></html>');
				}

			}
			 else {
				console.log("our project:");
				next();

			}

	});

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/partials2/*', index.partials);
  app.get('/old*', middleware.setUserCookie,
          function(req, res) {
            res.render('index', {css: false});
          });
  app.get('/*', middleware.setUserCookie, index.index);
  // app.get('/autologin',middleware.auth, index.index);
};
