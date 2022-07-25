import takePic from './assets/takePic.png';
import home from './assets/home.png';
import profile from './assets/profile.png';
import test from './assets/test.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ProductProps {
  product: string;
  company: string;
}

function Product(props: ProductProps) {
  return (
    <div className="productBox">
      <div className="product">
        <div>
          <h2>{props.product}</h2>
          <p className="companySubtitle">{props.company}</p>
        </div>

        <img className="productImg" src={test}></img>
      </div>
      <div className="productButtons">
        <button>Vote</button>
        <button>Buy</button>
        <button>Share</button>
      </div>
    </div>
  );
}

interface Product {
  product: string;
  company: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = async () => {
    const res = await axios.get('http://localhost:5000/api/data');
    setProducts(res.data as Product[]);
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
        <h1 className="topBarTitle">Green Receipts</h1>
      </div>
      <div className="productBoxes">
        {products.map((value, index) => {
          return (
            <Product
              key={index}
              product={value.product}
              company={value.company}
            ></Product>
          );
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
