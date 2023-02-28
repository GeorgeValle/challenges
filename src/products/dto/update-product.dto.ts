import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    name: string;
    price: number;
    stock: number;
    description:String;
    code: number;
    thumbnail: string;
}
