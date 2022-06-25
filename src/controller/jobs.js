const express = require('express');
const { Op } = require("sequelize");
const {getProfile} = require('../middleware/getProfile')

const router = express.Router();

//  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
router.get('/unpaid', getProfile, async (req, res) => {
  const {Job, Contract} = req.app.get('models');
  const profileId = req.profile.id
  const jobs = await Job.findAll({
    where: {
      'paid': {[Op.is]: null},
      [Op.or]:[
        {'$Contract.ClientId$': profileId, '$Contract.status$': {[Op.ne]: 'terminated'} },
        {'$Contract.ContractorId$': profileId, '$Contract.status$': {[Op.ne]: 'terminated'} },
      ],
    },
    include: [
      {
        model: Contract,
        as: 'Contract'
      },

    ]
  });

  res.json(jobs);
})

module.exports = router;