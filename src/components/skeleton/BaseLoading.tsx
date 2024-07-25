import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { HTMLProps } from "react";

type TBaseLoadingProps = HTMLProps<HTMLDivElement>;

function BaseLoading(props: TBaseLoadingProps) {
  return (
    <div {...props} className={cn(["flex items-center justify-center p-4 md:p-20", props.className])}>
      <LoaderIcon className="animate-spin" />
    </div>
  );
}

export default BaseLoading;
