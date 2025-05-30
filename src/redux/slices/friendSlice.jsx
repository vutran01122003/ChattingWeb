import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDataApi, postDataApi } from "../../utils/fetchData";
import { getUserCredentials } from "../../utils";

const initialState = {
  isFriend: null,
  isSentRequest: null,
  isReceiveRequest: null,
  sentRequests: [],
  receivedRequests: [],
  friendList: [],
  message: "",
  loading: false,
  error: null,
  isBlockedUser: null,
  isBlocked: null,
};

// kiểm tra mối quan hệ bạn bè
export const checkFriendShip = createAsyncThunk(
  "checkFriendShip",
  async ({ friendId }, { rejectWithValue }) => {
    try {
      const { clientId } = getUserCredentials();
      if (!clientId || !friendId) {
        console.error(
          `Dữ liệu đầu vào checkFriendShip không hợp lệ: clientId=${clientId}, friendId=${friendId}`
        );
        return rejectWithValue("Thiếu clientId hoặc friendId");
      }
      const res = await getDataApi(`/user/check-friendship/${friendId}`, null, {
        "x-client-id": clientId,
      });
      return {
        isFriend: res.data.metadata.isFriend,
        message: res.data.metadata.message,
      };
    } catch (error) {
      console.error(`Lỗi checkFriendShip:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kiểm tra trạng thái bạn bè"
      );
    }
  }
);

// Gửi lời mời kết bạn
export const sendFriendRequest = createAsyncThunk(
  "sendFriendRequest",
  async ({ friendId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !friendId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào sendFriendRequest không hợp lệ: clientId=${clientId}, friendId=${friendId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, friendId hoặc accessToken");
      }
      const res = await postDataApi(
        `/user/send-friend-request/${friendId}`,
        {},
        {
          "x-client-id": clientId,
          Authorization: accessToken,
        }
      );
      if (socket?.connected) {
        socket.emit("send_friend_request", {
          fromUserId: clientId,
          toUserId: friendId,
          message: "Bạn có một lời mời kết bạn mới!",
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi sendFriendRequest:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể gửi yêu cầu kết bạn"
      );
    }
  }
);

// Kiểm tra xem đã gửi yêu cầu kết bạn cho người này chưa
export const checkSendFriendRequest = createAsyncThunk(
  "checkSendFriendRequest",
  async ({ friendId }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !friendId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào checkSendFriendRequest không hợp lệ: clientId=${clientId}, friendId=${friendId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, friendId hoặc accessToken");
      }
      const res = await getDataApi(
        `/user/check-send-friend-request/${friendId}`,
        null,
        {
          "x-client-id": clientId,
          Authorization: accessToken,
        }
      );
      return {
        isSentRequest: res.data.metadata.isSentRequest,
        message: res.data.metadata.message,
      };
    } catch (error) {
      console.error(`Lỗi checkSendFriendRequest:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kiểm tra yêu cầu đã gửi"
      );
    }
  }
);

