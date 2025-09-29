export interface PaginationMeta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Pagination<TModel> {
  items: TModel[];
  meta: PaginationMeta;
}
