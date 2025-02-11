import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const LoginPage = () => {
  return (
    <div className="min-h-dvh pt-36 pb-20 px-12 flex flex-col justify-between">
      <section>
        <h1 className="w-52 h-52 rounded-full overflow-hidden m-auto">
          <img
            src="https://placehold.co/200x200?text=haertz"
            alt="logo image"
            className="size-full object-cover"
          />
        </h1>
      </section>
      <section>
        <Drawer>
          <DrawerTrigger className="w-full rounded-full py-4 mb-6 bg-black text-white">
            구글 로그인
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>계정 선택</DrawerTitle>
              <DrawerDescription>사용할 계정을 선택해주세요.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>계정1</Button>
              <Button>계정2</Button>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <span className="block text-body2 text-gray-scale-200 text-center">
          haertz는 구글 계정으로 로그인 가능합니다.
        </span>
      </section>
    </div>
  );
};

export default LoginPage;
