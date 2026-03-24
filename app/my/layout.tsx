import NavigationBar from "@/components/layout/NavigationBar";

type MypageLayoutProps = {
  children: React.ReactNode;
};

const MypageLayout = ({ children }: MypageLayoutProps) => {
  return (
    <div>
      {children}
      <NavigationBar className="fixed right-0 bottom-0 left-0 z-50" />
    </div>
  );
};

export default MypageLayout;
