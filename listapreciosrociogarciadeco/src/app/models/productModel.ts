export class ProductModel {
  public code: string;
  public id: number;
  public description: string;
  public costPrice: number;
  public salePrice: number;
  public size: string;
  public quantity: number;
  public idProveedor: number;
  public codeCanvas: string = '';
  public id_negocio: number;
  public sucursal: number;
  public nombreSucursal: string;
  public sucursal_nueva: string = '';
  public typePayment: string = '';
  public usuario: string = '';

  constructor(code: string, id: number, description: string, costPrice: number, size: string, quantity: number, salePrice: number, idProveedor: number, idNegocio: number, sucursal: number, nombreSucursal: string) {
    this.code = code;
    this.id = id;
    this.description = description;
    this.costPrice = costPrice;
    this.size = size;
    this.quantity = quantity;
    this.salePrice = salePrice;
    this.idProveedor = idProveedor;
    this.id_negocio = idNegocio;
    this.sucursal = sucursal;
    this.nombreSucursal = nombreSucursal;
  }

  public getCode() {
    return this.code;
  }
  public getIdProduct() {
    return this.id;
  }

  public getDescription() {
    return this.description;
  }

  public getCostPrice() {
    return this.costPrice;
  }

  public getSalePrice() {
    return this.salePrice;
  }

  public getSize() {
    return this.size;
  }

  public getQuantity() {
    return this.quantity;
  }

  public getIdProveedor() {
    return this.idProveedor;
  }

  public setCodeCanvas(code: string): void {
    this.codeCanvas = code;
  }

  public getCodeCanvas(): string {
    return this.codeCanvas;
  }

  public setSucursal(sucursal: number): void {
    this.sucursal = sucursal;
  }

  public getSucursal(): number {
    return this.sucursal;
  }

  public setNombreSucursal(sucursal: string): void {
    this.nombreSucursal = sucursal;
  }

  public getNombreSucursal(): string {
    return this.nombreSucursal;
  }

  public setSucursalNueva(sucursal: string): void {
    this.sucursal_nueva = sucursal;
  }

  public getSucursalNueva(): string {
    return this.sucursal_nueva;
  }

  public setTypePayment(tipoPago: string) {
    this.typePayment = tipoPago;
  }
  public setUsuario(usuario: string) {
    this.usuario = usuario;
  }


}
