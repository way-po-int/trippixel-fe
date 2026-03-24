import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { type CollectionMember, type PlanMember } from "@/types/member";
import { Button } from "@/components/ui/button";
import Divider from "@/components/common/Divider";
import MemberItem from "./MemberItem";

const getMemberId = (member: CollectionMember | PlanMember): string =>
  "collection_member_id" in member ? member.collection_member_id : member.plan_member_id;

type MemberListSectionProps = {
  members: (CollectionMember | PlanMember)[];
  isOwner?: boolean;
  meMemberId?: string;
  variant?: "COLLECTION" | "PLAN";
  onKick: (memberId: string) => void;
  onAssignOwner: (memberId: string) => void;
  onInviteClick?: () => void;
};

const MemberListSection = ({
  members,
  isOwner = false,
  meMemberId,
  variant = "COLLECTION",
  onKick,
  onAssignOwner,
  onInviteClick,
}: MemberListSectionProps) => {
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (!isOwner) setIsManaging(false);
  }, [isOwner]);

  return (
    <div className="w-full rounded-2xl bg-[#f0f0f0]">
      <div className="flex justify-between px-4 py-3">
        <p className="typography-action-base-bold">여행 멤버</p>
        {isOwner && !isManaging && (
          <button
            className="typography-action-sm-reg text-[#757575]"
            onClick={() => setIsManaging(true)}
          >
            관리하기
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3 px-3">
        <div className="flex flex-col gap-3">
          {members.map((member, i) => (
            <MemberItem
              key={member.nickname + `${i}`}
              member={member}
              isManaging={isManaging}
              isMe={!!meMemberId && getMemberId(member) === meMemberId}
              variant={variant}
              onKick={onKick}
              onAssignOwner={onAssignOwner}
            />
          ))}
        </div>
        {isManaging ? (
          <Button
            variant="outline"
            className="mb-3 w-full border-neutral-400 bg-[#f0f0f0]"
            onClick={() => setIsManaging(false)}
          >
            <p className="typography-action-sm-reg">멤버 관리 끝내기</p>
          </Button>
        ) : (
          <div className="flex flex-col gap-1">
            <Divider />
            <Button
              icon={<UserPlus size={18} className="opacity-40" />}
              variant="ghost"
              className="typography-action-sm-reg mb-2 flex flex-row rounded-2xl"
              onClick={onInviteClick}
            >
              새로운 멤버 초대하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberListSection;
