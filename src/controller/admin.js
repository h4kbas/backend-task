const express = require('express');
const { Op, fn, col, literal } = require("sequelize");
const {getProfile} = require('../middleware/getProfile')

const router = express.Router();

// Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
router.get('/best-profession', getProfile ,async (req, res) => {
  const {Job, Profile, Contract} = req.app.get('models');

  const {start, end} = req.query;

  const professions = await Profile.findAll({
    where: {
      '$Contractor.Jobs.paid$': {[Op.is]: true},
      '$Contractor.Jobs.paymentDate$': {[Op.between]:[start, end]}
    },
    attributes:['profession', [fn('SUM', col('Contractor.Jobs.price')), 'total'] ],
    include: [
      {model: Contract, as: 'Contractor', include:{ model: Job, as: 'Jobs', attributes: []}, attributes: []},
    ],
    group: ['profession'],
    order:[ [col('total'), 'DESC']  ],
  })
  res.json(professions[0])
});

router.get('/best-clients', getProfile ,async (req, res) => {
  const {Job, Profile, Contract} = req.app.get('models');

  const {start, end, limit} = req.query;

  const clients = await Profile.findAll({
    where: {
      '$Client.Jobs.paid$': {[Op.is]: true},
      '$Client.Jobs.paymentDate$': {[Op.between]:[start, end]}
    },
    
    attributes:[ 
      'id',
      [literal("firstName || ' ' || lastName"), 'fullName'], 
      [fn('SUM', col('Client.Jobs.price')), 'paid'] 
    ],
    
    include: [
      {model: Contract, as: 'Client', include:{ model: Job, as: 'Jobs', attributes: []}, attributes: []},
    ],
    group: ['fullName'],
    order:[ [col('paid'), 'DESC']  ],
    limit: limit || 2,
    subQuery: false

  })

  res.json(clients)
});





module.exports = router;