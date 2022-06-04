/**
 * Module URL
 *
 * Provides methods to create and parse url.
 * Supports parsing query string and hash parameters.
 * The hash parameters can be parsed if the parameters in the hash should be in query string format.
 *  e.g: /cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10#commentId=9&foo=10
 *
 * EXAMPLE:
 *
 * -- Create URL
 *
 * grn.component.url.page('schedule/view', {id:1, bdate:'2014-01-10'})
 * // Output: "/cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10"
 *
 * grn.component.url.page('schedule/view', {id:1, bdate:'2014-01-10'}, "Comment")
 * // Output: "/cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10#Comment"
 *
 * grn.component.url.page('schedule/view', {id:1, bdate:'2014-01-10'}, {commentId: 9})
 * // Output: "/cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10#commentId=9"
 *
 * grn.component.url.setParameters('path/to/page?foo=111&bar=222', {foo:999, hoge:3})
 * // Output: "path/to/page?foo=999&bar=222&hoge=3"
 *
 * grn.component.url.setParameters('path/to/page?#bar=10', null, {hoge:22, bar:99})
 * // Output: "path/to/page?#bar=99&hoge=22"
 *
 * -- Parse URL
 *
 * grn.component.url.getQueryString('/cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10')
 * // Output: "id=1&bdate=2014-01-10"
 *
 * // Parse a query string
 * grn.component.url.parseQueryString('/cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10')
 * // Output: Object {id: "1", bdate: "2014-01-10"}
 *
 * // Parse a hash parameter
 * grn.component.url.parseHash('/cgi-bin/cbgrn/grn.exe/schedule/view?id=1&bdate=2014-01-10#commentId=9&foo=20')
 * // Output: Object {commentId: "9", foo: "20"}
 */
grn.base.isNamespaceDefined("grn.component.url")||(grn.base.namespace("grn.component.url"),grn.component.url=function(){"use strict";function staticUrl(path,params){return staticUrlInternal(path,params,false)}function staticUrlInternal(path,params,noBuildDate){var url=grn.component.url.STATIC_URL;return path&&(url+="/"+path),url=appendQueryData(url,params,noBuildDate)}function image(path,params){var url=staticUrlInternal("grn/image",null,true);return path&&(url+="/"+path),url=appendQueryData(url,params)}function parse(url){var pathname=url,query_position=url.indexOf("?"),search="";-1!==query_position&&(pathname=url.substr(0,query_position),search=toQueryString(parseQueryString(url)));var hash_position=pathname.indexOf("#"),hash;return-1!==hash_position&&(pathname=pathname.substr(0,hash_position)),{pathname:pathname,search:search,hash:getHash(url)}}function setParameters(url,query_params,hash_params){var components=parse(url),current_query_params=parseQueryString(components.search),current_hash_params=parseHash(url),name;if("object"===typeof query_params)for(name in query_params)query_params.hasOwnProperty(name)&&(current_query_params[name]=query_params[name]);if("object"===typeof current_hash_params&&"object"===typeof hash_params)for(name in hash_params)hash_params.hasOwnProperty(name)&&(current_hash_params[name]=hash_params[name]);else current_hash_params=hash_params;var new_url=components.pathname+"?"+toQueryString(current_query_params);return"string"===typeof current_hash_params&&""!==current_hash_params?new_url+="#"+current_hash_params:"object"===typeof current_hash_params&&Object.keys(current_hash_params).length>0&&(new_url+="#"+toQueryString(current_hash_params)),new_url}function appendQueryData(url,params,noBuildDate){var queryString=toQueryString(params);if(queryString.length>0&&(url+="?"+queryString),true===noBuildDate)return url;var buildDate=grn.component.url.BUILD_DATE;return buildDate&&(url+=-1===url.indexOf("?")?"?":"&",url+=buildDate),url}function page(page_path,params,hash){page_path=page_path||"index";var url=grn.component.url.PAGE_PREFIX+"/"+page_path+grn.component.url.PAGE_EXTENSION+"?",queryString=toQueryString(params);return queryString.length>0&&(url+=queryString),url+=formatHash(hash)}function toQueryString(params){var queryString="";if("undefined"===typeof params)return queryString;if("string"===typeof params)queryString=params;else if("object"===typeof params){var paramArray=[];for(var name in params)if(params.hasOwnProperty(name)){var value=params[name];value=null==value?"":value,paramArray.push(name+"="+encodeURIComponent(value))}queryString=paramArray.join("&")}return queryString}function formatHash(hash){return"undefined"===typeof hash?"":"string"===typeof hash?"#"+hash:"object"===typeof hash?"#"+toQueryString(hash):""}function getQueryString(url){var queryString=url,pos=url.indexOf("?");return-1!==pos&&(queryString=url.substr(pos+1)),queryString}function parseQueryParams(query_string){if(0===query_string.length)return{};var query_params={},query_string_array=query_string.split("&"),i,len;for(i=0,len=query_string_array.length;i<len;i++){var param=query_string_array[i].split("="),name=param[0],value="undefined"!==typeof param[1]?param[1]:"";value=value.replace(/\+/g,"%20"),name.length>0&&(query_params[name]=decodeURIComponent(value))}return query_params}function parseQueryString(url){var queryString=getQueryString(url),hashPos=queryString.indexOf("#");return-1!==hashPos&&(queryString=queryString.substr(0,hashPos)),parseQueryParams(queryString)}function getHash(url){var hash="",hashPos=url.indexOf("#");return-1!==hashPos&&(hash=url.substr(hashPos+1)),hash}function changeCurrentLocationHash(hash){location.hash=formatHash(hash)}function parseHash(url){var hash=getHash(url),isKeyValueParam;return 0===hash.length?hash:null==hash.match(/.*=/)?hash:parseQueryParams(hash)}function encodeRFC3986ValueChars(value){var encoded_value;return encodeURIComponent(value).replace(/[!'()]/g,escape).replace(/\*/g,"%2A")}return grn.component.url.PAGE_PREFIX="cbgrn",grn.component.url.PAGE_EXTENSION="",grn.component.url.STATIC_URL="/cbgrn",grn.component.url.BUILD_DATE="",{staticUrl:staticUrl,image:image,page:page,parse:parse,setParameters:setParameters,toQueryString:toQueryString,getQueryString:getQueryString,parseQueryString:parseQueryString,getHash:getHash,changeCurrentLocationHash:changeCurrentLocationHash,parseHash:parseHash,encodeRFC3986ValueChars:encodeRFC3986ValueChars}}());