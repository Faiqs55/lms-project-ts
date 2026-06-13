import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Interface 
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

// User Schema 
const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value);
      },
      message: "Please enter a Valid Email.",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter your password."],
    minLength: [6, "Password must be at least 6 charachters"],
    select: false,
  },

  avatar: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      courseId: String,
    },
  ],
}, { timestamps: true });


// Hash Password 
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return
  }
  this.password = await bcrypt.hash(this.password, 10);
});


// Compare Password 
userSchema.methods.comparePassword = async function (enteredPassowrd: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassowrd, this.password)
}

const UserModel: Model<IUser> = mongoose.model("User", userSchema);
export default UserModel;