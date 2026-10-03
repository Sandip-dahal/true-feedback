import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-col min-h-screen">
    
    <Navbar />
    {children}
    </div>
     
    
    
  );
}