// export interface ProductListDto {
//   id: string;
//   storeId: string;
//   storeName: string;
//   name: string;
//   image: string;
//   price: number;
//   discountPrice: number;
//   discountRate: number;
//   discountStartTime?: Date | null;
//   discountEndTime?: Date | null;
//   reviewsCount: number;
//   reviewsRating: number;
//   createdAt: string;
//   updatedAt: string;
//   sales: number;
//   isSoldOut: boolean;
// }

// export interface ProductListResponse {
//   list: ProductListDto[];
//   totalCount: number;
// }

export enum CategoryType {
  TOP = 'top',
  BOTTOM = 'bottom',
  DRESS = 'dress',
  OUTER = 'outer',
  SKIRT = 'skirt',
  SHOES = 'shoes',
  ACC = 'acc',
}

export class CategoryResponse {
  id!: string;
  name!: CategoryType;
}

interface StockSize {
  id: number;
  name: string;
}

// 재고
export interface Stock {
  id: string;
  quantity: number;
  size: StockSize;
}

export class InquiryReply {
  id!: string;
  content!: string;
  createdAt!: string;
  updatedAt!: string;
  user!: { id: string; name: string };
}

export class DetailInquiry {
  id!: string;
  title!: string;
  content!: string;
  status!: string;
  isSecret!: boolean;
  createdAt!: string;
  updatedAt!: string;
  reply?: InquiryReply | null;
}

export interface StoreInfoProps {
  id: string;
  name: string;
  address?: string;
  detailAddress?: string;
  phoneNumber?: string;
  favoriteCount?: number;
  content?: string;
  image?: string;
}
