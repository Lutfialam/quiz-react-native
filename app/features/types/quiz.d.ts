import {CategoryType} from './category';
import {QuestionType} from './question';

export interface QuizType {
  id?: number;
  name?: string;
  time?: number;
  delete?: boolean;
  description?: string;
  category_id?: number;
  image?: File | string;
  questions?: QuestionType[];
  categories?: CategoryType;
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

export interface QuizTypePagination {
  data: QuizType[];
  current_page: number;
  last_page: number;
  total: number;
}
