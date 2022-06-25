const express = require('express');
const { Op } = require("sequelize");
const {getProfile} = require('../middleware/getProfile')

const router = express.Router();


// Returns the contract of given id only if it belongs to the profile calling
router.get('/:id', getProfile ,async (req, res) =>{
  const {Contract} = req.app.get('models')
  const {id} = req.params
  const profileId = req.profile.id
  
  // Check if profileId matches with either ClientId or ContractorId to ensure the contacts belongs to the profile 
  const contract = await Contract.findOne({
      where: { id, 
          [Op.or]:[
              { ClientId: profileId },
              { ContractorId: profileId }
          ]
      }
  })
  if(!contract) return res.status(404).end()
  res.json(contract)
})

module.exports = router;