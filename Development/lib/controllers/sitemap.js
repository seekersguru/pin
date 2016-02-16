'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Article = mongoose.model('Article'),
Company = mongoose.model('Company'),
Event = mongoose.model('Event'),
Discussion = mongoose.model('Discussion'),
multipart = require('connect-multiparty'),
fs = require('fs'),
Q = require('q'),
path = require('path'),
_ = require('lodash'),

sm = require('sitemap');


exports.generatesitemap = function(req, res) {

var urls=[
{ url: '',  changefreq: 'daily', priority: 0.3 },
{ url: '/category/investor-comms',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/advisory-process',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/business-issues',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/wealth-planning',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/markets',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/portfolios-construction',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/traditional',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/alternative',  changefreq: 'weekly', priority: 0.8},
{ url: '/who-we-are',  changefreq: 'weekly', priority: 0.8},
{ url: '/terms',  changefreq: 'weekly', priority: 0.8},
{ url: '/privacy',  changefreq: 'weekly', priority: 0.8},
{ url: '/sitemap',  changefreq: 'weekly', priority: 0.8},
{ url: '/contact-us',  changefreq: 'weekly', priority: 0.8},
{ url: '/articles/01',  changefreq: 'weekly', priority: 0.8},
{ url: '/event',  changefreq: 'weekly', priority: 0.8},
{ url: '/discussion-listing',  changefreq: 'weekly', priority: 0.8},
{ url: '/companies',  changefreq: 'weekly', priority: 0.8}
];

  

var q=Article.find({});

	/** sorting according to date */

	q.sort('-createdAt');
	q.where('money').equals(true);
	

	/** finally execute */
	q.exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<articles.length; i++){
           			urls.push({ url: '/articles/view/'+articles[i].url,  changefreq: 'daily', priority: 0.3 });
    	     }
    	     
		}
	});

	var discussionq=Discussion.find({});

		/** sorting according to date */

		discussionq.sort('-createdAt');
		discussionq.where('money').equals(true);


		/** finally execute */
		discussionq.exec(function(err, articles) {
			if (err) {
				console.log(err);
				return res.send(404);
			} else {
				  for(var i=0; i<articles.length; i++){
	           			urls.push({ url: '/discussion-start?cid='+articles[i].cid,  changefreq: 'daily', priority: 0.3 });
	    	     }
	    	     
			}
		});

	var eventq=Event.find({});

	/** sorting according to date */

	eventq.sort('-createdAt');
	eventq.where('money').equals(true);


	/** finally execute */
		eventq.exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<articles.length; i++){
           			urls.push({ url: '/event/view/'+articles[i].url,  changefreq: 'daily', priority: 0.3 });

    	     }
			  
    	}
	});

	var companyq=Company.find({});

	/** sorting according to date */
	companyq.sort('title');

	/** finally execute */
		companyq.exec(function(err, company) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<company.length; i++){
           			urls.push({ url: '/company/view/'+company[i].url,  changefreq: 'daily', priority: 0.3 });
				}
     		
     		var sitemap = sm.createSitemap ({
			      hostname: 'http://moneymanagementindia.net',
			      cacheTime: 600000,        // 600 sec - cache purge period 
			      urls: urls
			  });

			 sitemap.toXML( function (err, xml) {
			      if (err) {
			        return res.status(500).end();
			      }
			      res.header('Content-Type', 'application/xml');
			      res.send( xml );
			  });
		
		}
	});
};

  

  /**========== Comment Section Stop =================**/
