import background from './assets/background.jpg';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div
      className="front-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div>
        <h2 className="text-1">Green Receipts</h2>
      </div>
      <div>
        <a href="home">
          <button className="continue">Continue</button>
        </a>
      </div>
    </div>
  );
}
