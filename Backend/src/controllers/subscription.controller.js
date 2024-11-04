import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
   // TODO: toggle subscription
   //get channelId from params
   //then check if user has subscribed to channel or not
   //if subscribed then
   //unsubscribe from channel
   //else
   //subscribe to channel
   //return response
  const { channelId } = req.params;

  const user =req.user._id; // it is as susbsriberid
  if(!channelId || !isValidObjectId(channelId)){
    throw new ApiError(406,"channel id is required");
  }
   const channel = await User.findById({_id:channelId});
   if(!channel){
    throw new ApiError(404,"channel not found");
   }
   const isSubsribed = await Subscription.findOneAndDelete({subscriberId:user,channelId:channelId});
   if(!isSubsribed){
    const createSubscription = await Subscription.create({
      subscriberId:user,
      channelId:channelId,
    })
    if(!createSubscription){
      throw new ApiError(404,"subscription not created");
    }
    return res.status(200).json(new ApiResponse(200,{Subscription:createSubscription._id,state:true},"subscription created"));
   }
   return res.status(200).json(new ApiResponse(200,{Subscription:null,state:false},"subscription removed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
