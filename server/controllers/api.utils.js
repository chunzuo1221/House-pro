module.exports = {
  responseMongooseFind(promise, req, res) {
    return promise.then((property) => {
      if (property) {
        res.json(property);
      } else {
        res.sendStatus(404);
      }
    }, (e) => {
      res.status(500).json({ error: e });
    });
  },
  responseMongooseSimple(promise, req, res) {
    return promise.then((property) => {
      res.json(property);
    }, (e) => {
      res.status(500).json({ error: e });
    });
  },
  responseMongooseCreate(promise, req, res) {
    return promise.then((item) => {
      res.status(201).json(item);
    }, (e) => {
      res.status(400).json(e);
    });
  }
};
