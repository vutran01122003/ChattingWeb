import {createSlice} from '@reduxjs/toolkit';

import {
  fetchConversations,
  createOrGetConversation,
  getConversationMessages,
  sendMessage,
  sendMessageWithFiles,
  revokeMessage,
  deleteMessage,
  markAsReadMessage,
  forwardMessage,
} from '../thunks/chatThunks';

const initialState = {
  friendConversations: [],
  strangerConversations: [],
  currentConversation: null,

  messages: [],
  messagePagination: {
    page: 1,
    limit: 20,
    hasMore: false,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearCurrentConversation: state => {
      state.currentConversation = null;
      state.messages = [];
      state.messagePagination = {
        page: 1,
        limit: 20,
        hasMore: false,
      };
    },
    resetPagination: state => {
      state.messagePagination = {
        page: 1,
        limit: 20,
        hasMore: false,
      };
    },
    addLocalMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },

    receiveMessage: (state, action) => {
      const newMessage = action.payload;

      if (
        state.currentConversation &&
        state.currentConversation.conversation_id === newMessage.conversation_id
      ) {
        state.messages.unshift(newMessage);
      }

      const updateConversationList = list => {
        const conversationIndex = list.findIndex(
          conv => conv.conversation_id === newMessage.conversation_id,
        );

        if (conversationIndex !== -1) {
          list[conversationIndex].last_message = newMessage;
          list[conversationIndex].last_message_time = newMessage.createdAt;
          list[conversationIndex].unread = true;

          const conversation = list[conversationIndex];
          list.splice(conversationIndex, 1);
          list.unshift(conversation);
        }
      };

      updateConversationList(state.friendConversations);
      updateConversationList(state.strangerConversations);
    },
    updateMessageStatus: (state, action) => {
      const {messageId, updates} = action.payload;
      const messageIndex = state.messages.findIndex(
        msg => msg._id === messageId,
      );

      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...updates,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.friendConversations = action.payload.friends;
        state.strangerConversations = action.payload.strangers;
      })

      .addCase(createOrGetConversation.fulfilled, (state, action) => {

        state.currentConversation = action.payload;

        const newConv = action.payload;
        if (newConv.conversation_type === 'friend') {
          if (
            !state.friendConversations.some(
              c => c.conversation_id === newConv.conversation_id,
            )
          ) {
            state.friendConversations.unshift(newConv);
          }
        } else {
          if (
            !state.strangerConversations.some(
              c => c.conversation_id === newConv.conversation_id,
            )
          ) {
            state.strangerConversations.unshift(newConv);
          }
        }
      })

      .addCase(getConversationMessages.fulfilled, (state, action) => {
        if (
          action.payload.pagination.page === 1 &&
          action.payload.messages.length !== 0
        ) {
          state.messages = action.payload.messages;
        } else {
          state.messages = [...state.messages, ...action.payload.messages];
        }

        state.messagePagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          hasMore: action.payload.pagination.hasMore,
        };
        const conversationId = action.payload.messages[0].conversation_id;

        const updateUnreadStatus = list => {
          const index = list.findIndex(
            c => c.conversation_id === conversationId,
          );
          if (index !== -1) {
            list[index].unread = false;
          }
        };

        updateUnreadStatus(state.friendConversations);
        updateUnreadStatus(state.strangerConversations);
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);

        if (state.currentConversation) {
          state.currentConversation.last_message = action.payload;
          state.currentConversation.last_message_time =
            action.payload.createdAt;
        }

        const updateConversationLists = list => {
          const index = list.findIndex(
            c => c.conversation_id === action.payload.conversation_id,
          );
          if (index !== -1) {
            list[index].last_message = action.payload;
            list[index].last_message_time = action.payload.createdAt;
            list[index].unread = false;

            const conversation = list[index];
            list.splice(index, 1);
            list.unshift(conversation);
          }
        };

        updateConversationLists(state.friendConversations);
        updateConversationLists(state.strangerConversations);
      })

      .addCase(sendMessageWithFiles.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);

        if (state.currentConversation) {
          state.currentConversation.last_message = action.payload;
          state.currentConversation.last_message_time =
            action.payload.createdAt;
        }

        // const updateConversationLists = list => {
        //   const index = list.findIndex(
        //     c => c.conversation_id === action.payload.conversation_id,
        //   );
        //   if (index !== -1) {
        //     list[index].last_message = action.payload;
        //     list[index].last_message_time = action.payload.createdAt;
        //     list[index].unread = false;

        //     const conversation = list[index];
        //     list.splice(index, 1);
        //     list.unshift(conversation);
        //   }
        // };

        // updateConversationLists(state.friendConversations);
        // updateConversationLists(state.strangerConversations);
      })

      .addCase(revokeMessage.fulfilled, (state, action) => {
        const messageIndex = state.messages.findIndex(
          msg => msg._id === action.payload._id,
        );

        if (messageIndex !== -1) {
          state.messages[messageIndex].is_revoked = true;
        }

        if (
          state.currentConversation?.last_message?._id === action.payload._id
        ) {
          const updateLastMessage = list => {
            const index = list.findIndex(
              c =>
                c.conversation_id === state.currentConversation.conversation_id,
            );

            if (
              index !== -1 &&
              list[index].last_message?._id === action.payload._id
            ) {
              list[index].last_message.is_revoked = true;
            }
          };

          updateLastMessage(state.friendConversations);
          updateLastMessage(state.strangerConversations);
        }
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageIndex = state.messages.findIndex(
          msg => msg._id === action.payload._id,
        );

        if (messageIndex !== -1) {
          state.messages[messageIndex].is_deleted = true;
        }

        if (
          state.currentConversation?.last_message?._id === action.payload._id
        ) {
          const updateLastMessage = list => {
            const index = list.findIndex(
              c =>
                c.conversation_id === state.currentConversation.conversation_id,
            );

            if (
              index !== -1 &&
              list[index].last_message?._id === action.payload._id
            ) {
              list[index].last_message.is_deleted = true;
            }
          };

          updateLastMessage(state.friendConversations);
          updateLastMessage(state.strangerConversations);
        }
      })

      .addCase(markAsReadMessage.fulfilled, (state, action) => {
        const conversationId = action.meta.arg.conversationId;

        const updateUnreadStatus = list => {
          const index = list.findIndex(
            c => c.conversation_id === conversationId,
          );
          if (index !== -1) {
            list[index].unread = false;
          }
        };

        updateUnreadStatus(state.friendConversations);
        updateUnreadStatus(state.strangerConversations);
      })

      .addCase(forwardMessage.fulfilled, (state, action) => {
        const targetConversationId = action.meta.arg.targetConversationId;

        if (
          state.currentConversation?.conversation_id === targetConversationId
        ) {
          state.messages.unshift(action.payload);
        }

        const updateConversation = list => {
          const index = list.findIndex(
            c => c.conversation_id === targetConversationId,
          );

          if (index !== -1) {
            list[index].last_message = action.payload;
            list[index].last_message_time = action.payload.createdAt;

            const conversation = list[index];
            list.splice(index, 1);
            list.unshift(conversation);
          }
        };

        updateConversation(state.friendConversations);
        updateConversation(state.strangerConversations);
      });
  },
});

export const {
  clearCurrentConversation,
  resetPagination,
  addLocalMessage,
  receiveMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
