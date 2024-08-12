import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);

//   return <div>
//     <StarRating color='red' onSetRating={setMovieRating} />
//     <p>this movie is rated {movieRating} stars</p>
//   </div>
// }


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <StarRating
      starNum={5} size={24}
      color={'blue'}
      className='test'
      messages={['terrible', 'poor', 'ok', 'Good', 'fantastic']}
      defaltRating={3}
    />
    <StarRating starNum={10} />
    <Test /> */}
    <App />
  </React.StrictMode>
);


