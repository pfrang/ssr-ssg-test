"use client"

import { YrData } from "../../types/yr"

export function Yr({yrData}: {yrData: YrData }) {
  return <div>{JSON.stringify(yrData)}</div>
}
