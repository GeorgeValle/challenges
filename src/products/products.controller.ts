import { 
  Controller,
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const producto = this.productsService.create(createProductDto);
    return {message: 'Producto creado: ', producto}
  }

  @Get()
  findAll(@Query('limite') limite: string) {
    const products= this.productsService.findAll(+limite || 0);
    if(!products){
      return {message:"No hay productos cargados"}}
    else{
      return {message: 'Productos encontrados: ', products}};
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    
    const producto = this.productsService.findOne(+id);
    if(!producto){
      return{message: 'Producto NO encontrado: '}}
    else{
      return{message: 'Producto encontrado: ', producto}}
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const producto = this.productsService.update(+id, updateProductDto);
    if(!producto){
      return{message: 'Producto NO actualizado: '}}
    else{
      return{message: 'Producto Actualizado: ', producto}}
    //return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const producto = this.productsService.remove(+id);
    if(!producto){
      return{message: 'Producto NO Borrado: '}}
    else{
      return{message: 'Producto Borrado: ', producto}}
    

  // return this.productsService.remove(+id);
  }
}
