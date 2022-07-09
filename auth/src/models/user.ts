import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describe the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describe the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describe the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// any time we want to save a doc(instance) into mongoDB
// we need to execute this func
userSchema.pre("save", async function (done) {
  // 如果用 => 会override this关键字, 此时this值当前doc(对象)

  // 只有当new User和更改了password才执行
  if (this.isModified("password")) {
    // 计算passwordHash
    const hashed = await Password.toHash(this.get("password"));
    // 更新password
    this.set("password", hashed);

    // 结束必须call
    done();
  }
});

// everytime we want to build a User, just call this func
// get a custom function build into the model
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// feed model into mongo
// <... , ...> -> model的type
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
