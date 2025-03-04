

import t from 'ts-runtime/lib';
export interface ICounter {
  $id?: string | undefined;
  Name: string;
  Max?: number | undefined;
}

export class Counter implements ICounter {
  $id: string;
  Name: string;
  Min: number = 0;
  Max?: number;
  "Starting Value": number = 0;
  constructor(json: ICounter, id: string) {
    this.$id = id;
    this.Name = json.Name;
    if (json.Max) {
      this.Max = json.Max;
    }
  }
}