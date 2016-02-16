'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Article = mongoose.model('Article'),
Event = mongoose.model('Event'),
Discussion = mongoose.model('Discussion'),
multipart = require('connect-multiparty'),
fs = require('fs'),
Q = require('q'),
path = require('path'),
_ = require('lodash'),

sm = require('sitemap');


exports.generatesitemap = function(req, res) {
  var categoryURL={
                'architect-blueprint':'Architect Blueprint',
                 'essentials-foundation':'Essentials Foundation',
                 'growth-pillars':'Growth Pillars',
                 'freedom-slab':'Freedom Slab',
                 'fun-money-roof':'Fun Money Roof'
                };
var urls=[
{ url: '',  changefreq: 'daily', priority: 0.3 },
{ url: '/category/architect-blueprint',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/essentials-foundation',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/growth-pillars',  changefreq: 'weekly', priority: 0.8},
{ url: '/category/fun-money-roof',  changefreq: 'weekly', priority: 0.8},
{ url: '/who-we-are',  changefreq: 'weekly', priority: 0.8},
{ url: '/terms',  changefreq: 'weekly', priority: 0.8},
{ url: '/sitemap',  changefreq: 'weekly', priority: 0.8},
{ url: '/articles/01',  changefreq: 'weekly', priority: 0.8},
{ url: '/event',  changefreq: 'weekly', priority: 0.8},
{ url: '/discussion-listing',  changefreq: 'weekly', priority: 0.8}
];

var q=Article.find({});

	/** sorting according to date */

	q.sort('-createdAt');
	q.where('hans').equals(true);
	

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
		discussionq.where('hans').equals(true);


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
	eventq.where('hans').equals(true);


	/** finally execute */
		eventq.exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<articles.length; i++){
           			urls.push({ url: '/event/view/'+articles[i].url,  changefreq: 'daily', priority: 0.3 });

    	     }
			  var sitemap = sm.createSitemap ({
			      hostname: 'http://themoneyhans.com',
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
