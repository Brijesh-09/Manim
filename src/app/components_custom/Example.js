import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function Example(){
    return (
        <>
        <div className="flex justify-center gap-2 items-center">
        <div className="  text-center">
            <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-white bg-black text-white dark:text-black flex items-center space-x-2"
            >

                <span>How MCP Works</span>
            </HoverBorderGradient>
        </div><div className="flex  text-center">
                <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-white bg-black text-white dark:text-black flex items-center space-x-2"
                >

                    <span>Explain Load Balancers</span>
                </HoverBorderGradient>
            </div>
       </div>
       </>
        
      );
}