import Image from "next/image";
import { type CollectionMember, type PlanMember } from "@/types/member";
import MoreActionMenu, { type MoreActionItem } from "@/components/common/MoreActionMenu";

type MemberItemProps = {
  member: CollectionMember | PlanMember;
  isManaging: boolean;
  isMe?: boolean;
  variant?: "COLLECTION" | "PLAN";
  onKick: (memberId: string) => void;
  onAssignOwner: (memberId: string) => void;
};

const getMemberId = (member: CollectionMember | PlanMember): string => {
  return "collection_member_id" in member ? member.collection_member_id : member.plan_member_id;
};

const MemberItem = ({
  member,
  isManaging,
  isMe = false,
  variant = "COLLECTION",
  onKick,
  onAssignOwner,
}: MemberItemProps) => {
  const memberId = getMemberId(member);
  const actionItems: MoreActionItem[] = [
    {
      id: "kick",
      label: "내보내기",
      onSelect: () => onKick(memberId),
    },
    {
      id: "assign-owner",
      label: variant === "PLAN" ? "여행 계획 소유자로 지정" : "보관함 소유자로 지정",
      onSelect: () => onAssignOwner(memberId),
    },
  ];

  return (
    <div className="flex flex-row items-center gap-2 p-2">
      {member.picture ? (
        <Image
          width={28}
          height={28}
          src={member.picture.replace(/^http:\/\//, "https://")}
          alt={member.nickname ?? ""}
          className="shrink-0 rounded-full"
        />
      ) : (
        <div className="h-7 w-7 shrink-0 rounded-full bg-gray-300" />
      )}
      <p className="typography-action-sm-reg flex-1">{member.nickname}</p>
      {isManaging && !isMe && (
        <MoreActionMenu
          label="멤버 메뉴"
          sheetTitle="멤버 메뉴"
          items={actionItems}
          headerBtnClassName="size-4.5 p-0"
        />
      )}
    </div>
  );
};

export default MemberItem;
