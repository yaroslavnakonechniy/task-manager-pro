import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import { store } from './app/store.ts'
import './index.css'
import App from './App.tsx'
import "antd/dist/reset.css";

createRoot(document.getElementById('root')!).render(
    <Provider store={store} >
      <App />
    </Provider>
)
