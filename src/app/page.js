import Image from "next/image";
import Navbar from "./components_custom/Navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Hero } from "./components_custom/Hero";
import Footer from "./components_custom/Footer";
import Example from "./components_custom/Example";

export default function Home() {
  return (

      <><BackgroundBeams />
      <Navbar />
      <Hero/>
      <Footer/>
        </>
  );
} 
