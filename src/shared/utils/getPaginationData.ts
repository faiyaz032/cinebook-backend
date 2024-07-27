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

export default function getPaginationData(page: number, totalItems: number, itemsPerPage: number): PaginationData {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  return {
    currentPage: page,
    totalItems,
    itemsPerPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  };
}
