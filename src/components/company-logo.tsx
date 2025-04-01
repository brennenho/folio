import Image from "next/image";

export function CompanyLogo({ company }: { company: string }) {
  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full"
      title={company}
    >
      <Image
        src={`https://img.logo.dev/ticker/${company}?format=png&token=${process.env.NEXT_PUBLIC_LOGO_KEY}`}
        alt={company}
        fill
        className="scale-105 transform object-cover"
      />
    </div>
  );
}
