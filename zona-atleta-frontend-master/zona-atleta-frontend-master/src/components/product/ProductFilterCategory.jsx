import Soccer from '../icons/Soccer'

function ProductCategoryCard({ category, onClick = () => { } }) {
  return (
    <div className='product-category-card' onClick={onClick}>
      <p>{category.name}</p>
    </div>
  )
}

function ProductFilterCategory({ categories, getOnClickCard }) {
  return (
    <div className='product-filter-category'>
      <div className='product-filter-category__container'>
        {
          categories.map((c, i) => <ProductCategoryCard key={i} category={c} onClick={getOnClickCard(c.name)} />)
        }
      </div>
    </div>
  )
}

export default ProductFilterCategory