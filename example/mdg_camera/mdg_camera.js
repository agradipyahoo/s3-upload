/**
 * Created by agradip.sarkar on 14/07/15.
 */
if (Meteor.isClient) {
    Template.basic.helpers({
        "files": function() {
            return S3.collection.find();
        }
    });
    Template.basic.events({
        "click button.upload": function(event) {
            return S3.upload({
                files: [$("textarea").val()],
                path: "tester",
                encoding: "base64"
            }, function(error, result) {
                if (error) {
                    return console.log(error);
                } else {
                    return console.log(result);
                }
            });
        },
        "click button.delete": function(event) {
            return S3["delete"](this.relative_url, function(error, res) {
                if (!error) {
                    return console.log(res);
                } else {
                    return console.log(error);
                }
            });
        }
    });
}

if (Meteor.isServer) {
    S3.config = {
        key: "yourkey",
        secret: "yousecret",
        bucket: "yourbucket"
    };
}

// ---
// generated by coffee-script 1.9.2