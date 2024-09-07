"use client"

import Link from "next/link";

export function Forside() {
  return (
    <>
      <div className="flex flex-col gap-4">

        <Link prefetch={false} passHref legacyBehavior href="/trening"><a href="/trening">Lenke til /trening</a></Link>;
        <Link href="/yr">Lenke til /hei</Link>;
      </div>
    </>)
}
