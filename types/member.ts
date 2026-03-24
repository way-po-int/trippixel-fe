export type MemberRole = "OWNER" | "MEMBER";

type BaseMember = {
  nickname?: string;
  picture?: string;
  role?: MemberRole;
};

export type CollectionMember = {
  collection_member_id: string;
} & BaseMember;

export type PlanMember = {
  plan_member_id: string;
} & BaseMember;

export type MembersResponse<T> = {
  is_authenticated: boolean;
  me: T | null;
  members: T[];
};

export type CollectionMembersResponse = MembersResponse<CollectionMember>;
export type PlanMembersResponse = MembersResponse<PlanMember>;
