// Se definen constante de File System
import fs from "fs";

// Clase Product, con su correspondiente contructor las props definidas en la consigna
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id = 1;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

    // Devuelve 'false' si el producto tiene algún campo vacío o sin definir, de lo contrario devuelve 'true'

    verifiedProduct() {
        let verified = true;
        Object.values(this).forEach(value => {
            value === "" || value === undefined ? verified = false : null;
        })
        return verified;
    }
}

// Clase ProductManager con su constructor tal como se solicitó, con un array 'products' vacío
class ProductManager {
    constructor(path) {
        this.path = path;
        fs.existsSync(this.path) ? this.products = this.getProducts() : this.products = [];
    }

    // Agrega un producto al array 'products', teniendo en cuenta asignarle un id único y
    // verificar que no contenga props vacías o sin definir
    async addProduct(product) {
        if (fs.existsSync(this.path)) {
            try {
                if (product.verifiedProduct()) {
                    this.products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
                    let productAlreadyExist = this.products.find((item) => item.code === product.code);
                    if (!productAlreadyExist) {
                        try {
                            product.id = this.getFreeProductId();
                            this.products.push(product);
                            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");
                            console.log(`✅ Producto '${product.title}' agregado exitosamente`);
                        } catch (error) {
                            console.error(`⛔ Error: ${error.message}`);
                        }
                    } else {
                        console.error(`⛔ Error: Código de Producto ya existente (Código:'${productAlreadyExist.code}'|Producto:'${productAlreadyExist.title}')`);
                    }
                } else {
                    console.error("⛔ Error: Producto con propiedades vacías o sin definir");
                }
            } catch (error) {
                console.error(`⛔ Error: No se pudo grabar el archivo de Productos.
   Descripción del error: ${error.message}`);
            }
        } else {
            try {
                product.id = this.getFreeProductId();
                this.products.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");
                console.log(`✅ Producto '${product.title}' agregado exitosamente`);
            } catch (error) {
                console.error(`⛔ Error: ${error.message}`);
            }
        }
    }

    // Devuelve un id único de Producto para ser utilizado al momento de ingresarlo en el array 'products'
    getFreeProductId() {
        let id = 1;
        this.products.length > 0 ? id = this.products[this.products.length - 1].id + 1 : null;
        return id;
    }

    // Devuelve el array con todos los productos creados hasta el momento
    async getProducts() {
        if (fs.existsSync(this.path)) {
            try {
                this.products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
                return this.products;
            } catch (error) {
                console.error(`⛔ Error: No se pudo leer el archivo de Productos.
   Descripción del error: ${error.message}`);
            }
        } else {
            console.error("⛔ Error: El archivo de Productos no existe.");
            return undefined;
        }
    }

    // En caso de encontrarlo, devuelve un objeto 'Producto' de acuerdo a id proporcionado por argumento.
    // En caso de no encontrarlo, imprime error en la consola.
    async getProductById(id) {
        try {
            this.products = await this.getProducts().then((result) => result);
            let productFound = undefined;
            this.products.forEach(product => {
                product.id === id ? productFound = product : null;
            })
            if (productFound === undefined) {
                console.error(`⛔ Error: Producto id #${id} no encontrado`);
            }
            return productFound;
        } catch {
            //El mensaje de error por falta de acceso al archivo JSON ya es emitido por la función getProducts()
            //No se agrega aquí, para evitar mensajes duplicados
        }
    }

    // Actualiza un producto que es pasado por parámetro en el archivo 'data.json'
    async updateProduct(product) {
        try {
            const productGotten = await this.getProductById(product.id);
            if (productGotten === undefined) {
                console.error(`⛔ Error: No se pudo actualizar el producto ${product.title}`);
            } else {
                if (product.verifiedProduct()) {
                    this.products = await this.getProducts().then((result) => result);
                    const index = this.products.findIndex(p => p.id === product.id);
                    this.products[index] = product;
                    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");
                    console.log(`✅ Producto '${product.title}' actualizado exitosamente`);
                } else {
                    console.error("⛔ Error: Producto con propiedades vacías o sin definir");
                }
            }
        } catch {
            //El mensaje de error por falta de acceso al archivo JSON ya es emitido por la función getProducts()
            //No se agrega aquí, para evitar mensajes duplicados
        }
    }

    async deleteProduct(id) {
        try {
            const productGotten = await this.getProductById(id);
            if (productGotten === undefined) {
                console.error(`⛔ Error: No se pudo borrar el producto`);
            } else {
                const index = this.products.findIndex(product => product.id === id);
                this.products.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8")
                console.log(`✅ Producto #${id} eliminado exitosamente`);
            }
        } catch {
            //El mensaje de error por falta de acceso al archivo JSON ya es emitido por la función getProducts()
            //No se agrega aquí, para evitar mensajes duplicados
        }
    }
}

export { Product, ProductManager };