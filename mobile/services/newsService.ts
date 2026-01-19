import api from './api';

export interface NewsComment {
  _id: string;
  user: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface News {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  imageUrl?: string;
  featured: boolean;
  likes: string[];
  dislikes: string[];
  comments: NewsComment[];
  createdAt: string;
  updatedAt: string;
}

export const NewsService = {
  getNews: async (): Promise<News[]> => {
    const response = await api.get('/news');
    return response.data;
  },

  getNewsById: async (id: string): Promise<News> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  createNews: async (news: Partial<News>): Promise<News> => {
    const response = await api.post('/news', news);
    return response.data;
  },

  updateNews: async (id: string, news: Partial<News>): Promise<News> => {
    const response = await api.patch(`/news/${id}`, news);
    return response.data;
  },

  deleteNews: async (id: string): Promise<News> => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  likeNews: async (id: string): Promise<News> => {
    const response = await api.post(`/news/${id}/like`);
    return response.data;
  },

  dislikeNews: async (id: string): Promise<News> => {
    const response = await api.post(`/news/${id}/dislike`);
    return response.data;
  },

  addComment: async (id: string, content: string): Promise<News> => {
    const response = await api.post(`/news/${id}/comment`, { content });
    return response.data;
  },

  deleteComment: async (newsId: string, commentId: string): Promise<News> => {
    const response = await api.delete(`/news/${newsId}/comment/${commentId}`);
    return response.data;
  },
};
