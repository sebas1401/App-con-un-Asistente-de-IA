import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'Tour' | 'User' | 'all';
export type AppAbility = Ability<[Actions, Subjects]>;

export class AbilityFactory {
  defineAbilityFor(roleNames: string[]) {
    const { can, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    if (roleNames.includes('admin')) {
      can('manage', 'all');
    } else if (roleNames.includes('editor')) {
      can('create', 'Tour');
      can('read', 'Tour');
      can('update', 'Tour');
    }
    return build({ detectSubjectType: (item) => item as ExtractSubjectType<Subjects> });
  }
}
