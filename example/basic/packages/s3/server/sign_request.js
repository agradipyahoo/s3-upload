var calculate_signature, crypto;

Meteor.methods({
    _s3_sign: function(ops) {
        var expiration, key, policy, post_url, signature;
        if (ops == null) {
            ops = {};
        }
        this.unblock();
        check(ops, Object);
        _.defaults(ops, {
            expiration: 1800000,
            path: "",
            bucket: S3.config.bucket,
            acl: "public-read",
            region: S3.config.region
        });
        expiration = new Date(Date.now() + ops.expiration);
        expiration = expiration.toISOString();
        key = ops.path + "/" + ops.file_name;
        policy = {
            "expiration": expiration,
            "conditions": [
                ["content-length-range", 0, ops.file_size], {
                    "key": key
                }, {
                    "bucket": ops.bucket
                }, {
                    "Content-Type": ops.file_type
                }, {
                    "acl": ops.acl
                }, {
                    "Content-Disposition": "inline; filename='" + ops.file_name + "'"
                }
            ]
        };
        policy = Buffer(JSON.stringify(policy), "utf-8").toString("base64");
        signature = calculate_signature(policy);
        if (ops.region === "us-east-1" || ops.region === "us-standard") {
            post_url = "https://s3.amazonaws.com/" + ops.bucket;
        } else {
            post_url = "https://s3-" + ops.region + ".amazonaws.com/" + ops.bucket;
        }
        return {
            policy: policy,
            signature: signature,
            access_key: S3.config.key,
            post_url: post_url,
            url: (post_url + "/" + key).replace("https://", "http://"),
            secure_url: post_url + "/" + key,
            relative_url: "/" + key,
            bucket: ops.bucket,
            acl: ops.acl,
            key: key,
            file_type: ops.file_type,
            file_name: ops.file_name
        };
    }
});

crypto = Npm.require("crypto");

calculate_signature = function(policy) {
    return crypto.createHmac("sha1", S3.config.secret).update(new Buffer(policy, "utf-8")).digest("base64");
};

