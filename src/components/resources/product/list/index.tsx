import React from "react";

import { Product } from "../product";
import { CreateProduct } from "../create";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteProduct from "../delete";
import UpdateProduct from "../update";
import { formatCurrency } from "@/utils/currencyConverter";

export const ListProduct = ({ products }: { products: Array<Product> }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categorias</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell><p>{product.name}</p></TableCell>
            <TableCell><p>{formatCurrency(Number(product.price))}</p></TableCell>
            <TableCell><p>{product.description}</p></TableCell>
            <TableCell className="flex flex-wrap gap-1">
              {product.categories?.map(category => (
                <p
                  className="text-xs bg-slate-100 text-black rounded-full text-center py-[1px] px-1"
                  key={category.categoryName}
                >
                  {category.categoryName}
                </p>
              ))}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <DeleteProduct product={product} />
                <UpdateProduct id={String(product.id)} />
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={7}>
            <CreateProduct products={products} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
