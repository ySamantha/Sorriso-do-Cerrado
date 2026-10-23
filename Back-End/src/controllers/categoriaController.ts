import type { Request, Response } from "express";
import CategoriaModel from "../models/categoriaModel.js";

export const listarCategorias = async (
    req: Request,
    res: Response
) => {
    try {
        const categorias = await CategoriaModel.listarTodas();

        res.json(categorias);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao buscar categorias",
        });
    }
};