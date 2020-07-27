const fs = require("fs");
const crypto = require("crypto");
const log = console.log;

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
    attrs.id = this.randomId();
    const record = await this.getAll();
    record.push(attrs);
    await this.writeAll(record);
  }

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
}
//an helper function to run await function coz node directly casnt run await fn without async
const test = async () => {
  const repo = new UsersRepository("users.json");
  // await repo.create({
  //   email: "test@test.com",
  //   password: "dfjhdgfjhdg",
  // });
  // const users = await repo.getAll();
  // const user = await repo.getOne("12fbcdb1");
  await repo.delete("12fbcdb1");
};

test();
