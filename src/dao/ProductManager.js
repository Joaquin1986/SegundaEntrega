// Se definen los imports
import productModel from "../models/product.model.js";
import { Error } from "mongoose";

// Clase Product, con su correspondiente contructor las props definidas en la consigna
class Product {
    constructor(title, description, price, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnails = [];
        this.code = code;
        this.status = true;
        this.stock = stock;
    }
}

// Clase ProductManager con su constructor tal como se solicitó, con un array 'products' vacío
class ProductManager {

    // Agrega un producto al array 'products'. Devuelve -1 si el producto ya existe.
    static async addProduct(product) {
        try {
            const productAlreadyExist = await productModel.find({ code: product.code });
            if (Object.keys(productAlreadyExist).length === 0) {
                try {
                    const productCreated = await productModel.create(product);
                    console.log(`✅ Producto '${product.title}' agregado exitosamente a la Base de Datos`);
                    return productCreated;
                } catch (error) {
                    throw new Error(`⛔ Error al guardar el producto: ${error.message}`);
                }
            } else {
                console.error(`⛔ Error: Código de Producto ya existente (Código:'${productAlreadyExist.code}'|Producto:'${productAlreadyExist.title}')`);
                return -1;
            }
        } catch (error) {
            throw new Error(`⛔ Error: No se pudo guardar en la BD de Productos.
   Descripción del error: ${error.message}`);
        }
    }

    // Devuelve el array con todos los productos creados hasta el momento
    static async getProducts() {
        try {
            return productModel.find().lean();
        } catch (error) {
            console.error(`⛔ Error al obtener datos de la BD: ${error.message}`);
            return undefined;
        }
    }

    // En caso de encontrarlo, devuelve un objeto 'Producto' de acuerdo a id proporcionado por argumento.
    // En caso de no encontrarlo, imprime error en la consola.
    static async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            console.log(product)
            if (!product) {
                throw new Error(`⛔ Error: Producto id #${id} no encontrado`);
            }
            return product;
        } catch (error) {
            console.error(`⛔ Error al obtener datos de la BD: ${error.message}`);
            return undefined;
        }
    }

    // Actualiza un producto que es pasado por parámetro en el archivo 'data.json'
    static async updateProduct(pid, data) {
        let result = false;
        try {
            await productModel.updateOne({ _id: pid }, { $set: data });
            console.log(`✅ Producto '${data.title}' actualizado exitosamente`);
            result = true;
            return result;
        } catch {
            return result;
        }
    }

    static async deleteProduct(id) {
        let result = false;
        try {
            const productAlreadyExist = await productModel.find({ _id: id });
            if (Object.keys(productAlreadyExist).length === 0) {
                throw new Error(`⛔ Error: No se pudo borrar el producto ID#${id}`);
            } else {
                await productModel.deleteOne({ _id: id });
                console.log(`✅ Producto #${id} eliminado exitosamente`);
                result = true;
                return result
            }
        } catch {
            return result;
        }
    }
}

export { Product, ProductManager };