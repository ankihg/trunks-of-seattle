'use strict';

module.exports = (router, models) => {
  let Species = models.Species;

  router.route('/species')
    .get((req, res) => {
      Species.find({}, (err, species) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({data: species});
      });
    })
    .post((req, res) => {
      var newSpecies = new Species(req.body);
      newSpecies.save((err, species) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json(species);
      });
    });

  router.route('/species/:species')
    .get((req, res) => {
      Species.findById(req.params.species, (err, species) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json(species);
      });
    })
    .put((req, res) => {
      Species.findByIdAndUpdate(req.params.species, req.body, {new: true}, (err, species) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json(species);
      });
    })
    .delete((req, res) => {
      Species.findByIdAndRemove(req.params.species, (err, species) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({message: 'Deleted Species', data: species});
      });
    });
};
