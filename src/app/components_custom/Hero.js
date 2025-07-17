import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Form } from "./Form";


export function Hero() {

    return (

        <div
            className="flex flex-col items-center justify-center text-white px-4 text-center"
            style={{ height: "90vh" }}
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
                What do you want to create?
            </h2>
            <div className="text-base sm:text-lg text-gray-400">
                Prompt, run, edit, and create{" "}
                <span className="font-semibold text-white">
                    Animated Tutorial Videos.
                </span>
            </div>
            <div className="w-full max-w-md mt-6">
                <Form />
            </div>
        </div>

    )
}