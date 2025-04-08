"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get("ref");

    if (referralCode) {
      localStorage.setItem("referralCode", referralCode);
    }
    router.push("/signup");
  }, [router, searchParams]);

  return null;
}
