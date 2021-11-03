import React from 'react';
import { GetStaticProps } from 'next';
import { Product } from '../product/types';
import api from '../product/api';
import { Grid, Stack, Text, Button, Link, Flex } from '@chakra-ui/react';
interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: 'currency',
    currency: 'ARS'
  })
}

const IndexRoute: React.FC<Props> = ( { products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  function handleAddToCart(product: Product) {
    setCart(cart=> cart.concat(product));
  }
  const text = React.useMemo(() => {
    return cart.reduce((message, product) => message.concat(`- ${product.title} - ${parseCurrency(product.price)}\n`), ` `)
      .concat(`\nTotal: $ ${cart.reduce((total, product) => total + product.price, 0)}`)
  },[cart]);

  return( 
  <Stack
    spacing={6}          
  >
    <Grid gridGap={6} templateColumns= 'repeat(auto-fill, minmax(240px, 1fr))'>
      { products.map( (product) => 
        <Stack
          spacing={3}
          borderRadius="md"
          padding={4}
          backgroundColor='gray.100'
          key={product.id} 
         >
         <Stack spacing={1}>
          <Text >{product.title}</Text>
            <Text 
              fontSize="sm" 
              fontWeight="500" 
              color="green.500"
            >
              {parseCurrency(product.price)}
            </Text>
         </Stack>
          <Button 
          colorScheme="black" 
          onClick={ ()=> handleAddToCart(product) }
          variant="outline"
          backgroundColor="yellow.400"
          >
            Agregar 
          </Button>


        </Stack>)
      }
    </Grid>
    {
      Boolean(cart.length) && 
       <Flex
       bottom={4}
       padding={4}
     
        position="sticky"
        alignItems="center"
        justifyContent="center"
       >
          <Button 
            as={Link}
            width="fit-content"
            href={`https://wa.me/5493533473625?text=${encodeURI(text)}`}
            colorScheme="whatsapp"
            isExternal

          >
            Completar pedido ({cart.length} productos)
          </Button> 
       </Flex>
  }
  </Stack>
  );
  // <div>{JSON.stringify(products)}</div>;
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return{
    revalidate: 10,
    props: {
      products
    },
    // revalidate: 1
  };
};

export default IndexRoute;