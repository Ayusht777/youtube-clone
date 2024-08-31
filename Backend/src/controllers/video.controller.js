import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileCloudinary } from "../service/cloudinary.js";
// const cussword = [
//   "4r5e",
//   "5h1t",
//   "5hit",
//   "a55",
//   "anal",
//   "anus",
//   "ar5e",
//   "arrse",
//   "arse",
//   "ass",
//   "ass-fucker",
//   "asses",
//   "assfucker",
//   "assfukka",
//   "asshole",
//   "assholes",
//   "asswhole",
//   "a_s_s",
//   "b!tch",
//   "b00bs",
//   "b17ch",
//   "b1tch",
//   "ballbag",
//   "balls",
//   "ballsack",
//   "bastard",
//   "beastial",
//   "beastiality",
//   "bellend",
//   "bestial",
//   "bestiality",
//   "bi+ch",
//   "biatch",
//   "bitch",
//   "bitcher",
//   "bitchers",
//   "bitches",
//   "bitchin",
//   "bitching",
//   "bloody",
//   "blow job",
//   "blowjob",
//   "blowjobs",
//   "boiolas",
//   "bollock",
//   "bollok",
//   "boner",
//   "boob",
//   "boobs",
//   "booobs",
//   "boooobs",
//   "booooobs",
//   "booooooobs",
//   "breasts",
//   "buceta",
//   "bugger",
//   "bum",
//   "bunny fucker",
//   "butt",
//   "butthole",
//   "buttmuch",
//   "buttplug",
//   "c0ck",
//   "c0cksucker",
//   "carpet muncher",
//   "cawk",
//   "chink",
//   "cipa",
//   "cl1t",
//   "clit",
//   "clitoris",
//   "clits",
//   "cnut",
//   "cock",
//   "cock-sucker",
//   "cockface",
//   "cockhead",
//   "cockmunch",
//   "cockmuncher",
//   "cocks",
//   "cocksuck",
//   "cocksucked",
//   "cocksucker",
//   "cocksucking",
//   "cocksucks",
//   "cocksuka",
//   "cocksukka",
//   "cok",
//   "cokmuncher",
//   "coksucka",
//   "coon",
//   "cox",
//   "crap",
//   "cum",
//   "cummer",
//   "cumming",
//   "cums",
//   "cumshot",
//   "cunilingus",
//   "cunillingus",
//   "cunnilingus",
//   "cunt",
//   "cuntlick",
//   "cuntlicker",
//   "cuntlicking",
//   "cunts",
//   "cyalis",
//   "cyberfuc",
//   "cyberfuck",
//   "cyberfucked",
//   "cyberfucker",
//   "cyberfuckers",
//   "cyberfucking",
//   "d1ck",
//   "damn",
//   "dick",
//   "dickhead",
//   "dildo",
//   "dildos",
//   "dink",
//   "dinks",
//   "dirsa",
//   "dlck",
//   "dog-fucker",
//   "doggin",
//   "dogging",
//   "donkeyribber",
//   "doosh",
//   "duche",
//   "dyke",
//   "ejaculate",
//   "ejaculated",
//   "ejaculates",
//   "ejaculating",
//   "ejaculatings",
//   "ejaculation",
//   "ejakulate",
//   "f u c k",
//   "f u c k e r",
//   "f4nny",
//   "fag",
//   "fagging",
//   "faggitt",
//   "faggot",
//   "faggs",
//   "fagot",
//   "fagots",
//   "fags",
//   "fanny",
//   "fannyflaps",
//   "fannyfucker",
//   "fanyy",
//   "fatass",
//   "fcuk",
//   "fcuker",
//   "fcuking",
//   "feck",
//   "fecker",
//   "felching",
//   "fellate",
//   "fellatio",
//   "fingerfuck",
//   "fingerfucked",
//   "fingerfucker",
//   "fingerfuckers",
//   "fingerfucking",
//   "fingerfucks",
//   "fistfuck",
//   "fistfucked",
//   "fistfucker",
//   "fistfuckers",
//   "fistfucking",
//   "fistfuckings",
//   "fistfucks",
//   "flange",
//   "fook",
//   "fooker",
//   "fuck",
//   "fucka",
//   "fucked",
//   "fucker",
//   "fuckers",
//   "fuckhead",
//   "fuckheads",
//   "fuckin",
//   "fucking",
//   "fuckings",
//   "fuckingshitmotherfucker",
//   "fuckme",
//   "fucks",
//   "fuckwhit",
//   "fuckwit",
//   "fudge packer",
//   "fudgepacker",
//   "fuk",
//   "fuker",
//   "fukker",
//   "fukkin",
//   "fuks",
//   "fukwhit",
//   "fukwit",
//   "fux",
//   "fux0r",
//   "f_u_c_k",
//   "gangbang",
//   "gangbanged",
//   "gangbangs",
//   "gaylord",
//   "gaysex",
//   "goatse",
//   "God",
//   "god-dam",
//   "god-damned",
//   "goddamn",
//   "goddamned",
//   "hardcoresex",
//   "hell",
//   "heshe",
//   "hoar",
//   "hoare",
//   "hoer",
//   "homo",
//   "hore",
//   "horniest",
//   "horny",
//   "hotsex",
//   "jack-off",
//   "jackoff",
//   "jap",
//   "jerk-off",
//   "jism",
//   "jiz",
//   "jizm",
//   "jizz",
//   "kawk",
//   "knob",
//   "knobead",
//   "knobed",
//   "knobend",
//   "knobhead",
//   "knobjocky",
//   "knobjokey",
//   "kock",
//   "kondum",
//   "kondums",
//   "kum",
//   "kummer",
//   "kumming",
//   "kums",
//   "kunilingus",
//   "l3i+ch",
//   "l3itch",
//   "labia",
//   "lust",
//   "lusting",
//   "m0f0",
//   "m0fo",
//   "m45terbate",
//   "ma5terb8",
//   "ma5terbate",
//   "masochist",
//   "master-bate",
//   "masterb8",
//   "masterbat*",
//   "masterbat3",
//   "masterbate",
//   "masterbation",
//   "masterbations",
//   "masturbate",
//   "mo-fo",
//   "mof0",
//   "mofo",
//   "mothafuck",
//   "mothafucka",
//   "mothafuckas",
//   "mothafuckaz",
//   "mothafucked",
//   "mothafucker",
//   "mothafuckers",
//   "mothafuckin",
//   "mothafucking",
//   "mothafuckings",
//   "mothafucks",
//   "mother fucker",
//   "motherfuck",
//   "motherfucked",
//   "motherfucker",
//   "motherfuckers",
//   "motherfuckin",
//   "motherfucking",
//   "motherfuckings",
//   "motherfuckka",
//   "motherfucks",
//   "muff",
//   "mutha",
//   "muthafecker",
//   "muthafuckker",
//   "muther",
//   "mutherfucker",
//   "n1gga",
//   "n1gger",
//   "nazi",
//   "nigg3r",
//   "nigg4h",
//   "nigga",
//   "niggah",
//   "niggas",
//   "niggaz",
//   "nigger",
//   "niggers",
//   "nob",
//   "nob jokey",
//   "nobhead",
//   "nobjocky",
//   "nobjokey",
//   "numbnuts",
//   "nutsack",
//   "orgasim",
//   "orgasims",
//   "orgasm",
//   "orgasms",
//   "p0rn",
//   "pawn",
//   "pecker",
//   "penis",
//   "penisfucker",
//   "phonesex",
//   "phuck",
//   "phuk",
//   "phuked",
//   "phuking",
//   "phukked",
//   "phukking",
//   "phuks",
//   "phuq",
//   "pigfucker",
//   "pimpis",
//   "piss",
//   "pissed",
//   "pisser",
//   "pissers",
//   "pisses",
//   "pissflaps",
//   "pissin",
//   "pissing",
//   "pissoff",
//   "poop",
//   "porn",
//   "porno",
//   "pornography",
//   "pornos",
//   "prick",
//   "pricks",
//   "pron",
//   "pube",
//   "pusse",
//   "pussi",
//   "pussies",
//   "pussy",
//   "pussys",
//   "rectum",
//   "retard",
//   "rimjaw",
//   "rimming",
//   "s hit",
//   "s.o.b.",
//   "sadist",
//   "schlong",
//   "screwing",
//   "scroat",
//   "scrote",
//   "scrotum",
//   "semen",
//   "sex",
//   "sh!+",
//   "sh!t",
//   "sh1t",
//   "shag",
//   "shagger",
//   "shaggin",
//   "shagging",
//   "shemale",
//   "shi+",
//   "shit",
//   "shitdick",
//   "shite",
//   "shited",
//   "shitey",
//   "shitfuck",
//   "shitfull",
//   "shithead",
//   "shiting",
//   "shitings",
//   "shits",
//   "shitted",
//   "shitter",
//   "shitters",
//   "shitting",
//   "shittings",
//   "shitty",
//   "skank",
//   "slut",
//   "sluts",
//   "smegma",
//   "smut",
//   "snatch",
//   "son-of-a-bitch",
//   "spac",
//   "spunk",
//   "s_h_i_t",
//   "t1tt1e5",
//   "t1tties",
//   "teets",
//   "teez",
//   "testical",
//   "testicle",
//   "tit",
//   "titfuck",
//   "tits",
//   "titt",
//   "tittie5",
//   "tittiefucker",
//   "titties",
//   "tittyfuck",
//   "tittywank",
//   "titwank",
//   "tosser",
//   "turd",
//   "tw4t",
//   "twat",
//   "twathead",
//   "twatty",
//   "twunt",
//   "twunter",
//   "v14gra",
//   "v1gra",
//   "vagina",
//   "viagra",
//   "vulva",
//   "w00se",
//   "wang",
//   "wank",
//   "wanker",
//   "wanky",
//   "whoar",
//   "whore",
//   "willies",
//   "willy",
//   "xrated",
//   "xxx",
// ];
// const validateStringforCussWord = (string) => {
//   const words = string.split(/\s+/);

