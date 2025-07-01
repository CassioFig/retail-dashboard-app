'use client'

import { Product } from '@/interfaces'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  products: Product[]
}

export const ProductAvailabilityChart: React.FC<Props> = ({ products }) => {
  const inStock = products.filter(p => p.stock > 0).length
  const outOfStock = products.filter(p => p.stock === 0).length

  const data = {
    labels: ['In Stock', 'Out of Stock'],
    datasets: [
      {
        data: [inStock, outOfStock],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Availability</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}
