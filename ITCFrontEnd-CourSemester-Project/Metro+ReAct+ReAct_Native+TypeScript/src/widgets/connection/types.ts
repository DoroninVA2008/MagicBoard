export interface Props {
  visible: boolean
  onClose: () => void
}

export type Scanned = { 
    id: string
    name: string | null
}