//   return words.some((word) => cussword.includes(word.toLowerCase()));
// };
const MIN_IMAGE_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MIN_VIDEO_FILE_SIZE = 20 * 1024; // 20 KB
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const allowedVideoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/3gpp",
  "video/x-msvideo",
  "video/quicktime",
  "video/x-matroska",
  "video/x-flv",
  "video/avi",
  "video/x-ms-wmv",
];
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  //myTODO :
  // get video title,description,videoFile,thumbnail
  //validate the title ,description --->based on string
  //validate thumbnail on base of image
  //validate video on base of video

  //upload video and thumbnail on cloudniary
  //add the to sb with owner info
  //send response
  const { title, description } = req.body;

  if ((title.trim() || description.trim()) === "") {
    throw new ApiError(406, "title and description is required");
  }
  if (title.trim().length < 3) {
    throw new ApiError(411, "title should be at least 3 letters");
  }
  if (description.trim().length < 10) {
    throw new ApiError(411, "title should be at least of 3 letters");
  }

  const { videoFile, thumbnailFile } = req.files;

  const thumbnailFilePath = thumbnailFile[0]?.path;
  const videoFilePath = videoFile[0]?.path;

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(406, "thumbnail and video is required");
  }
  const { mimetype: thumbnailMimeType, size: thumbnailSize } = thumbnailFile[0];
  if (!allowedImageMimeTypes.includes(thumbnailMimeType)) {
    throw new ApiError(406, "thumbnail should be image");
  }
  if (
    thumbnailSize < MIN_IMAGE_FILE_SIZE ||
    thumbnailSize > MAX_IMAGE_FILE_SIZE
  ) {
    throw new ApiError(406, "thumbnail size should be between 20KB and 5MB");
  }
  const { mimetype: videoMimeType, size: videoSize } = videoFile[0];
  if (!allowedVideoMimeTypes.includes(videoMimeType)) {
    throw new ApiError(406, "video should be image");
  }
  if (videoSize < MIN_VIDEO_FILE_SIZE || videoSize > MAX_VIDEO_FILE_SIZE) {
    throw new ApiError(406, "video size should be between 20KB and 100MB");
  }
  const thumbnailResponse = await uploadFileCloudinary(thumbnailFilePath);
  if (!thumbnailResponse?.url || !thumbnailResponse?.publicId) {
    throw new ApiError(500, "thumbnail is not uplaoded on cloudinary");
  }

  const videoResponse = await uploadFileCloudinary(videoFilePath);
  if (!videoResponse?.url || !videoResponse?.publicId) {
    throw new ApiError(500, "video is not uplaoded on cloudinary");
  }
  const user = req?.user._id;

  const videoAddedToDB = await Video.create({
    videoFile: {
      url: videoResponse.url,
      publicId: videoResponse.publicId,
    },
    thumbnail: {
      url: thumbnailResponse.url,
      publicId: thumbnailResponse.publicId,
    },
    title,
    description,
    owner: user,
    isPublished: true,
    duration: videoResponse.duration,
  });

  if (!videoAddedToDB) {
    throw new ApiError(500, "video is not added to db");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "video is published successfully", videoAddedToDB)
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  //then check if video published or not
  //if published then return videourl , thumbnailurl, title, description
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
