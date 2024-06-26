export const ServicesConstant = {
    USER_MGMT: {
        DO_LOGIN: { END_POINT: 'User/Login', TYPE: 'POST' },
        SIGN_UP: { END_POINT: 'User/SignUp', TYPE: 'POST' },
        FORGOT_PASSWORD: { END_POINT: 'User/ForgotPassword', TYPE: 'POST' },
        VERIFY_OTP: { END_POINT: 'User/VerifyCode', TYPE: 'POST' },
        RESET_PASSWORD: { END_POINT: 'User/ResetPassword', TYPE: 'POST' },
        UPLOAD_PROFILE_PICTURE: { END_POINT: 'User/UploadProfilePic', TYPE: 'POST' },
        ADD_SELF_SCORE: { END_POINT: 'User/AddScore', TYPE: 'POST' },
        GET_SELF_SCORE: { END_POINT: 'User/GetScore?Userid=', TYPE: 'GET' },
        GET_OTHER_SCORE: { END_POINT: 'User/GetScoreWithProfile', TYPE: 'POST' },
        GET_SELF_RATINGS: { END_POINT: 'User/getselfscore?UserID=', TYPE: 'GET' },
        GET_ALL_CATEGORY: { END_POINT: 'User/GetAllCategory', TYPE: 'POST' },
        MY_CONNECTIONS: { END_POINT: 'User/GetConnections', TYPE: 'POST' },
        REMOVE_CONNECTION: { END_POINT: 'User/ConnectionRemove', TYPE: 'POST' },
        GET_CONNECTION_RATING: { END_POINT: 'User/GetConnectionRating?CRID=', TYPE: 'GET' },
        USER_FILTER_EMAIL: { END_POINT: 'User/FilterEmail', TYPE: 'POST' },
        EMAIL_SEARCH_LIST: { END_POINT: 'User/EmailSearchList', TYPE: 'POST' },
        ADD_TO_MY_CONNECTION_REQUEST: { END_POINT: 'User/AddRequest', TYPE: 'POST' },
        INVITE_USER: { END_POINT: 'User/Invite', TYPE: 'POST' },
        GET_PROFILE_DETAILS: { END_POINT: 'User/GetProfileDetails?userId=', TYPE: 'GET' },
        UPDATE_PROFILE: { END_POINT: 'User/ProfileUpdate', TYPE: 'POST' },
        ADD_FEED: { END_POINT: 'User/AddFeed', TYPE: 'UPLOAD' },
        GET_FEEDS: { END_POINT: 'User/GetFeedList', TYPE: 'POST' },
        ADD_REACTIONS: { END_POINT: 'User/AddReactions', TYPE: 'POST' },
        SCORE_SUMMARY_BY_TRAITS: { END_POINT: 'User/ScoreSummarybytraits', TYPE: 'POST' },
        SCORE_SUMMARY_BY_CATEGORY: { END_POINT: 'User/ScoreSummarybycategory', TYPE: 'POST' },
        SEND_PUSH_TOKEN: { END_POINT: 'User/AddUserToken', TYPE: 'POST' },
        GET_STORY: { END_POINT: 'User/GetStoryList', TYPE: 'POST' },
        ADD_UPDATE_WORK_DETAILS: { END_POINT: 'User/AddUpdateWorkDetails', TYPE: 'POST' },
        ADD_UPDATE_EDUCATION_DETAILS: { END_POINT: 'User/AddUpdateEducationDetails', TYPE: 'POST' },
        CHANGE_MUTE_STATUS: { END_POINT: 'User/UpdateMute', TYPE: 'POST' },
        GET_INITAL_CONTACT_LIST: { END_POINT: 'User/GetSearchList?UserID=', TYPE: 'GET' },
        DELETE_WORK_DETAIL: { END_POINT: 'User/UserWorkDelete', TYPE: 'POST' },
        DELETE_EDUCATION_DETAIL: { END_POINT: 'User/DeleteEducationDetails', TYPE: 'POST' },
        SHARE_POST: { END_POINT: 'User/AddShare', TYPE: 'POST' },
        DELETE_COMMENT: { END_POINT: 'User/DeleteComments', TYPE: 'POST' },
        UPDATE_COMMENT: { END_POINT: 'User/UpdateComments', TYPE: 'POST' },
        GET_TAG_LIST_SEARCH: { END_POINT: 'User/GetConnectionSearchList', TYPE: 'POST' },
        GET_FRIENDSHIP_DATA: { END_POINT: 'User/GetFrindShip', TYPE: 'POST' },
        DELETE_FEED: { END_POINT: 'User/DeleteFeed', TYPE: 'POST' },
        UPDATE_FEED: { END_POINT: 'User/UpdateFeed', TYPE: 'POST' },
        SEND_MSG: { END_POINT: 'User/AddNotifications', TYPE: 'POST' },
        LOGOUT_USER: { END_POINT: 'User/LogOut', TYPE: 'POST' },
        GET_USER_SELF_STATUS: { END_POINT: 'User/SelfScoreGet?UserID=', TYPE: 'GET' },
        GET_USER_RATING_CARD: { END_POINT: 'User/ConvertHtmlToImage?UserID=', TYPE: 'GET' },
        GET_FEED_RESPONSE_ON_FEED_ID:{END_POINT: 'User/GetFeedResponseOnFeedId', TYPE:'POST'},
        GET_MY_FEEDS:{END_POINT: 'User/GetFeedResponseForPost', TYPE:'POST'},
        UPDATE_PRIVACY_SETTING:{END_POINT: 'User/UserPrivacyDetails', TYPE:'POST'},
        DELETE_ACCOUNT:{END_POINT: 'User/DeActivateAccount', TYPE:'POST'},
        REMOVE_TAG:{END_POINT: 'User/RemoveTagging', TYPE:'POST'},
        GET_USER_PRIVACY_DETAILS:{END_POINT: 'User/getUserPrivacyDetails', TYPE:'POST'}, 
        ADD_UPDATE_FEED_TAGS: {END_POINT: 'User/Updatetagging', TYPE:'POST'},       
    },
    PROFILE: {
        GET_USER: { END_POINT: 'User/GetUserById?userId=5', TYPE: 'GET' },
    },
    NOTIFICATION: {
        GET_NOTIFICATIONS: { END_POINT: 'User/MyNotifications', TYPE: 'POST' },        
        APPROVE_REQUEST: { END_POINT: 'User/ApproveRequest', TYPE: 'POST' },
        GET_CHARACTIFY_STATUS:{END_POINT: 'User/GetScoreStatus', TYPE:'POST'}
    }
};