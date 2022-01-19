var async = require('async');

var callWhenDone = function(err) {
	if (err) {
		console.log('ERROR', err);
	} else {
		console.log('SUCCESS');
	}
}

var autoCalculate = function (first, second, callback) {
	async.auto({

		firstTimesFive: function(done) {
			setTimeout(function() {
				console.log('firstTimesFive', first*5);
				done(null, first*5);
			}, 3000);
		},

		secondMinusTwo: function(done) {
			console.log('secondMinusTwo', second-2);
			done(null, second-2);
		},

		sumTheResult: ['firstTimesFive', 'secondMinusTwo', function(results, done) {
			console.log('sumTheResult', results.firstTimesFive + results.secondMinusTwo);
			done(null, results.firstTimesFive + results.secondMinusTwo);
		}],

		squareIt: ['sumTheResult', function(results, done) {
			setTimeout(function() {
				console.log('squareIt', results.sumTheResult*results.sumTheResult);
				done(null, results.sumTheResult*results.sumTheResult);
			}, 3000);
		}]

	}, function(err, results) {
		console.log(results.squareIt);
		callback(err);
	});

}

autoCalculate(2, 5, callWhenDone);
