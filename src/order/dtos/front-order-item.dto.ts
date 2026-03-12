export class FrontReview {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
}

export class FrontProduct {
  name: string;
  image?: string;
  reviews: FrontReview[];
}

export class FrontOrderItem {
  id: string;
  price: number;
  quantity: number;
  isReviewed: boolean;
  productId: string;
  product: FrontProduct;
  size: { size: { en: string; ko: string } };
}
