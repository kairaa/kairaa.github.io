import Image from "next/image";
import Navbar from "./_components/navbar";

export default function Home() {
  return (
    <div className="px-80 max-w-screen-xl mx-auto">
      <Navbar />
      <div>
        <pre>
          {`
           __    melabaa!
          /  \\   ~~|~~
         (|00|)    |
          (==)  --/
        ___||___
       / _ .. _ \\
      //  |  |  \\\\
     //   |  |   \\\\
     ||  / /\\ \\  ||
    _|| _| || |_ ||_
   \\|||___||___|||/
          `}
        </pre>
        <p>Herkese merebe, ben Kayra. Kod yazarım, geri kalan zamanlarımda yatarım.</p>
      </div>
    </div>
  );
}
