import mongoose, { isValidObjectId } from 'mongoose';
import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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

  const user = req.user._id; // it is as susbsriberid
  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(406, 'channel id is required');
  }
  const channel = await User.findById({ _id: channelId });
  if (!channel) {
    throw new ApiError(404, 'channel not found');
  }
  const isSubsribed = await Subscription.findOneAndDelete({
    subscriberId: user,
    channelId: channelId,
  });
  if (!isSubsribed) {
    const createSubscription = await Subscription.create({
      subscriberId: user,
      channelId: channelId,
    });
    if (!createSubscription) {
      throw new ApiError(404, 'subscription not created');
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { Subscription: createSubscription._id, state: true },
          'subscription created'
        )
      );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Subscription: null, state: false },
        'subscription removed'
      )
    );
});

// controller to return subscriber list of a channel
const getChannelSubscribers = asyncHandler(async (req, res) => {
  // TODO: get subscriber list of a channel from channelId
  // GET and Validate channelId
  // return total count of subsrciber number in response
  const { channelId } = req.params;
  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(406, 'channel id is required');
  }
  const channelSubscriber = await Subscription.aggregate([
    { $match: { channelId: new mongoose.Types.ObjectId(channelId) } },
  ]);
  if (channelSubscriber.length > 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelSubscriber.length,
          'subscribers fetched successfully'
        )
      );
  }
  res.status(200).json(new ApiResponse(200, 0, 'channel has no subscribers'));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  //TODO: get channel list to which user has subscribed
  //get user id from req.user or subscriberId from params === user id
  const user = req.user?._id;

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriberId: new mongoose.Types.ObjectId(user),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'channelId',
        foreignField: 'owner',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'channelOwner',
            },
          },
          { $unwind: '$channelOwner' },
          {
            $project: {
              title: 1,
              description: 1,
              thumbnail: '$thumbnail.url',
              views: 1,
              createdAt: 1,
              channelName: '$channelOwner.userName',
              channelAvatar: '$channelOwner.avatar.url',
            },
          },
        ],
        as: 'videos',
      },
    },
    { $unwind: '$videos' },
    { $sort: { createdAt: 1 } },
    {
      $replaceRoot: { newRoot: '$videos' },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        'subscribed channels fetched successfully'
      )
    );
});

export { getChannelSubscribers, getSubscribedChannels, toggleSubscription };
