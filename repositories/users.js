const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
//convert scrypt callback based to promise based, to use async-await sytax
const scrypt = util.promisify(crypto.scrypt);
const keyLen = 64;

class UsersRepository {
  constructor(filename) {
    if (!filename) throw new Error("Creating a repo requires a filename");
    this.filename = filename;
    try {
      //constructors cant be async in nature and also we dont want to create another method to check for existence of file
      //and also we create instance of this repo only once
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }
  //getAll users list
  async getAll() {
    //open the file ,read its contents and parse the data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
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

  async comparePasswords(saved, supplied) {
    //saved -> password saved in db. -> hashed.salt
    //supplied -> password given by user to sign in
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, keyLen);

    return hashed === hashedSuppliedBuf.toString("hex");
  }
  //write data of all records
  async writeAll(record) {
    await fs.promises.writeFile(this.filename, JSON.stringify(record, null, 2));
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
  //get one particular item
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }
  //delete a record
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
  //update a record
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} is not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }
  //get first object based on filters
  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) found = false;
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository("users.json");
