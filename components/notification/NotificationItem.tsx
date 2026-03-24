import { X } from "lucide-react";
import NotificationBadge from "./NotificationBadge";
import { type NotificationBadgeVariant } from "./NotificationBadge";

type NotificationItemProps = {
  message: string;
  badgeVariant?: NotificationBadgeVariant;
  onDelete?: () => void;
  onClick?: () => void;
};

const NotificationItem = ({
  message,
  badgeVariant = "default",
  onDelete,
  onClick,
}: NotificationItemProps) => {
  return (
    <div
      className="w-full cursor-pointer rounded-2xl bg-[#F0F0F0] py-3.5 pr-3 pl-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* 배지 + 메시지 */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <NotificationBadge variant={badgeVariant} />
          <p className="text-base leading-6 font-normal text-[#1C2024]">{message}</p>
        </div>

        {/* 삭제 버튼 */}
        <button
          type="button"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-60"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          aria-label="알림 삭제"
        >
          <X size={24} strokeWidth={2} color="#000000" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
