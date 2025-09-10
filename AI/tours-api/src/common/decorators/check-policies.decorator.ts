import { SetMetadata } from '@nestjs/common';
export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: Array<(ability: any) => boolean>) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
