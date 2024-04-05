import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CreateForm(): React.ReactNode {
  return (
    <div className="flex gap-2 min-w-full justify-center items-center">
      {/* url input */}
      <Input
        type="url"
        id="url"
        placeholder="Enter your loooong looooong url"
        className="w-[30%]"
      />

      {/* submit button */}
      <Button>Create</Button>
    </div>
  );
}
