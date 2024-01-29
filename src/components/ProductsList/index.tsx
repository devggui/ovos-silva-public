import React, { useEffect, useState } from "react"
import { FlatList, Text, ScrollView, View } from "react-native"
import { ProductProps } from "../../@types/product"
import { CategoryProps } from "../../@types/category"
import { Searchbar } from "react-native-paper"

import { ProductCard } from "../ProductCard"
import { Loading } from "../Loading"
import { NotFound } from "../NotFound"
import { CategoryCard } from "../CategoryCard"

import NotFoundSvg from "../../assets/404.svg"
import SearchNotFoundSvg from "../../assets/search-not-found.svg"
import { admin } from "../../lib/axios"
import { theme } from "../../global/styles/theme"
import Toast from "react-native-root-toast"

type Props = {
  onRefresh: boolean
  setOnRefresh: (isRefresh: boolean) => void  
}

export function ProductsList({ onRefresh, setOnRefresh }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>()        
  const [products, setProducts] = useState<ProductProps[]>([])      
  const [categories, setCategories] = useState<CategoryProps[]>([])            
  const [categorySelected, setCategorySelected] = useState('')  
  const [searchQuery, setSearchQuery] = useState('')    
  const [productsByUniqueCategory, setProductsByUniqueCategory] = useState([])
  const [productsBySearchQuery, setProductsBySearchQuery] = useState([])      
  
  useEffect(() => {
    getCategoriesAndProducts()           
  }, [])

  useEffect(() => {
    if (onRefresh) {
      getCategoriesAndProducts()
    }
  }, [onRefresh])

  useEffect(() => {
    if (categorySelected === '') {      
      setProductsByUniqueCategory([])
    } else {
      getProductByCategory(categorySelected)
    }
  }, [categorySelected])

  useEffect(() => {
    if (searchQuery === '') {
      setProductsBySearchQuery([])
    } else {
      getProductsBySearchQuery(searchQuery)
    }

    if (searchQuery.length > 0) {
      setCategorySelected('')
    }
  }, [searchQuery])  

  async function getCategoriesAndProducts() {            
    setIsLoading(true)

    await admin.get('/categories')
      .then(response => response.data)
      .then(data => setCategories(data))
      .catch(error => {
        console.log(error)
        showToast('Erro no servidor, faça o pedido pelo Whatsapp!', "#dc3545")
      })

    await admin.get('/products')
      .then(response => response.data)
      .then(data => setProducts(data))   
      .catch(error => {
        console.log(error)
        showToast('Erro no servidor, faça o pedido pelo Whatsapp!', "#dc3545")
      })       
      
    setIsLoading(false)    

    setOnRefresh(false)
  }

  async function getProductByCategory(categorySelected: string) {    
    const data = productsByCategories.filter(product => product.id === categorySelected)            

    setProductsByUniqueCategory(data)
  }  

  async function getProductsBySearchQuery(searchQuery: string) {
    const data = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    setProductsBySearchQuery(data)
  }

  function filterProductByCategory() {
    const data = categories.map(category => {
      const productByCategory = products.filter(product => product.categoryId === category.id);
  
      // Find the index of "Ovos Brancos" in the filtered products
      const whiteEggsIndex = productByCategory.findIndex(product => product.name.toLowerCase() === 'ovos brancos');        

      // If "Ovos Brancos" is found, move it to the front of the array
      if (whiteEggsIndex !== -1) {
        const updatedProductByCategory = [
          productByCategory[whiteEggsIndex],
          ...productByCategory.slice(0, whiteEggsIndex),
          ...productByCategory.slice(whiteEggsIndex + 1),
        ];
  
        return {
          id: category.id,
          title: category.name,
          products: updatedProductByCategory,
        };
      }
  
      // If "Ovos Brancos" is not found, return the original productByCategory
      return {
        id: category.id,
        title: category.name,
        products: productByCategory,
      };
    });
  
    return data;
  }

  function filterProductWithPromotion() {
    const data = products.filter(product => product.promotionalPrice)

    return data
  }
  
  function handleCategorySelect(categoryId: string) {
    categoryId === categorySelected ? setCategorySelected('') : setCategorySelected(categoryId)
  }

  const productsByCategories = filterProductByCategory()
  const productWithPromotion = filterProductWithPromotion()  
  const onChangeSearch = (query: string) => setSearchQuery(query)    

  const showToast = (message: string, background: string) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: background,
      opacity: 1,
      textColor: "#FFF",
      containerStyle: {
        borderRadius: 100,
        paddingHorizontal: 24,
        marginTop: 24
      }    
    })
  }

  return (
    <>      
      {isLoading && ( <Loading /> )}   
      
      { !isLoading && 
        productWithPromotion.length === 0 && 
        productsByCategories.length === 0 && (
        <NotFound 
          title="Ops, não encontramos os produtos. Mas já estamos trabalhando para solucionar o problema!"           
          image={ <NotFoundSvg width={160} height={160} /> }
        />
      )}

      { !isLoading && 
        (productWithPromotion.length > 0 || productsByCategories.length > 0) && (
        <View className="mx-4 mb-4">
          <Searchbar 
            style={{ 
              borderRadius: 8, 
              backgroundColor: theme.colors.secondary,
              color: "black"              
            }}            
            iconColor={theme.colors.primary}
            placeholder="Ovos brancos"
            placeholderTextColor={theme.colors.black60}          
            onChangeText={onChangeSearch}
            value={searchQuery}
          />          
        </View>
      )}      

      { !isLoading && 
        productWithPromotion.length > 0 && 
        productsBySearchQuery.length === 0 &&
        searchQuery === '' && (
        <>                    
          <Text className="ml-4 font-title700 text-black/80 text-2xl mb-2">
            Promoção do dia
          </Text>

          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24, paddingBottom: 40 }}
            data={productWithPromotion}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </>
      )}

      { !isLoading && 
        (productWithPromotion.length > 0 || productsByCategories.length > 0) && 
        productsBySearchQuery.length === 0 &&
        searchQuery === '' && (
        <>                              
          <ScrollView
            horizontal
            className="pl-4 mb-4"
            showsHorizontalScrollIndicator={false}      
            contentContainerStyle={{ paddingRight: 40 }}
          >
            {categorySelected !== '' && (
              <CategoryCard 
                name="Voltar"                 
                onPress={() => setCategorySelected('')}
                backButton
              />
            )}

            {categories.map(category => (
              <CategoryCard
                key={category.id}
                name={category.name}
                imageUrl={category.imageUrl}    
                checked={category.id === categorySelected}
                onPress={() => handleCategorySelect(category.id)}
              />
            ))}
          </ScrollView>     
        </>
      )}      

      { !isLoading && 
        productsByUniqueCategory.length > 0 && 
        productsBySearchQuery.length === 0 && 
        searchQuery === '' &&
        productsByUniqueCategory.map(item => (
        <View key={item.id}>
          <Text className="ml-4 font-title700 text-black/80 text-2xl mb-2">
            {item.title}
          </Text>

          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24, paddingBottom: 40 }}
            data={item.products}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>
      ))}
          
      { !isLoading && 
        productsByCategories.length > 0 && 
        productsByUniqueCategory.length === 0 && 
        productsBySearchQuery.length === 0 &&
        searchQuery === '' && 
        productsByCategories.map(item => (
        <View key={item.id}>
          <Text className="ml-4 font-title700 text-black/80 text-2xl mb-2">
            {item.title}
          </Text>

          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24, paddingBottom: 40 }}
            data={item.products}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </View>
      ))}

      {/* Products By Search Query */}            
      {!isLoading && productsBySearchQuery.length === 0 && searchQuery !== '' && (
        <NotFound 
          title="Não foi encontrado produtos para o filtro digitado!"           
          image={ <SearchNotFoundSvg width={160} height={160} /> }
        />        
      )}                             
      
      {!isLoading && productsBySearchQuery.length > 0 && searchQuery !== '' && (
        <>
          <Text className="ml-4 font-title700 text-black/80 text-2xl mb-2">
            Filtro
          </Text>

          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24, paddingBottom: 40 }}
            data={productsBySearchQuery}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
          />
        </>
      )}
    </>       
  )
}