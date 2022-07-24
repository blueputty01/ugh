import takePic from './assets/takePic.png';
import home from './assets/home.png';
import profile from './assets/profile.png';
import test from './assets/test.png';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <body className="mainPage">
      <div className="topBar">
        <h1 className="topBarTitle">Green Receipts</h1>
      </div>
      <div className="productBoxes">
        {elements.map((value, index) => {
          return (
            <div className="productBox" key={index}>
              <div className="product">
                <h2>
                  Product
                  <p className="companySubtitle">Company</p>
                </h2>
                <img className="productImg" src={test}></img>
              </div>
              <hr className="optionsSeparator"></hr>
            </div>
          );
        })}
      </div>
      <div className="bottomBar">
        <a href="#news">
          <img src={home}></img>
        </a>
        <Link to="camera">
          <img src={takePic}></img>
        </Link>
        <a href="#news">
          <img src={profile}></img>
        </a>
      </div>
    </body>
  );
}
