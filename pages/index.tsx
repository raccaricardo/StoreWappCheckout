import React from 'react';
import { GetStaticProps } from 'next';
import { Product } from '../product/types';
import api from '../product/api';
import { Grid, Stack, Text, Button, Link, Flex, Image } from '@chakra-ui/react';
import { motion , AnimatePresence, AnimateSharedLayout } from 'framer-motion';
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
  const [selectedImage, setSelectedImage] = React.useState<string>(null);

  function handleAddToCart(product: Product) {
    setCart(cart=> cart.concat(product));
  }
  const text = React.useMemo(() => {
    return cart.reduce((message, product) => message.concat(`- ${product.title} - ${parseCurrency(product.price)}\n`), ` `)
      .concat(`\nTotal: $ ${cart.reduce((total, product) => total + product.price, 0)}`)
  },[cart]);

  // React.useEffect(() => {
  //   setTimeout(() => setCart([]), 2000);
  // }, [cart]);
 

  return( 
  <AnimateSharedLayout type="crossfade">

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
            <Image 
              as={motion.img}
              cursor="pointer" 
              layoutId={product.image}
              maxHeight={128}
              objectFit="cover"
              src={product.image} 
              alt={product.title} 
              onClick={() => setSelectedImage(product.image)}
            />
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
        initial={{scale:0}}
        animate={{scale:1}}
        exit={{scale:0}}
        as={motion.div}
        bottom={4}
        padding={4}
        position="sticky"
        alignItems="center"
        justifyContent="center"
        >
            <Button 
              as={Link}
              width="fit-content"
              href={`https://wa.me/5493534271409?text=${encodeURI(text)}`}
              colorScheme="whatsapp"
              isExternal
              leftIcon={
                <Image 
                  // src="https://icongr.am/material/cart-arrow-right.svg?size=128&color=ffffff"
                  src="https://icongr.am/material/whatsapp.svg?size=32&color=ffffff"
                  width="fit-content"
                />
              }
              >
              Completar pedido ({cart.length} productos)
            </Button> 
        </Flex>
    }
    </Stack>
    <AnimatePresence>
      {selectedImage && (
      <Flex 
      key="backdrop" 
        alignItems="center" 
        as={motion.div} 
        backgroundColor="rgba(0,0,0,0.5)" 
        height="100%"
        justifyContent="center"
        layoutId={selectedImage}
        position="fixed"
        top={0}
        left={0}
        width="100%"
        onClick={ () => setSelectedImage(null)}
      >
        <Image key="image" src={selectedImage}/>
      </Flex>)
      }
    </AnimatePresence>
  </AnimateSharedLayout>
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
