export class Sector {
  id: number
  name: string
  description: string
  group: string
  constructor(id: number, name: string, description: string, group: string) {
    this.id = id
    this.name = name
    this.description = description
    this.group = group
  }
}