var publishHandles = [];

Meteor.publish("builds", function () {
console.log("new connection.");

var self = this;
self.added(/*collection=*/ 'builds', /*id=*/ 'singleton', {time: new Date()});
self.ready();

publishHandles.push(self);

self.onStop(function () {
	publishHandles = _.without(publishHandles, self);
	});
});

Meteor.setInterval(function () {
	var jobs = Meteor.call("GetAllJobs","http://10.211.55.231:8080/");
	var result = _.map(jobs,function(job){
		var lastBuildUrl = Meteor.call("GetLastBuildUrl",job.url);
		var detail = Meteor.call("GetLastBuildDetail",lastBuildUrl);
		return {
			name:job.name,
			building:detail.building,
			result:detail.result,
			number:detail.number,
			jobUrl:job.url,
			buildUrl:detail.url
		};
	});
	_.each(publishHandles, function (pub) {
		pub.changed(/*collection=*/ 'builds', /*id=*/ 'singleton', {value:result});
	});
}, 1000);

function getAllJobs(delay, url,callback) {
	Meteor.http.get(url+"api/json",delay,function(err,rep){
		var jobs = JSON.parse(rep.content).jobs;
		callback(null,jobs);
	});
}

function getLastBuildUrl(delay, jobUrl,callback) {
	Meteor.http.get(jobUrl+"api/json",delay,function(err,rep){
		callback(null, JSON.parse(rep.content).lastBuild.url);
	});
}

function getLastBuildDetail(delay, buildUrl,callback) {
	Meteor.http.get(buildUrl+'api/json',delay,function(err,rep){
		var buildDetail = JSON.parse(rep.content);
		callback(null, buildDetail);
	});
}

//wrapping
var wrappedGetAllJobs = Async.wrap(getAllJobs);
var wrappedGetLastBuildUrl = Async.wrap(getLastBuildUrl);
var wrappedGetLastBuildDetail = Async.wrap(getLastBuildDetail);

Meteor.methods({
  'GetAllJobs': function(url) {
    var response = wrappedGetAllJobs(500,url);
    return response;
  },
  'GetLastBuildUrl': function(url) {
    var response = wrappedGetLastBuildUrl(500,url);
    return response;
  },
  'GetLastBuildDetail': function(url) {
    var response = wrappedGetLastBuildDetail(500,url);
    return response;
  }
});
