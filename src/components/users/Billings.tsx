'use client'

import Loading from '@/components/Loading'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/lib/utils'
import { useGetTransactionsQuery } from '@/state/api'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

const Billings = () => {
  const [paymentType, setPaymentType] = useState('all')
  const { user, isLoaded } = useUser()
  const { data: transactions, isLoading: isLoadingTransactions } = useGetTransactionsQuery(user?.id || '', {
    skip: !isLoaded || !user,
  })

  const filteredData = transactions?.filter(t => (paymentType === 'all' || t.paymentProvider === paymentType)) || []

  if (!isLoaded) return <Loading />
  if (!user) return <div>Please sign in to view your billing information.</div>

  return (
    <div className='billing'>
      <div className='billing__container'>
        <h2 className='billing__title'>Payment History</h2>

        <div className='billing__filters'>
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className='billing__select'>
              <SelectValue placeholder='Payment Type' />
            </SelectTrigger>

            <SelectContent className='billing__select-content'>
              <SelectItem value='all' className='billing__select-item'>
                All Types
              </SelectItem>
              <SelectItem value='stripe' className='billing__select-item'>
                Stripe
              </SelectItem>
              <SelectItem value='paypal' className='billing__select-item'>
                Paypal
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='billing__grid'>
          {isLoadingTransactions ? (
            <Loading />
          ) : (
            <Table className='billing__table'>
              <TableHeader className='billing__table-header'>
                <TableRow className='billing__table-header-row'>
                  <TableHead className='billing__table-cell'>Amount</TableHead>
                  <TableHead className='billing__table-cell'>Payment Method</TableHead>
                  <TableHead className='billing__table-cell'>Purchase Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className='billing__table-body'>
                {filteredData.length > 0 ? (
                  filteredData.map((transaction) => (
                    <TableRow key={transaction.transactionId} className='billing__table-row'>
                      <TableCell className='billing__table-cell billing__amount'>
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell className='billing__table-cell'>
                        {transaction.paymentProvider}
                      </TableCell>
                      <TableCell className='billing__table-cell'>
                        {new Date(transaction.dateTime).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className='billing__table-row'>
                    <TableCell colSpan={3} className='text-center billing__table-cell'>
                      No transactions to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Billings
