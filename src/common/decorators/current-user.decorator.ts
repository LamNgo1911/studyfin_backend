import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUserData;

    return data ? user?.[data] : user;
  },
);
