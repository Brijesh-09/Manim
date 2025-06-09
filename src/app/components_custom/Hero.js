import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Form } from "./Form";
import Example from "./Example"; // Import Example

export function Hero() {
    
    return(
        <div className="flex flex-col items-center justify-center  text-white"
         style={{ height: "90vh" }}>
            <h2 className="text-4xl font-semi-bold mb-4">
                What do you want to create?
            </h2>
            <div className="text-lg text-gray-500">
                Prompt, run, edit, and create <span className="font-semi-bold text-white">
                    Animated Tutorial Videos.
                </span>
            </div>
            <Form />
        </div>
    )
}