import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo.svg"
        alt="CareerBridge"
        width={50}
        height={50}
        className="h-10 w-10 md:h-12 md:w-12"
      />
      <span className="text-xl md:text-2xl font-bold tracking-tight">
        CareerBridge
      </span>
    </Link>
  );
}
