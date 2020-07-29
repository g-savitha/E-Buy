const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");
//convert scrypt callback based to promise based, to use async-await sytax
const scrypt = util.promisify(crypto.scrypt);
const keyLen = 64;

class UsersRepository extends Repository {
  async comparePasswords(saved, supplied) {
    //saved -> password saved in db. -> hashed.salt
    //supplied -> password given by user to sign in
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, keyLen);
    return hashed === hashedSuppliedBuf.toString("hex");
  }
  //create a user
  async create(attrs) {
    //attrs === {email:'',password:''}
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buffer = await scrypt(attrs.password, salt, keyLen);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buffer.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);
    return record;
  }
}

module.exports = new UsersRepository("users.json");
