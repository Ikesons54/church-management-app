const Member = require('../models/Member');

const generateMemberId = async () => {
  let isUnique = false;
  let memberId;

  while (!isUnique) {
    // Generate random 4-digit number
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    memberId = `COPAD${randomNum}`;

    // Check if ID exists in database
    const existingMember = await Member.findOne({ memberId });
    if (!existingMember) {
      isUnique = true;
    }
  }

  return memberId;
};

module.exports = { generateMemberId }; 