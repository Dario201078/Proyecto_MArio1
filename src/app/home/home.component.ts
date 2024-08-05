import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  productos = [
    { titulo: 'Jose Madero', precio: 350, imagenSrc: '../../assets/IMG_ROPA_1.png', descripcion: 'Playera con la cara del buen pepe' },
    { titulo: 'Natanaelcano', precio: 300, imagenSrc: '../../assets/IMG_ROPA_2.png', descripcion: 'una hoddie con la marca de El susodicho gordita de nata.' },
    { titulo: 'Gera MX', precio: 600, imagenSrc: '../../assets/IMG_ROPA_3.png', descripcion: 'hoddie con la marca de rich vagos' },
    { titulo: 'Kevin Karl', precio: 300, imagenSrc: '../../assets/IMG_ROPA_4.png', descripcion: 'playera de impresiones de kevin kaarl' },
    { titulo: 'Leon Larregui', precio: 320, imagenSrc: '../../assets/IMG_ROPA_5.png', descripcion: 'playera con imagen iconica de Leon Larregui' },
    { titulo: 'Charles ANS', precio: 180, imagenSrc: '../../assets/IMG_ROPA_6.png', descripcion: 'playera con imagen de charles ans caricaturizado' },
    { titulo: 'Jose Madero', precio: 540, imagenSrc: '../../assets/IMG_ROPA_7.png', descripcion: 'camisa tipo bais ball con logo de Jose Madero' },
    { titulo: 'Luis Miguel', precio: 320, imagenSrc: '../../assets/IMG_ROPA_8.png', descripcion: 'playera con la imagen de Luis Miguel' },
    { titulo: 'Cristian Nodal', precio: 420, imagenSrc: '../../assets/IMG_ROPA_9.png', descripcion: 'playera con imagenes de Cristian Nodal' },
  ];

  carritoVisible = false;
  carritoItems: any[] = [];
  total = 0;
  productoSeleccionado: any = null;

  agregarItemAlCarrito(producto: any) {
    const itemExistente = this.carritoItems.find(item => item.titulo === producto.titulo);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.carritoItems.push({ ...producto, cantidad: 1 });
    }

    this.calcularTotal();
  }

  mostrarDetallesProducto(producto: any) {
    this.productoSeleccionado = producto;
  }

  cerrarDetalle() {
    this.productoSeleccionado = null;
  }

  restarCantidad(index: number) {
    if (this.carritoItems[index].cantidad > 1) {
      this.carritoItems[index].cantidad--;
    } else {
      this.carritoItems.splice(index, 1);
    }

    this.calcularTotal();
  }

  sumarCantidad(index: number) {
    this.carritoItems[index].cantidad++;
    this.calcularTotal();
  }

  eliminarItemCarrito(index: number) {
    this.carritoItems.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carritoItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  pagarClicked() {
    alert('¡Gracias por tu compra!');
    this.carritoItems = [];
    this.calcularTotal();
  }
}
