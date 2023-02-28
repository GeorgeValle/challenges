//los datos que va a pedir el post para crear el producto
export class CreateProductDto {
    name: string;
    price: number;
    stock: number;
    description:String;
    code: number;
    thumbnail: string;
}
