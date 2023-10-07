import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceProductName'
})
export class ReduceProductNamePipe implements PipeTransform {

  transform(productName: string): string {
    const regex = /Samshay: Be Unique (Noorie's Corner )?/;
    return productName.replace(regex, '').replace('Noories Corner ', '');
  }

}
