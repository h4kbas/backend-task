const express = require('express');
const { Op, fn, col } = require("sequelize");
const {getProfile} = require('../middleware/getProfile')
const router = express.Router();

// Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
router.post('/deposit/:userId', getProfile, async (req, res) => {
  const {Job, Profile, Contract} = req.app.get('models');

  const {userId}= req.params;
  const {amount} = req.body;
  
  const client = await Profile.findOne({where:{id: userId}});
  if(client?.type !== 'client')
    return res.status(401).end();

  const jobs = await Contract.findAll({
    where: {
      '$Jobs.paid$': {[Op.is]: null}, 
      status: {[Op.ne]: 'terminated'},
      ClientId: client.id
    },
    attributes:[ [fn('SUM', col('Jobs.price')), 'total'] ],
    include: {model: Job, as: 'Jobs', attributes:[]}
  });
  const total = await jobs[0].get('total');

  if(amount > (total * 0.25))
    return res.status(400).end();

  res.json({status: 'success', total, amount});

})




module.exports = router;