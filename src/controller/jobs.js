const express = require('express');
const {sequelize} = require("../model");
const { Op } = require("sequelize");
const {getProfile} = require('../middleware/getProfile')
const {isClient} = require('../middleware/isClient')

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

// Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
router.post('/:job_id/pay', getProfile, isClient, async (req, res) => {
  const {Job, Profile, Contract} = req.app.get('models');

  const jobId = req.params.job_id;
  const job = await Job.findOne({ 
    where:{id: jobId, paid: {[Op.is]: null}  }, 
    include:{
      model: Contract,
      as: 'Contract'
    },
  });
  if(!job)
    return res.status(404).end();
  if(req.profile.id !== job.Contract.ClientId)
    return res.status(400).end();

  const client = await Profile.findOne({where:{id: job.Contract.ClientId}});
  const contractor = await Profile.findOne({where:{id: job.Contract.ContractorId}});
  
  if(client.balance < job.price)
    return res.status(400).end();
  
  const t = await sequelize.transaction();
  try {
    // Take money from client
    await Profile.decrement({balance: job.price}, {where:{id: client.id}, transaction: t });
    // Give money to the contractor
    await Profile.increment({balance: job.price}, {where:{id: contractor.id}, transaction: t });
    // Make job paid
    await Job.update({paid:true, paymentDate: new Date()}, {where:{id: job.id}, transaction: t });
    // Good to go
    await t.commit();
    res.json({status: "success", client});
  } catch (error) {
    await t.rollback();
    return res.status(400).end();
  }

})


module.exports = router;