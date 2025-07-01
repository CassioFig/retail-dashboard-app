'use client'

import { OrderItem, Product } from '@/interfaces'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { orderService } from '@/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {
  products: Product[]
}

export const SalesChart: React.FC<Props> = ({ products }) => {
	const [orders, setOrders] = useState<Pick<OrderItem, 'quantity' | 'product' | 'productId'>[]>([])

  const fetchOrders = () => {
		orderService.getAllOrdersByProduct()
			.then(data => {
				setOrders(data)
			})
	}

  const data = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: 'Units Sold',
        data: orders.map(order => order.quantity),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      },
    ],
  }

	useEffect(() => {
		fetchOrders()
	}, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Product Sales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
