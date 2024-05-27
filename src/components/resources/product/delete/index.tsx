import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@apollo/client'

import { Product } from '../product'
import { DELETE_PRODUCT } from '@/service/mutation/product'
import { apolloClient } from '@/lib/apollo'
import { GET_PRODUCTS } from '@/service/queries/products'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAccordionContext } from '@/pages'

export default function DeleteProduct({ product }: { product: Product }) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const { setAccordionValue } = useAccordionContext()

  const [deleteProduct] = useMutation(DELETE_PRODUCT)

  async function handleDeleteProduct(id: string) {
    try {
      setAccordionValue("")
      await deleteProduct({
        variables: { id },
        update: (cache) => {
          const data = apolloClient.readQuery({ query: GET_PRODUCTS });

          cache.writeQuery({
            query: GET_PRODUCTS,
            data: {
              getProducts: data.getProducts.filter((pdt: Product) => pdt.id !== product.id),
            },
          });
        }
      })
      setAccordionValue("products")
      toast("Produto deletado com sucesso...")
    } catch (error) {
      console.log("error = ", error);

      toast("Desculpe, mas não foi possível deletar o produto")
    } finally {
      setDeleteModalIsOpen(false)
    }
  }

  return (
    <Dialog open={deleteModalIsOpen}>
      <DialogTrigger asChild onClick={() => setDeleteModalIsOpen(true)}>
        <Trash2 size={22} className="bg-red-500 p-1 text-white rounded-full" />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle><p>Você deseja deletar {product.name}?</p></DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={() => handleDeleteProduct(String(product.id))}>Deletar</Button>
              <Button onClick={() => setDeleteModalIsOpen(false)}>Cancelar</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
