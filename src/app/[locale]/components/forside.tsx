"use client"

import Link from "next/link";

export function Forside(props: unknown) {
  return (
    <>
      <div className="flex flex-col gap-4">

        <Link prefetch={false} passHref legacyBehavior href="/trening"><a href="/trening">Lenke til /trening</a></Link>;
        <Link href="/yr">Lenke til /hei</Link>;



        {JSON.stringify(props)}
      </div>
    </>)
}
