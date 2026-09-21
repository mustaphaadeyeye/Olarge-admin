export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoryQueryParams {
  includeInactive?: boolean;
}
