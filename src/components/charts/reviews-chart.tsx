'use client'

import { Product } from '@/interfaces'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type Props = {
  products: Product[]
}

export const ReviewsChart: React.FC<Props> = ({ products }) => {
  const reviewsData = products.map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    rating: product.rating?.average || 0,
    count: product.rating?.count || 0
  }))

  const data = {
    labels: reviewsData.map(item => item.name),
    datasets: [
      {
        label: 'Average Rating',
        data: reviewsData.map(item => item.rating),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Product Ratings',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
