export type Options = {
  search?: string;
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
};

export type PaginationData = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};
