declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        type: 'SELLER' | 'BUYER';
      };
      file?: any; // Multer 사용 시
      storeId?: string;
    }

    interface Response {
      /** SSE 전송을 위한 flush 메서드 (compression 미들웨어 사용 시 추가됨) */
      flush?: () => void;
    }
  }
}
