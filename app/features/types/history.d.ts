import {QuizType} from '@/types/quiz';
import {CategoryType} from '@/types/category';
import {QuestionType} from '@/types/question';

export interface HistoryType {
  id?: number;
  time?: number;
  score?: number;
  quiz?: QuizType;
  created_at?: string;
  updated_at?: string;
  errors?: {
    name?: string;
    time?: string;
    description?: string;
    category_id?: string;
    image?: string;
  };
}

export interface HistoryTypePagination {
  data: HistoryType[];
  current_page: number;
  last_page: number;
  total: number;
}
