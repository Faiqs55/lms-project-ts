import mongoose, {Document, Model, Schema} from "mongoose";
import { IUser } from "./user.model";

export interface IComment extends Document{
    user: IUser;
    question: string;
    questionReply: IComment[];
}

interface IReview extends Document{
    user: IUser;
    rating?: number;
    comment: string;
    commentReplies: IReview[];
}

interface ILink extends Document{
    title: string;
    url: string;
}

interface ICourseData extends Document{
    title: string;
    description: string;
    videoURL: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

export interface ICourse extends Document{
    name: string;
    description: string;
    categories: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoURL: string;
    benefits: {title: string}[];
    prerequisites: {title: string}[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased: number
};


// SCHEMAS 

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
    },
    commentReplies: [Object],
}, {timestamps: true});


const linkSchema = new Schema<ILink>({
    title: String,
    url: String
});

const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReply: [Object]
}, {timestamps: true});

const courseDataSchema = new Schema<ICourseData>({
    title: String,
    description: String,
    videoURL: String,
    videoThumbnail: Object,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categories:{
    type:String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  tags:{
    type: String,
    required: true,
  },
  level:{
    type: String,
    required: true,
  },
  demoURL:{
    type: String,
    required: true,
  },
  benefits: [{title: String}],
  prerequisites: [{title: String}],
  reviews: [reviewSchema],
   courseData: [courseDataSchema],
   ratings:{
     type: Number,
     default: 0,
   },
   purchased:{
    type: Number,
    default: 0,
   },
},{timestamps: true});


const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;

