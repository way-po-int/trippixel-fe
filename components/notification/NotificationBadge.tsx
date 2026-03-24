import { Bell, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export type NotificationBadgeVariant = "default" | "announcement";

const VARIANT_CONFIG = {
  default: {
    bg: "bg-sky-100",
    iconColor: "#0EA5E9",
    Icon: Bell,
    label: "알림",
  },
  announcement: {
    bg: "bg-[#E469624D]",
    iconColor: "#DC262699",
    Icon: Megaphone,
    label: "공지",
  },
} as const;

type NotificationBadgeProps = {
  variant?: NotificationBadgeVariant;
  className?: string;
};

const NotificationBadge = ({ variant = "default", className }: NotificationBadgeProps) => {
  const { bg, iconColor, Icon, label } = VARIANT_CONFIG[variant];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className={cn("flex size-5 items-center justify-center rounded-full", bg)}>
        <Icon size={12} color={iconColor} strokeWidth={1.5} />
      </div>
      <span className="text-xs leading-none font-normal text-[#757575]">{label}</span>
    </div>
  );
};

export default NotificationBadge;
