const { PubSub } = require('@google-cloud/pubsub');
const JSZip = require('jszip');
const fetch = require('node-fetch');
const moment = require('moment');
const photoModel = require('./photo_model');
const { Storage } = require('@google-cloud/storage');

const pubSubClient = new PubSub();
const subscription = pubSubClient.subscription(process.env.TOPIC_NAME);
const zips = [];

const getPhotos = async (tags, tagMode) => {
  const photos = await photoModel.getFlickrPhotos(tags, tagMode);
  return photos.slice(0, 9);
};

const uploadOnGoogle = async (uploadStream, tags) => {
  const storage = new Storage();
  const fileName = `${process.env.BUCKET_REPO}/${tags}.zip`;

  console.log(fileName);

  const file = await storage.bucket(process.env.BUCKET_NAME).file(fileName);
  const stream = file.createWriteStream({
    resumable: false
  });

  stream.on('error', err => {
    console.error(err);
  });

  stream.on('finish', err => {
    console.log('Upload finished');
    zips[tags] = true;
  });

  uploadStream.pipe(stream);
};

const messageHandler = async message => {
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);

  const zip = new JSZip();
  const data = JSON.parse(message.data);

  const photos = await getPhotos(data.tags, data.tagmode);

  photos.forEach(async photo => {
    await fetch(photo.media.b)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        zip.file(`${photo.title}.jpg`, buffer);
      });
  });

  uploadOnGoogle(zip.generateNodeStream(), data.tags);

  // "Ack" (acknowledge receipt of) the message
  message.ack();
};

// Listen for new messages until timeout is hit
subscription.on('message', messageHandler);

module.exports = async tags => {
  const storage = new Storage();
  const options = {
    action: 'read',
    expires:
      moment()
        .add(2, 'days')
        .unix() * 1000
  };
  const signedUrls = await storage
    .bucket(process.env.BUCKET_NAME)
    .file(`${process.env.BUCKET_REPO}/${tags}.zip`)
    .getSignedUrl(options);
  return signedUrls[0];
};
