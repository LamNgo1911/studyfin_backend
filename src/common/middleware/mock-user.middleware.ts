// TEMP: Mock user middleware for testing without JWT auth
// Remove this file and the middleware registration in app.module.ts when done testing.

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const MOCK_USER = {
  id: 'test-user-id',
  email: 'test@studyfin.fi',
  firstName: 'Test',
  lastName: 'User',
  role: 'ADMIN',
};

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
      (req as any).user = MOCK_USER;
    }
    next();
  }
}
