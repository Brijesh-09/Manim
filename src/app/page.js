import Image from "next/image";
import Navbar from "./components_custom/Navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Hero } from "./components_custom/Hero";
import Footer from "./components_custom/Footer";


export default function Home() {
  // Scrolll LOck
  return (


      <><BackgroundBeams />
      <Navbar />
      <Hero/>
      <Footer/>
        </>
  );
} 
