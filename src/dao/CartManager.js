// Se definen los imports
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// Clase Cart, con su correspondiente contructor las props definidas en la consigna
class Cart {
    constructor() {
        this.products = [];
    }
}


// Clase CartManager con su constructor tal como se solicitó, con un array 'products' vacío
class CartManager {

    // AGREGA UN CARRITO A LA DB
    static async addCart() {
        try {
            const cartCreated = await cartModel.create(new Cart());
            console.log(`✅ Carrito '${cartCreated._id}' agregado exitosamente`);
            return cartCreated;
        } catch (error) {
            throw new Error(`⛔ Error: No se pudo guardar el Carrito en la BD.
   Descripción del error: ${error.message}`);
        }
    }

    //AGREGA CIERTA CANTIDAD DE UN PRODUCTO A UN CARRITO YA EXISTENTE
    //STATUS POSIBLES QUE DEVUELVE: -1 = CARRITO NO EXISTE , -2 = PRODUCTO NO EXISTE, 1 = OK
    static async addProductToCart(cartId, productId, quantity) {
        let status = -1;
        try {
            //VERIFICAMOS EL CARRITO, SI NO EXISTE DEVUELVE ERROR
            if (!await cartModel.findById(cartId)) return status;
            status = -2;
            //VERIFICAMOS EL PRODUCTO, SI NO EXISTE DEVUELVE ERROR
            if (!await productModel.findById(productId)) return status;
            //BUSCAMOS SI YA EXISTE EL PRODUCTO DENTRO DEL CARRITO
            const productAlreadyExist = await cartModel.find({ "products.product": productId });
            if (Object.keys(productAlreadyExist).length === 0) {
                const prod = `{"product": "${productId}","quantity": ${parseInt(quantity)}}`;
                const prodJSON = JSON.parse(prod);
                await cartModel.updateOne({ _id: cartId }, { $push: { products: prodJSON } });
                console.log(`✅ Producto '${productId}' agregado exitosamente al Carrito '${cartId}'`);
                status = 1;
            } else {
                await cartModel.updateOne({ _id: cartId, "products.product": productId }, { $inc: { "products.$.quantity": parseInt(quantity) } });
                console.log(`✅ +${quantity} de Producto '${productId}' agregado exitosamente al Carrito '${cartId}'`);
                status = 1;
            }
            return status;
        } catch (error) {
            console.error(`⛔ Error: No se pudo guardar en la BD de Carritos.
   Descripción del error: ${error.message}`);
            return status;
        }
    }

    // AGREGA UN ARRAY DE PRODUCTOS A UN CARRITO
    // STATUS POSIBLES QUE DEVUELVE: -1 = CARRITO NO EXISTE , -2 = PRODUCTO NO EXISTE, 1 = OK
    static async addArrayToCart(cartId, data) {
        let status = -1;
        try {
            // VERIFICAMOS EL CARRITO, SI NO EXISTE DEVUELVE ERROR
            if (!await cartModel.findById(cartId)) return status;
            status = -2;
            // VERIFICAMOS CADA PRODUCTO DEL ARRAY
            let products = [];
            for (let i = 0; i < data.length; i++) {
                const prod = await productModel.findById(data[i].product);
                if (!prod) return status;
                //BUSCAMOS SI YA EXISTE EL PRODUCTO DENTRO DEL CARRITO
                const productAlreadyExist = await cartModel.find({ "products.product": data[i].product });
                if (Object.keys(productAlreadyExist).length === 0) {
                    const prod = `{"product": "${data[i].product}","quantity": ${parseInt(data[i].quantity)}}`;
                    const prodJSON = JSON.parse(prod);
                    await cartModel.updateOne({ _id: cartId }, { $push: { products: prodJSON } });
                    console.log(`✅ Producto '${data[i].product}' agregado exitosamente al Carrito '${cartId}'`);
                    status = 1;
                } else {
                    await cartModel.updateOne({ _id: cartId, "products.product": data[i].product }, { $inc: { "products.$.quantity": parseInt(data[i].quantity) } });
                    console.log(`✅ +${data[i].quantity} de Producto '${data[i].product}' agregado exitosamente al Carrito '${cartId}'`);
                    status = 1;
                }
            }
            return status;
        } catch (error) {
            console.error(`⛔ Error: No se pudo guardar en la BD de Carritos.
        Descripción del error: ${error.message}`);
            return status;
        }
    }

    // Devuelve el array con todos los productos creados hasta el momento (para verificación)
    static async getCarts() {
        try {
            return cartModel.find().lean();
        } catch (error) {
            throw new Error(`⛔ Error al obtener datos de la BD: ${error.message}`);
        }
    }

    // En caso de encontrarlo, devuelve un objeto 'Carrito' de acuerdo a id proporcionado por argumento.
    // En caso de no encontrarlo, imprime error en la consola.
    static async getCartById(id) {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) {
                throw new Error(`⛔ Error: Carrito ID#${id} no encontrado`);
            }
            return cart;
        } catch (error) {
            throw new Error(`⛔ Error al obtener datos de la BD: ${error.message}`);
        }
    }

    // BORRA UN PRODUCTO (PID) DE UN CARRITO DETERMINADO (CID)
    static async deleteProductFromCart(idCart, idProd) {
        let result = false;
        try {
            // VERIFICAMOS EL CARRITO, SI NO EXISTE DEVUELVE FALSE
            if (!await cartModel.findById(idCart)) return result;
            // VERIFICAMOS SI EL PRODUCTO EXISTE EN EL CARRITO
            const productAlreadyExistInCart = await cartModel.find({ "products.product": idProd });
            if (Object.keys(productAlreadyExistInCart).length === 0) {
                throw new Error(`⛔ Error: No se encuentra el producto ID#${idProd} en el carrito ID#${idCart}`);
            } else {
                await cartModel.updateOne({ _id: idCart }, { $pull: { products: { product: idProd } } })
                console.log(`✅ Producto ID#${idProd} eliminado exitosamente del carrito ID#${idCart}`);
                result = true;
                return result
            }
        } catch {
            return result;
        }
    }

    // BORRA UN PRODUCTO (PID) DE UN CARRITO DETERMINADO (CID)
    static async emptyCart(idCart) {
        let result = false;
        try {
            // VERIFICAMOS EL CARRITO, SI NO EXISTE DEVUELVE FALSE
            if (!await cartModel.findById(idCart)) return result;
            await cartModel.updateOne({ _id: idCart }, { $pull: { products: {} } }, { multi: true });
            console.log(`✅ El Carrito ID#${idCart} fue vaciado exitosamente!`);
            result = true;
            return result
        } catch {
            return result;
        }
    }

}

export { Cart, CartManager };