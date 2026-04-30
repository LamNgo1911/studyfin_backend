import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Roles } from '../decorators/roles.decorator';

const createMockContext = (user: any): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { get: jest.Mock };

  beforeEach(() => {
    reflector = { get: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('returns true when no @Roles() decorator is present (no required roles)', () => {
    reflector.get.mockReturnValue(undefined);
    const ctx = createMockContext({
      id: '1',
      email: 'user@test.com',
      role: 'USER',
    });

    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
  });

  it('returns true when user role matches required @Roles("ADMIN") decorator', () => {
    reflector.get.mockReturnValue(['ADMIN']);
    const ctx = createMockContext({
      id: '1',
      email: 'admin@test.com',
      role: 'ADMIN',
    });

    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
  });

  it('throws ForbiddenException when user role does not match @Roles("ADMIN")', () => {
    reflector.get.mockReturnValue(['ADMIN']);
    const ctx = createMockContext({
      id: '1',
      email: 'user@test.com',
      role: 'USER',
    });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when there is no user on the request', () => {
    reflector.get.mockReturnValue(['ADMIN']);
    const ctx = createMockContext(undefined);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('verifies reflector.get is called with Roles decorator and context handler', () => {
    reflector.get.mockReturnValue(undefined);
    const ctx = createMockContext({
      id: '1',
      email: 'user@test.com',
      role: 'USER',
    });

    guard.canActivate(ctx);

    expect(reflector.get).toHaveBeenCalledWith(Roles, ctx.getHandler());
  });
});