// Hủy yêu cầu kết bạn đã gửi
export const cancelFriendRequest = createAsyncThunk(
  "cancelFriendRequest",
  async ({ friendId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !friendId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào cancelFriendRequest không hợp lệ: clientId=${clientId}, friendId=${friendId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, friendId hoặc accessToken");
      }
      const res = await postDataApi(
        `/user/cancel-friend-request/${friendId}`,
        null,
        {
          "x-client-id": clientId,
          Authorization: accessToken,
        }
      );
      if (socket?.connected) {
        socket.emit("friend_request_canceled", {
          fromUserId: clientId,
          toUserId: friendId,
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi cancelFriendRequest:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể hủy yêu cầu kết bạn"
      );
    }
  }
);

// Từ chối yêu cầu kết bạn từ người khác
export const declineFriendRequest = createAsyncThunk(
  "declineFriendRequest",
  async ({ friendId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !friendId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào declineFriendRequest không hợp lệ: clientId=${clientId}, friendId=${friendId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, friendId hoặc accessToken");
      }
      const res = await postDataApi(
        `/user/decline-friend-request/${friendId}`,
        null,
        {
          "x-client-id": clientId,
          Authorization: accessToken,
        }
      );
      if (socket?.connected) {
        socket.emit("friend_request_declined", {
          fromUserId: clientId,
          toUserId: friendId,
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi declineFriendRequest:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể từ chối yêu cầu kết bạn"
      );
    }
  }
);

// Kiểm tra xem có nhận được yêu cầu kết bạn từ người này chưa
export const checkReceiveFriendRequest = createAsyncThunk(
  "checkReceiveFriendRequest",
  async ({ friendId }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !friendId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào checkReceiveFriendRequest không hợp lệ: clientId=${clientId}, friendId=${friendId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, friendId hoặc accessToken");
      }
      const res = await getDataApi(
        `/user/check-receive-friend-request/${friendId}`,
        null,
        {
          "x-client-id": clientId,
          Authorization: accessToken,
        }
      );
      return {
        isReceiveRequest: res.data.metadata.isReceiveRequest,
        message: res.data.metadata.message,
      };
    } catch (error) {
      console.error(`Lỗi checkReceiveFriendRequest:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kiểm tra yêu cầu nhận được"
      );
    }
  }
);

// Chấp nhận yêu cầu kết bạn từ người khác
export const acceptFriendRequest = createAsyncThunk(
  "acceptFriendRequest",
  async ({ receiverId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !receiverId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào acceptFriendRequest không hợp lệ: clientId=${clientId}, receiverId=${receiverId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, receiverId hoặc accessToken");
      }
      const res = await postDataApi(
        `/user/accept-friend-request/${receiverId}`,
        null,
        {
          "x-client-id": clientId,
          Authorization: accessToken,
        }
      );
      if (socket?.connected) {
        socket.emit("friend_request_accepted", {
          fromUserId: clientId,
          toUserId: receiverId,
        });
        socket.emit("friend_request_accept_success", {
          toUserId: receiverId,
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi acceptFriendRequest:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể chấp nhận yêu cầu kết bạn"
      );
    }
  }
);

// Hủy kết bạn với người khác
export const unfriendUser = createAsyncThunk(
  "unfriendUser",
  async ({ friendId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !friendId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào unfriendUser không hợp lệ: clientId=${clientId}, friendId=${friendId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, friendId hoặc accessToken");
      }
      const res = await postDataApi(`/user/unfriend/${friendId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      if (socket?.connected) {
        socket.emit("user_unfriended", {
          fromUserId: clientId,
          toUserId: friendId,
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi unfriendUser:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể hủy kết bạn"
      );
    }
  }
);

// GET danh sách lời mời đã nhận
export const getReceivedFriendRequests = createAsyncThunk(
  "getReceivedFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào getReceivedFriendRequests không hợp lệ: clientId=${clientId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId hoặc accessToken");
      }
      const res = await getDataApi(`/user/get-receive-friend-request`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      return res.data.metadata;
    } catch (error) {
      console.error(`Lỗi getReceivedFriendRequests:`, error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu nhận được"
      );
    }
  }
);

// GET danh sách lời mời đã gửi
export const getSentFriendRequests = createAsyncThunk(
  "getSentFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào getSentFriendRequests không hợp lệ: clientId=${clientId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId hoặc accessToken");
      }
      const res = await getDataApi(`/user/get-send-friend-request`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      return res.data.metadata;
    } catch (error) {
      console.error(`Lỗi getSentFriendRequests:`, error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu đã gửi"
      );
    }
  }
);

// GET danh sách bạn bè
export const getFriendList = createAsyncThunk(
  "getFriendList",
  async (_, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào getFriendList không hợp lệ: clientId=${clientId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId hoặc accessToken");
      }
      const res = await getDataApi(`/user/get-friend-list`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      return res.data.metadata;
    } catch (error) {
      console.error(`Lỗi getFriendList:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy danh sách bạn bè"
      );
    }
  }
);

//Check xem người dùng này mình đã chặn chưa
export const checkBlockedUser = createAsyncThunk(
  "checkBlockedUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !userId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào checkBlockedUser không hợp lệ: clientId=${clientId}, userId=${userId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, userId hoặc accessToken");
      }
      const res = await getDataApi(`/user/check-blocked-user/${userId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      return {
        isBlockedUser: res.data.metadata.isBlockedUser,
        message: res.data.metadata.message,
      };
    } catch (error) {
      console.error(`Lỗi checkBlockedUser:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kiểm tra trạng thái bị chặn"
      );
    }
  }
);

// Check xem người dùng có chặn mình hay không
export const checkIsBlockedUser = createAsyncThunk(
  "checkIsBlockedUser",
  async ({ userId }, { rejectWithValue }) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>> load lại checkIsBlockedUser");
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !userId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào checkIsBlockedUser không hợp lệ: clientId=${clientId}, userId=${userId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, userId hoặc accessToken");
      }
      const res = await getDataApi(`/user/check-is-blocked/${userId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      return {
        isBlocked: res.data.metadata.isBlocked,
        message: res.data.metadata.message,
      };
    } catch (error) {
      console.error(`Lỗi checkIsBlockedUser:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể kiểm tra trạng thái bị chặn"
      );
    }
  }
);

// Chặn người dùng
export const blockUser = createAsyncThunk(
  "blockUser",
  async ({ userId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      if (!clientId || !userId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào blockUser không hợp lệ: clientId=${clientId}, userId=${userId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, userId hoặc accessToken");
      }
      const res = await postDataApi(`/user/block-user/${userId}`, 
        {}, 
        {
            "x-client-id": clientId,
            Authorization: accessToken,
        }
      );
      if (socket?.connected) {
        socket.emit("user_blocked", {
          fromUserId: clientId,
          toUserId: userId,
          message: "Bạn đã chặn người dùng này.",
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi blockUser:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể chặn người dùng"
      );
    }
  }
);

//Hủy chặn người dùng
export const unblockUser = createAsyncThunk(
  "unblockUser",
  async ({ userId, socket }, { rejectWithValue }) => {
    try {
      const { clientId, accessToken } = getUserCredentials();
      console.log(">>>>>>", clientId, userId);
      if (!clientId || !userId || !accessToken) {
        console.error(
          `Dữ liệu đầu vào unblockUser không hợp lệ: clientId=${clientId}, userId=${userId}, accessToken=${accessToken}`
        );
        return rejectWithValue("Thiếu clientId, userId hoặc accessToken");
      }
      const res = await postDataApi(`/user/unblock-user/${userId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken,
      });
      if (socket?.connected) {
        socket.emit("user_unblocked", {
          fromUserId: clientId,
          toUserId: userId,
        });
      } else {
        console.warn("Socket chưa kết nối, bỏ qua cập nhật thời gian thực.");
      }
      return {
        message: res.data.metadata.message,
        status: res.data.statusCode,
      };
    } catch (error) {
      console.error(`Lỗi unblockUser:`, error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể hủy chặn người dùng"
      );
    }
  }
);

const friendshipSlice = createSlice({
  name: "friendship",
  initialState,
  reducers: {
    resetFriendshipState: (state) => {
      state.isFriend = null;
      state.isSentRequest = null;
      state.isReceiveRequest = null;
      state.isBlockedUser = null;
      state.isBlocked = null;
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkFriendShip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFriendShip.fulfilled, (state, action) => {
        state.loading = false;
        state.isFriend = action.payload.isFriend;
        state.message = action.payload.message;
      })
      .addCase(checkFriendShip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(checkSendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isSentRequest = action.payload.isSentRequest;
        state.message = action.payload.message;
      })
      .addCase(checkSendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isSentRequest = true;
        state.isFriend = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(cancelFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isSentRequest = false;
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(checkReceiveFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkReceiveFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isReceiveRequest = action.payload.isReceiveRequest;
        state.message = action.payload.message;
      })
      .addCase(checkReceiveFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isFriend = true;
        state.isReceiveRequest = false;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(unfriendUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfriendUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isFriend = false;
      })
      .addCase(unfriendUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getReceivedFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedRequests = action.payload;
      })
      .addCase(getReceivedFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getSentFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sentRequests = action.payload;
      })
      .addCase(getSentFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(declineFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isReceiveRequest = false;
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getFriendList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendList.fulfilled, (state, action) => {
        state.loading = false;
        state.friendList = action.payload;
      })
      .addCase(getFriendList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(checkBlockedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkBlockedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isBlockedUser = action.payload.isBlockedUser;
        state.message = action.payload.message;
      })
      .addCase(checkBlockedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(checkIsBlockedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIsBlockedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isBlocked = action.payload.isBlocked;
        state.message = action.payload.message;
      })
      .addCase(checkIsBlockedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isBlockedUser = true;
        state.isFriend = false;
        state.message = action.payload.message;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isBlockedUser = false;
        state.message = action.payload.message;
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetFriendshipState } = friendshipSlice.actions;
export default friendshipSlice.reducer;
