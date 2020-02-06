const formValidator = require('./form_validator');
const photoModel = require('./photo_model');
const { PubSub } = require('@google-cloud/pubsub');
const getZip = require('./queue');

const pubSubClient = new PubSub();

function route(app) {
  app.get('/', async (req, res) => {
    const tags = req.query.tags;
    const tagmode = req.query.tagmode;

    const ejsLocalVariables = {
      tagsParameter: tags || '',
      tagmodeParameter: tagmode || '',
      photos: [],
      searchResults: false,
      invalidParameters: false,
      zip: await getZip(tags)
    };

    // if no input params are passed in then render the view with out querying the api
    if (!tags && !tagmode) {
      return res.render('index', ejsLocalVariables);
    }

    // validate query parameters
    if (!formValidator.hasValidFlickrAPIParams(tags, tagmode)) {
      ejsLocalVariables.invalidParameters = true;
      return res.render('index', ejsLocalVariables);
    }

    const buffer = new Buffer.from(JSON.stringify({ tags, tagmode }));
    pubSubClient.topic(process.env.TOPIC_NAME).publish(buffer);

    // get photos from flickr public feed api
    return photoModel
      .getFlickrPhotos(tags, tagmode)
      .then(photos => {
        ejsLocalVariables.photos = photos;
        ejsLocalVariables.searchResults = true;
        return res.render('index', ejsLocalVariables);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  });

  app.get('/zip', (req, res) => {
    const tags = req.query.tags;
    const tagmode = req.query.tagmode;

    const buffer = new Buffer.from(JSON.stringify({ tags, tagmode }));
    pubSubClient.topic(process.env.TOPIC_NAME).publish(buffer);

    res.send('OK');
  });
}

module.exports = route;
