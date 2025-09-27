import Navbar from "@/sections/landing-page/navbar";
import Footer from "@/sections/landing-page/footer";

export default function Index({children}: { children: React.ReactNode }) {
    return (
        <div className='overflow-clip'>
            <Navbar hasGradientBg={false}/>
            {children}
            <Footer/>
        </div>
    );
}