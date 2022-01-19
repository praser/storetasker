const async = require("async");

const callWhenDone = function (err) {
  if (err) {
    console.log("ERROR", err);
  } else {
    console.log("SUCCESS");
  }
};

const autoCalculate = function (first, second, callback) {
  async.auto(
    {
      first: function (done) {
          console.log("first", first * 5);
          done(false, first * 5);
      },

      second: function (done) {
        console.log("second", second - 2);
        done(false, second - 2);
      },

      sumTheResult: [
        "first",
        "second",
        function (results, done) {
          console.log(
            "sumTheResult",
            results.first + results.second
          );
          done(false, results.first + results.second);
        },
      ],
    },
    function (err, results) {
      console.log(results.squareIt);
      callback(err);
    }
  );
};

autoCalculate(2, 5, callWhenDone);
