var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

var base_url = 'http://api.yelp.com/v2/';

var yelpConsumerKey = 'PWYFrkLCDWoj87qasWwGEw';
var yelpConsumerSecret = 'xU9D_C5bw7KBnVt2zEZQzbFD0Xk';
var yelpToken = 'd1GEdMBtYI0j04mOrXhRn434n89cIvJV';
var yelpTokenSecret = '8jV0lT2YJ_vUhhA9ZB_6bxp1pgA';

/* Function for yelp search call
 * ------------------------
 * params: object with params to search
 * callback: callback(error, response, body)
 */
module.exports.search = function (params, callback) {
  var httpMethod = 'GET';
  var url = base_url + 'search';

  makeRequestToYelp(httpMethod, url, params, callback);
};

/* Function for yelp business call
 * ------------------------
 * businessId: yelp businessId
 * params: object with params for API
 * callback: callback(error, response, body)
 */
module.exports.getBusiness = function (businessId, params, callback) {
  var httpMethod = 'GET';
  var url = base_url + 'business/' + businessId;

  makeRequestToYelp(httpMethod, url, params, callback);
};

function makeRequestToYelp(method, apiUrl, params, callback) {
  var required_params = {
    oauth_consumer_key : yelpConsumerKey,
    oauth_token : yelpToken,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };
  var parameters = _.assign(params, required_params);
  var consumerSecret = yelpConsumerSecret;
  var tokenSecret = yelpTokenSecret;
  var signature = oauthSignature.generate(method, apiUrl, parameters, consumerSecret, tokenSecret, {encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);
  var apiURL = apiUrl + '?' + paramURL;
  
}
