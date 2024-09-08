/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"



export default function Trening(props: any) {
  return <div><Link href="/"><span>Lenke tilbake</span></Link>{JSON.stringify(props)}</div>
}
