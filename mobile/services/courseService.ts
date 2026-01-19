import api from './api';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  title: string;
  type: 'video' | 'quiz' | 'text';
  videoUrl?: string;
  textContent?: string;
  quiz?: QuizQuestion[];
  duration?: string;
  completed?: boolean;
}

export interface Course {
  _id: string;
  title: string;
  instructor: string;
  lessonsCount: number;
  lessonsList?: Lesson[];
  icon: string;
  progress?: number;
  price?: number;
  recommended?: boolean;
  description?: string;
  category?: string;
}

export const CourseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getRecommendedCourses: async (): Promise<Course[]> => {
    try {
      const response = await api.get('/courses/recommended');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
      throw error;
    }
  },

  getCourse: async (id: string): Promise<Course> => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  createCourse: async (courseData: any): Promise<Course> => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: any): Promise<Course> => {
    try {
      const response = await api.patch(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};
