import {createAsyncThunk} from '@reduxjs/toolkit';

import axios from '../../config/axios.config';

export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async (_, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.get('/conversations', {
        headers: {'x-client-id': clientId},
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch conversations',
      );
    }
  },
);

export const getConversation = createAsyncThunk(
  'conversation/getConversation',
  async (conversationId, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.get(`/conversations/${conversationId}`, {
        headers: {'x-client-id': clientId},
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create/get conversation',
      );
    }
  },
);

export const getConversationMessages = createAsyncThunk(
  'conversation/getConversationMessages',
  async ({conversationId, page = 1, limit = 20}, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.get(
        `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to get conversation details',
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({conversationId, content}, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.post(
        '/messages/',
        {
          conversation_id: conversationId,
          content,
        },
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update conversation',
      );
    }
  },
);

export const sendMessageWithFiles = createAsyncThunk(
  'message/sendMessageWithFiles',
  async (formData, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-client-id': clientId,
        },
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update conversation',
      );
    }
  },
);

export const revokeMessage = createAsyncThunk(
  'message/revokeMessage',
  async ({messageId}, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.put(`/messages/${messageId}/revoke`, {}, {
        headers: {'x-client-id': clientId},
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const deleteMessage = createAsyncThunk(
  'message/deleteMessage',
  async ({messageId}, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.put(`/messages/${messageId}/delete`, {}, {
        headers: {'x-client-id': clientId},
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const markAsReadMessage = createAsyncThunk(
  'message/markAsReadMessage',
  async ({conversationId}, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.put(
        '/messages/mark-as-read',
        {
          conversation_id: conversationId,
        },
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const forwardMessage = createAsyncThunk(
  'message/forwardMessage',
  async ({messageId, targetConversationId}, {rejectWithValue, getState}) => {
    try {
      const clientId = await localStorage.getItem('clientId');
      const response = await axios.post(
        '/messages/forward',
        {
          message_id: messageId,
          target_conversion_id: targetConversationId,
        },
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);
export const addReaction = createAsyncThunk(
  'message/addReaction',
  async ({messageId, reaction}, {rejectWithValue}) => {
    try {
      const clientId = localStorage.getItem('clientId');
      const response = await axios.post(
        `/messages/reaction`,
        {message_id: messageId, emoji: reaction},
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add reaction',
      );
    }
  },
);
