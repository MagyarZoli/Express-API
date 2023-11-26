import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

export interface MongoUser {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  created_date?: Date;
  googleId?: string;
  githubId?: string;
  facebookId?: string;
  __v?: number;
}

interface IUser {
  username: string;
  email: string;
  password: string;
  created_date?: Date;
  googleId?: string;
  githubId?: string;
  facebookId?: string;
}

interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {
  login(email: string, password: string): Promise<IUserDocument>;
}

const userSchema = new Schema<IUserDocument, IUserModel>({
  username: {
    type: String,
    required: [true, "Please enter an username"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  googleId: {
    type: String
  },
  githubId: {
    type: String
  },
  facebookId: {
    type: String
  }
});

userSchema.pre<IUserDocument>('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.statics.login = async function(email: string, password: string): Promise<IUserDocument> {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) return user;
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export default User;
