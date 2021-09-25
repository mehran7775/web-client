export type Instrument = {
  id: BigInteger
  code: string
  name: string
  fullName: string
  sectorCode: BigInteger
  categoryName: string
  baseVol: BigInteger
  settlementDelay: BigInteger
  maxAllowedPrice: BigInteger
  minAllowedPrice: BigInteger
  namedPrice: number
  shares: number
  companyName: string
  maxQuantityPerOrder: BigInteger
  issuePrice: number
  firstTradeDate: number
  expirationDate: number
  lastModification: number
  status: BigInteger
  dateTime: string
  opening: number
  closing: number
  highest: number
  lowest: number
}