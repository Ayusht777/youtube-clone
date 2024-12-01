import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {VerifyJwt} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file
router.route("/user").get(getUserPlaylists);
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);

router.route("/create/:videoId").post(createPlaylist)

router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);



export default router
