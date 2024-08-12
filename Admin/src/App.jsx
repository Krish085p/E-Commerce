import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin'; // Import the Admin component (assuming this path is correct)
import 'dotenv'

const App = () => {
  return (
    <div>
      <Navbar />
      <Admin />
    </div>
  );
}

export default App;
