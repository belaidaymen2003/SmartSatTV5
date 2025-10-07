'use client';

import { useSearchParams } from "next/navigation";


export default function CategorySubscriptionPage() {
    const search = useSearchParams();
    return <div>{search}</div>;
  }