export interface Tale {
  id: number
  inDev: string
  imageUrl: string
  name: string
  author: string
}

export interface TaleHeader {
  forName: string
  linkAll: string
}

export interface TalesResponse {
  header: TaleHeader
  tales: Tale[]
}

export interface TalesState {
  dataSheet: string
  dataTale: Tale[]
  loading: boolean
  error: string | null
}
