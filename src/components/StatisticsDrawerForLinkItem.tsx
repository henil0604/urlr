import { ChartLineUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Drawer,
} from "@/components/ui/drawer";

export function StatisticsDrawerForLinkItem() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit h-fit rounded-full p-2">
          <ChartLineUp size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto min-w-[30%] max-md:min-w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Engagement Statistics</DrawerTitle>
          </DrawerHeader>
          <div className="pt-4 pb-10 flex justify-center w-full h-full items-center">
            <p className="italic font-thin uppercase">work in progress</p>
          </div>

          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
