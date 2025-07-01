'use client'

import { productsService } from "@/api"
import { ProductAvailabilityChart, ReviewsChart, SalesChart } from "@/components"
import { SessionContext } from "@/contexts"
import { useApi } from "@/hooks"
import { Product } from "@/interfaces"
import { PlusIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function AdminPage() {
  const { userSession } = useContext(SessionContext)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
  const router = useRouter()

  const {
    execute: fetchProducts,
    loading: loadingProducts,
    data: products,
    setData: setProducts
  } = useApi<Product[], void>({
    service: productsService.getProducts
  })

  const handleIncreaseStock = async (productId: string) => {
    setUpdatingStock(productId)
    try {
      await productsService.addProductToStock({ id: productId, stock: 1 })
      fetchProducts()
    } catch (error) {
      console.error('Error updating stock:', error)
    } finally {
      setUpdatingStock(null)
    }
  }

  useEffect(() => {
    if (userSession === null || !userSession?.isAdmin) {
      router.push('/')
      return
    }
    
    setIsCheckingUser(false)
    fetchProducts()
  }, [userSession, router])

  if (isCheckingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black"></div>
      </div>
    )
  }

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black"></div>
      </div>
    )
  }

  const totalProducts = products?.length || 0
  const totalStock = products?.reduce((sum, product) => sum + (product.stock || 0), 0) || 0
  const avgRating = totalProducts > 0 ? (products?.reduce((sum, product) => sum + (product.rating?.average || 0), 0) || 0) / totalProducts : 0
  const totalReviews = products?.reduce((sum, product) => sum + (product.rating?.count || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor your store performance and manage inventory</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Stock</p>
                <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {products && <ProductAvailabilityChart products={products} />}
          {products && <SalesChart products={products} />}
        </div>

        <div className="mb-8">
          {products && <ReviewsChart products={products} />}
        </div>

        {/* Product Inventory Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Management</h3>
            <p className="text-sm text-gray-600">Manage product stock levels</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products?.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.imgUrl}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (product.stock || 0) > 10 
                          ? 'bg-green-100 text-green-800' 
                          : (product.stock || 0) > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock || 0} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.rating?.average?.toFixed(1) || 'N/A'} ({product.rating?.count || 0})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleIncreaseStock(product.id)}
                        disabled={updatingStock === product.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {updatingStock === product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add Stock
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}