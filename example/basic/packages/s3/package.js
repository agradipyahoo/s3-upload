Package.describe({
  name: 'agradip2004:s3',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'S3 upload with meteor , example interation for image cropping and uploading dataURL',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/agradipyahoo/s3-upload.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  knox: "0.9.2",
  "stream-buffers":"2.1.0",
  "aws-sdk":"2.1.14"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  //api.addFiles('s3.js');

  api.use(["underscore","check","service-configuration"], ["client", "server"]);

  // Client
  api.addFiles("client/functions.js", "client");

  // Server
  api.addFiles("server/startup.js", "server");
  api.addFiles("server/sign_request.js", "server");
  api.addFiles("server/delete_object.js", "server");

  //Allows user access to Knox
  api.export && api.export("Knox","server");

  //Allows user access to AWS-SDK
  api.export && api.export("AWS","server");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('agradip2004:s3');
  api.addFiles('s3-tests.js');
});
