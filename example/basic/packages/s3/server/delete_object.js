var Future;

Future = Npm.require('fibers/future');

Meteor.methods({
    _s3_delete: function(path) {
        var future;
        this.unblock();
        check(path, String);
        future = new Future();
        S3.knox.deleteFile(path, function(e, r) {
            if (e) {
                console.log(e);
                return future["return"](e);
            } else {
                return future["return"](true);
            }
        });
        return future.wait();
    }
});

