const express = require("express");
const router = express.Router();
// Load User model
const Breeder = require("../../models/Breeder");

// @route POST api/breeders/
// @desc Register user
// @access Public
router.post("/", async (req, res) => {
  const { breederName, petTypeId, breederGender, breederDOB, breederDesc } = req.body;
  let breederPhoto = req.files[0].filename;
  try {
    let breeder  = new Breeder({
      breederName,
      petTypeId,
      breederGender,
      breederDOB,
      breederDesc,
      breederPhoto
    });

    await breeder.save();

    breeder = await Breeder.findOne({ _id : breeder._id }).populate("petTypeId");

    return res.json({
      success: true,
      breeder:{
        _id: breeder._id,
        breederName: breeder.breederName,
        petTypeId: breeder.petTypeId,
        breederGender :breeder.breederGender,
        breederDOB: breeder.breederDOB,
        breederDesc: breeder.breederDesc,
        breederPhoto: breeder.breederPhoto
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.put("/", async (req, res) => {
  const { breederId, breederName, petTypeId, breederGender, breederDOB, breederDesc } = req.body;
  try {
    let breeder = await Breeder.findById(breederId);
    if (breeder) {
      breeder.breederName = breederName
      breeder.petTypeId = petTypeId
      breeder.breederGender = breederGender
      breeder.breederDOB = breederDOB
      breeder.breederDesc = breederDesc
      if(req.files[0])
        breeder.breederPhoto = req.files[0].filename
      await breeder.save()
    }
    breeder = await Breeder.findById(breeder._id).populate("petTypeId")

    return res.json({
      success: true,
      breeder:{
        breederId: breeder._id,
        breederName: breeder.breederName,
        petTypeId: breeder.petTypeId,
        breederGender :breeder.breederGender,
        breederDOB: breeder.breederDOB,
        breederDesc: breeder.breederDesc,
        breederPhoto: breeder.breederPhoto
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get("/", async (req, res) => {
  try {
    const offset = req.query.offset;
    const limit = req.query.limit;
    const countBreeders = await Breeder.find({})
    const breeders = await Breeder.find({}).skip(parseInt(offset)).limit(parseInt(limit)).populate("petTypeId")
    res.json({
      success: true,
      totalCount: countBreeders.length,
      entities: breeders
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const breeder = await Breeder.findById(req.params.id).populate("petTypeId")
    res.json({
      success: true,
      breeder:{
        breederId: breeder._id,
        breederName: breeder.breederName,
        petTypeId: breeder.petTypeId,
        breederGender :breeder.breederGender,
        breederDOB: breeder.breederDOB,
        breederDesc: breeder.breederDesc,
        breederPhoto: breeder.breederPhoto
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Breeder.findOneAndDelete({_id:req.params.id})
    res.json({
      state:true
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
