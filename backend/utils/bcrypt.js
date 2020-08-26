const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    // console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);
    return hashedPassword;
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try{
    // console.log(password, hashPassword);
    return await bcrypt.compare(password, hashedPassword);
  }catch(err){
    console.log(err);
    return new Error(err);
  }
};

module.exports = { hashPassword, comparePassword };
