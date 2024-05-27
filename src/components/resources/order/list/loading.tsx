import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const Loading = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Cliente</TableHead>
          <TableHead className="text-center">Produtos</TableHead>
          <TableHead className="text-center">Valores unitários</TableHead>
          <TableHead className="text-center">Quantidades</TableHead>
          <TableHead className="text-center">Valores totais</TableHead>
          <TableHead className="text-center">Total da venda</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={7}><Skeleton className='h-24' /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default Loading
