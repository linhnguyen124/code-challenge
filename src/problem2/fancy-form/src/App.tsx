import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { cn } from 'utils/helpers';
import styles from './App.module.css';
import FancyForm from './components/FancyForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <section className='h-screen w-screen relative flex flex-col items-center justify-center'>
        <div className={cn(styles['bg'], 'absolute size-full')} />
        <FancyForm />
      </section>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
