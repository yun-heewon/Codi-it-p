import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetStoreId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx
      .switchToHttp()
      .getRequest<{ user?: { storeId?: string } }>();
    return req.user?.storeId;
  },
);
