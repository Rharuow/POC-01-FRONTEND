import React from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
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
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
            <TableCell><Skeleton className='h-16' /></TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={5}><Skeleton className='h-24' /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default Loading
