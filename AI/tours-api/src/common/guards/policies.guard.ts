import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { AbilityFactory } from '../../auth/ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {}

  canActivate(ctx: ExecutionContext): boolean {
    const handlers = this.reflector.get(CHECK_POLICIES_KEY, ctx.getHandler()) || [];
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const roleNames = (user?.roles || []).map((r: any) => r.name);
    const ability = this.abilityFactory.defineAbilityFor(roleNames);
    return handlers.every((h: (a: any) => boolean) => h(ability));
  }
}
