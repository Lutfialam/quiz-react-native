import Pagination from '@/types/pagination';

export interface CategoryType {
  id?: number;
  name?: string;
  description?: string;
}

export interface PaginationCategory extends Pagination {
  data: CategoryType[];
}
