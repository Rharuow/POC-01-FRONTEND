import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

const Loading = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Cobrança</TableHead>
          <TableHead>Entrega</TableHead>
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
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={6}><Skeleton className='h-24' /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default Loading
