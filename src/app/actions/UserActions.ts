"use server";

import { prisma } from "@/prisma";
import { CartType } from "@/store/cartSlice";
import { CategoryType } from "@/store/categorySlice";

type ResponseType = {
    status: number;
    message: string;
    formFields?: any;
    response?: any;
}

type AddToCartType = {
    userId: string,
    productId: string;
    quantity: number;
}

export const getUserCart = async (userId: string) => {
    try {
        if (!userId) {
            return { status: 422, message: "Invalid User!" } as ResponseType
        }
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: {
                                    select: {
                                        categorySlug: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!cart) {
            return { status: 404, message: "Cart not found!" } as ResponseType;
        }

        const formattedCart = {
            cartId: cart.id,
            userId: cart.userId,
            items: cart.items &&
                cart.items.map(item => ({
                    ...item,
                    product: item.product && {
                        ...item.product,
                        productId: item.product.id
                    },
                })),
            totalAmount: cart.totalAmount,
            createdAt: cart.createdAt.toISOString(),
            updatedAt: cart.updatedAt.toISOString(),
        }

        // console.log("Cart_Data", formattedCart)
        return { status: 200, message: "Product fetched successfully!", response: formattedCart as unknown as CartType } as ResponseType
    } catch (error: any) {
        console.log("Product_Fetch_Error : ", error)
        return { status: 500, message: error.message || "An unexpected error occurred." } as ResponseType;
    }
}

export const addToCart = async (cart: AddToCartType): Promise<ResponseType> => {
    console.log("CartUpdate", cart);

    try {
        if (!cart || !cart.productId || cart.quantity <= 0) {
            return { status: 422, message: "Invalid cart item!" } as ResponseType;
        }

        let existingCart = await prisma.cart.findUnique({
            where: { userId: cart.userId as string },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }

            }
        });

        const product = await prisma.product.findUnique({
            where: { id: cart.productId }
        })

        if (!product) {
            return { status: 404, message: "Product not found!" } as ResponseType;
        }

        // Create New Cart
        if (!existingCart) {
            const newCart = await prisma.cart.create({
                data: {
                    userId: cart.userId,
                    items: {
                        create: [{
                            productId: product.id,
                            quantity: cart.quantity,
                            unitRate: product.price.current,
                            price: cart.quantity * product.price.current,
                        }],
                    },
                    totalAmount: cart.quantity * product.price.current,
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });


            const formattedNewCart = {
                ...newCart,
                createdAt: newCart.createdAt.toISOString(),
                updatedAt: newCart.updatedAt.toISOString(),
            };
            console.log("New_Cart", formattedNewCart)
            return { status: 201, message: "Cart created successfully!", response: formattedNewCart as CartType } as ResponseType;
        }

        // Update Existing  Cart
        const updatedCartItems = await prisma.cartItem.create({
            data: {
                cartId: existingCart.id,
                productId: cart.productId,
                quantity: cart.quantity,
                unitRate: product.price.current,
                price: cart.quantity * product.price.current,
            },
        });

        const newTotalAmount = existingCart.items.reduce((total, item) => total + item.price, 0)
            + updatedCartItems.price;

        const updatedCart = await prisma.cart.update({
            where: { id: existingCart.id },
            data: {
                totalAmount: newTotalAmount,
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const formattedCart = {
            ...updatedCart,
            createdAt: updatedCart.createdAt.toISOString(),
            updatedAt: updatedCart.updatedAt.toISOString(),
        };

        return { status: 200, message: "Cart updated successfully!", response: formattedCart as CartType } as ResponseType;
    } catch (error: any) {
        console.log("Cart_Update_Error:", error);
        return { status: 500, message: error.message || "An unexpected error occurred." } as ResponseType;
    }
};

export const removeItemFromCart = async (userId: string, productId: string): Promise<ResponseType> => {
    try {
        if (!userId || !productId) {
            return { status: 422, message: "Invalid User or Product!" } as ResponseType;
        }

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true }
        });

        if (!cart) {
            return { status: 404, message: "Cart not found!" } as ResponseType;
        }

        const itemToRemove = cart.items.find(item => item.productId === productId);

        if (!itemToRemove) {
            return { status: 404, message: "Item not found in cart!" } as ResponseType;
        }

        await prisma.cartItem.delete({
            where: { id: itemToRemove.id }
        });

        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: {
                totalAmount: cart.items.reduce((total, item) => {
                    if (item.id !== itemToRemove.id) {
                        return total + item.price;
                    }
                    return total;
                }, 0),
            },
            include: { items: true }
        });

        console.log({ remove: updatedCart })

        return { status: 204, message: "Item removed successfully!", response: updatedCart as unknown as CartType } as ResponseType;
    } catch (error: any) {
        console.log("Remove_Item_Error:", error);
        return { status: 500, message: error.message || "An unexpected error occurred." } as ResponseType;
    }
};