import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  products: Array<Product>

  constructor(){
    this.products =[];
  }
  create(createProductDto: CreateProductDto) {
    const id= this.generateId();
    const productoNuevo = {id, ...createProductDto}
    this.products.push(productoNuevo);
    return productoNuevo;
  }

  findAll(limite: number): Array<Product> {
    if(limite !==0){
      return this.products.slice(0, limite);
    }else{
        return this.products;
      }
  }

  findOne(id: number): Product {
    const producto = this.products.find((p) => p.id === id);
    return producto;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    let index = this.products.findIndex((p) => p.id === id)
    if (index !== -1) {
        this.products[index] = {id, ...updateProductDto}
        return this.products[index]
    } 
    // return `This action updates a #${id} product`;
  }

  remove(id: number): Product {
    let productDeleted = this.products.find((p) => p.id === id)
    
    if (productDeleted){
      this.products = this.products.filter((p) => p.id !== id)
      return productDeleted
    }  
    
    //return `This action removes a #${id} product`;
  }

  private generateId(): number{
    return this.products.length === 0
    ? 1
    : this.products[this.products.length -1].id +1;
  }
}
