import takePic from './assets/takePic.png';
import home from './assets/home.png';
import profile from './assets/profile.png';
import test from './assets/test.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';

interface ProductProps {
  product: string;
}

function Product(props: ProductProps) {
  const microplasticsLink =
    'https://oceanservice.noaa.gov/facts/microplastics.html#:~:text=Plastic%20debris%20can%20come%20in,as%20some%20cleansers%20and%20toothpastes.';

  const lookup: {
    [key: string]: { dangers: ReactElement; recycling: ReactElement };
  } = {
    'abc-shampoo': {
      dangers: (
        <div>
          Users have marked this product as containing microplastics based on
          its ingredients list.{' '}
          <a href={microplasticsLink}>Read more about microplastics</a>
        </div>
      ),
      recycling: (
        <div>
          This packaging contains type 1 plastic, which should be recyclable at
          the curb.{''}
          <a href="http://">See recycling centers that accept this plastic</a>
        </div>
      ),
    },
    'halo-infinite': {
      dangers: (
        <div>
          Users have marked this product as containing microplastics based on
          its ingredients list.{' '}
          <a href={microplasticsLink}>Read more about microplastics</a>
        </div>
      ),
      recycling: (
        <div>
          This packaging contains type 1 plastic, which should be recyclable at
          the curb.{''}
          <a href="http://">See recycling centers that accept this plastic</a>
          CDs, the major component reported by users, are only recyclable at{' '}
          <a href="http://">Specific locations</a>. We suggest looking at
          similar{' '}
          <a href="http://" target="_blank" rel="noopener noreferrer">
            digital substitutes
          </a>
          .
        </div>
      ),
    },
  };

  const info = lookup[props.product];

  return (
    <div className="productBox">
      <div className="product">
        <div className="productDescription">
          <h2>{props.product}</h2>
          {info.dangers}
          {info.recycling}
        </div>

        <img className="productImg" src={test}></img>
      </div>
      <div className="productButtons">
        <button>Vote</button>
        <button>Buy</button>
        <button>Add sustainability information</button>
        <button>Share</button>
      </div>
    </div>
  );
}

interface Product {
  product: string;
}

interface ServerReceiptResponse {
  name: string;
  price: string;
  receiptID: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = async () => {
    const res = await axios.get('http://localhost:5000/api/data');
    const data: ServerReceiptResponse[] = res.data;
    const products: Product[] = data.map((d) => ({
      product: d.name,
      // company: d.price,
    }));
    setProducts(products);
  };

  useEffect(() => {
    loadData();
  }, []);

  // const elements = [
  //   { product: 'Shampoo 1', company: 'Company A' },
  //   { product: 'Shampoo 2', company: 'Company B' },
  //   { product: 'Shampoo 3', company: 'Company C' },
  //   { product: 'Body Wash 1', company: 'Company A' },
  // ];

  return (
    <body className="mainPage">
      <div className="topBar">
        <h1 className="topBarTitle">
          Green Receipts | Past Receipt Information
        </h1>
      </div>
      <div className="productBoxes">
        {products.map((value, index) => {
          return <Product key={index} product={value.product}></Product>;
        })}
      </div>
      <div className="bottomBar">
        <Link to="../home">
          <img src={home}></img>
        </Link>
        <Link to="../camera">
          <img src={takePic}></img>
        </Link>
        <a href="../profile">
          <img src={profile}></img>
        </a>
      </div>
    </body>
  );
}
