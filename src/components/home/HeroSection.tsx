import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-6 pt-8 pb-6">
      <div className="mb-6 w-48 h-40 flex items-center justify-center">
        <Image src="/assets/home-icon.png" alt="Hero illustration" width={160} height={120} />
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6 max-w-md">
        Шивээс хийлгэх &apos;Артист&apos;-аа сонгоорой
      </h1>
    </section>
  );
}
