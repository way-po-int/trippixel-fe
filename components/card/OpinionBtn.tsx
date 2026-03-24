import { MessageCircle } from "lucide-react";

type OpinionBtnProps = {
  count: number;
  onClick?: () => void;
};

const OpinionBtn = ({ count, onClick }: OpinionBtnProps) => {
  return (
    <button
      type="button"
      className="border-border flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5"
      onClick={onClick}
    >
      <MessageCircle className="text-muted-foreground h-4.5 w-4.5" />
      <div className="flex items-center gap-1">
        <p className="typography-action-sm-reg">의견</p>
        <span className="typography-action-sm-bold">{count}</span>
      </div>
    </button>
  );
};

export default OpinionBtn;
